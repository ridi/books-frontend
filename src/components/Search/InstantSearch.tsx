import { css } from '@emotion/core';
import styled from '@emotion/styled';
import libAxios from 'axios';
import { useRouter, NextRouter } from 'next/router';
import React from 'react';
import Cookies from 'universal-cookie';

import localStorageKeys from 'src/constants/localStorage';
import * as labels from 'src/labels/instantSearch.json';
import { RIDITheme } from 'src/styles';
import Clear from 'src/svgs/Clear.svg';
import Lens from 'src/svgs/Lens.svg';
import axios, { CancelToken, CancelTokenType } from 'src/utils/axios';
import { runWithExponentialBackoff, CancelledError } from 'src/utils/backoff';
import { isJamo } from 'src/utils/hangul';
import { orBelow, BreakPoint } from 'src/utils/mediaQuery';
import sentry from 'src/utils/sentry';
import { checkInstantSearchResult } from 'src/types/searchResults';
import { localStorage } from 'src/utils/storages';

import InstantSearchHistory from './InstantSearchHistory';
import InstantSearchResult from './InstantSearchResult';
import { SearchResult } from './types';

const WrapperForm = styled.form<{ focused?: boolean }>`
  flex: 1;
  max-width: 340px;
  order: 2;
  z-index: 10;
  ${(props) => orBelow(BreakPoint.LG, `
    flex: none;
    width: 100%;
    max-width: 100%;
    order: 3;
    ${props.focused && `
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
    `}
  `)}
`;

const FocusTrap = styled.div`
  &, &:focus {
    outline: none;
  }
`;

const SearchBoxWrapper = styled.div<{ focused?: boolean }, RIDITheme>`
  ${(props) => orBelow(BreakPoint.LG, `
    padding-top: 9px;
    ${props.focused && `
      padding: 6px;
      background-color: ${props.theme.primaryColor};
    `}
  `)}
`;

const SearchBoxShape = styled.label`
  background: white;
  border-radius: 3px;

  display: flex;
  align-items: center;
`;

const StyledClear = styled(Clear)`
  display: block;
  width: 24px;
  height: 24px;
  padding: 5px;
`;

const StyledLens = styled(Lens)<{}, RIDITheme>`
  fill: ${(props) => props.theme.input.placeholder};
  flex: none;
  width: 24px;
  height: 24px;
  margin: 4px;
  margin-left: 6px;
  opacity: 0.6;
`;

const SearchBox = styled.input`
  flex: 1;
  height: 32px;
  padding: 7px 0;
  font-size: 16px;
  line-height: 18px;
`;

const SearchResetButton = styled.button`
  outline: none;
  margin: 4px;
  margin-right: 6px;
`;

const popupStyle = css`
  position: absolute;
  width: 380px;
  margin-top: 2px;
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.3) 3px 3px 10px 3px;
  z-index: 10;

  ${orBelow(BreakPoint.LG, `
    position: static;
    width: 100%;
    margin-top: 0;
    border-radius: 0;
    box-shadow: none;
  `)}
`;

async function doInstantSearch(
  keyword: string,
  adultExclude: boolean,
  token: CancelTokenType,
): Promise<SearchResult | null> {
  const url = new URL('/search', process.env.NEXT_STATIC_SEARCH_API);
  const params = new URLSearchParams([
    ['site', 'ridi-store'],
    ['where', 'book'],
    ['where', 'author'],
    ['what', 'instant'],
    ['keyword', keyword],
    ['adult_exclude', adultExclude ? 'y' : 'n'],
  ]);
  url.search = params.toString();
  const urlString = url.toString();
  try {
    const resp = await runWithExponentialBackoff(
      async () => {
        try {
          return await axios.get(urlString, {
            cancelToken: token,
          });
        } catch (err) {
          if (libAxios.isCancel(err)) {
            throw new CancelledError();
          }
          throw err;
        }
      },
      { backoffTimeUnit: 200, maxTries: 3 },
    );
    const data = checkInstantSearchResult(resp.data);
    return {
      books: data.book.books,
      authors: data.author.authors,
    };
  } catch (err) {
    const statusCode = err?.response?.statusCode ?? 0;
    if (statusCode !== 401 && statusCode !== 403) {
      sentry.captureException(err);
    }
    return null;
  }
}

function initializeAdultExclude(router: NextRouter) {
  if (router.query.adult_exclude) {
    return router.query.adult_exclude === 'y';
  }
  const cookie = new Cookies();
  const cookieValue = cookie.get('adult_exclude');
  return cookieValue === 'y';
}

export default function InstantSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = React.useState(String(router.query.q || ''));
  const [isFocused, setFocused] = React.useState(false);
  const [disableRecord, setDisableRecord] = React.useState(() => {
    const value = localStorage.getItem(localStorageKeys.instantSearchHistoryOption);
    if (value == null) {
      return false;
    }
    try {
      const parsedValue = JSON.parse(value);
      if (typeof parsedValue === 'boolean') {
        // localStorage에는 저장 여부가 들어있기 때문에 뒤집는다
        return !parsedValue;
      }
    } catch (_) {
      // do nothing
    }
    return false;
  });
  const [adultExclude, setAdultExclude] = React.useState(() => initializeAdultExclude(router));
  const [focusedPosition, setFocusedPosition] = React.useState<number | null>(null);

  type SearchHistoryAction =
    | { type: 'add'; item: string }
    | { type: 'remove'; index: number }
    | { type: 'clear' }
  ;
  const [searchHistory, updateSearchHistory] = React.useReducer(
    (state: string[], action: SearchHistoryAction) => {
      switch (action.type) {
        case 'add':
          return [...new Set([action.item, ...state])].slice(0, 5);
        case 'remove':
          return state.filter((_, idx) => idx !== action.index);
        case 'clear':
          return [];
        default:
          return state;
      }
    },
    null,
    () => {
      const history = localStorage.getItem(localStorageKeys.instantSearchHistory);
      if (history == null) {
        return [];
      }
      try {
        const parsedHistory = JSON.parse(history);
        if (
          Array.isArray(parsedHistory)
          && parsedHistory.every((item) => typeof item === 'string')
        ) {
          return parsedHistory
            .map((item) => item.trim())
            .filter((item) => item !== '');
        }
      } catch (_) {
        // invalid history, do nothing
      }
      return [];
    },
  );

  type InstantSearchState =
    | { type: 'cold' }
    | { type: 'pending'; keyword: string; adultExclude: boolean; result?: SearchResult }
    | { type: 'done'; keyword: string; result: SearchResult }
  ;
  type InstantSearchAction =
    | { type: 'started'; keyword: string; adultExclude: boolean }
    | { type: 'done'; keyword: string; adultExclude: boolean; result: SearchResult }
  ;
  const [instantSearchState, updateInstantSearchState] = React.useReducer(
    (state: InstantSearchState, action: InstantSearchAction) => {
      switch (action.type) {
        case 'started':
          if (action.keyword === '') {
            return { type: 'cold' as 'cold' };
          }
          return {
            ...state,
            type: 'pending' as 'pending',
            keyword: action.keyword,
            adultExclude: action.adultExclude,
          };
        case 'done':
          if (
            state.type === 'pending'
            && state.keyword === action.keyword
            && state.adultExclude === action.adultExclude
          ) {
            return {
              type: 'done' as 'done',
              keyword: action.keyword,
              result: action.result,
            };
          }
          return state;
        default:
          return state;
      }
    },
    { type: 'cold' },
  );

  const doSearch = React.useCallback((searchKeyword: string) => {
    const trimmedKeyword = searchKeyword.trim();
    if (trimmedKeyword === '') {
      return;
    }
    if (!disableRecord) {
      updateSearchHistory({ type: 'add', item: trimmedKeyword });
    }
    const params = new URLSearchParams({
      q: trimmedKeyword,
      adult_exclude: adultExclude ? 'y' : 'n',
    });
    window.location.href = `/search?${params.toString()}`;
  }, [disableRecord, adultExclude]);

  const handleSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    doSearch(keyword);
  }, [keyword, disableRecord, adultExclude]);

  const handleKeywordChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const handleKeywordReset = React.useCallback(() => {
    setKeyword('');
  }, []);

  const handleHistoryItemClick = React.useCallback((idx: number) => {
    const historyKeyword = searchHistory[idx].trim();
    setKeyword(historyKeyword);
    doSearch(historyKeyword);
  }, [searchHistory]);

  const handleHistoryItemRemove = React.useCallback((idx: number) => {
    if (!disableRecord) {
      updateSearchHistory({ type: 'remove', index: idx });
    }
  }, [disableRecord]);

  const handleHistoryClear = React.useCallback(() => {
    if (!disableRecord) {
      updateSearchHistory({ type: 'clear' });
    }
  }, [disableRecord]);

  const handleAuthorClick = React.useCallback((id: number) => {
    const params = new URLSearchParams({
      _s: 'instant',
      _q: keyword,
    });
    setFocused(false);
    window.location.href = `/author/${id}?${params.toString()}`;
  }, [keyword]);

  const handleBookClick = React.useCallback((id: string) => {
    const params = new URLSearchParams({
      _s: 'instant',
      _q: keyword,
    });
    setFocused(false);
    window.location.href = `/books/${id}?${params.toString()}`;
  }, [keyword]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    let itemCount = 0;
    let authors: SearchResult['authors'] = [];
    let books: SearchResult['books'] = [];
    if (keyword === '') {
      itemCount = searchHistory.length;
    } else if (instantSearchState.type === 'done' || instantSearchState.type === 'pending') {
      const { result } = instantSearchState;
      if (result != null) {
        authors = result.authors;
        books = result.books;
        itemCount = authors.length + books.length;
      }
    }

    let newPosition = focusedPosition ?? itemCount;
    switch (e.key) {
      case 'ArrowDown':
      case 'Down':
        newPosition += 1;
        break;
      case 'ArrowUp':
      case 'Up':
        newPosition -= 1;
        break;
      case 'Enter':
        if (focusedPosition != null) {
          e.preventDefault();
          e.stopPropagation();
          if (keyword === '') {
            handleHistoryItemClick(focusedPosition);
          } else if (focusedPosition < authors.length) {
            handleAuthorClick(authors[focusedPosition].id);
          } else if (focusedPosition < itemCount) {
            handleBookClick(books[focusedPosition - authors.length].b_id);
          }
        }
        return;
      default:
        setFocusedPosition(null);
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    newPosition += itemCount + 1;
    newPosition %= (itemCount + 1);
    setFocusedPosition(newPosition === itemCount ? null : newPosition);
  }, [focusedPosition, keyword, searchHistory, instantSearchState]);

  const handleFocus = React.useCallback(() => setFocused(true), []);
  const handleBlur = React.useCallback((e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget || document.activeElement;
    if (!e.currentTarget.contains(relatedTarget as (Element | null))) {
      setFocused(false);
    }
    setFocusedPosition(null);
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      setAdultExclude(initializeAdultExclude(router));
    }
  }, [isFocused]);

  React.useEffect(() => {
    const cookie = new Cookies();
    cookie.set(
      'adult_exclude',
      adultExclude ? 'y' : 'n',
      { path: '/', sameSite: 'lax' },
    );
  }, [adultExclude]);

  React.useEffect(() => {
    // localStorage에는 저장 여부가 들어있기 때문에 뒤집는다
    const value = JSON.stringify(!disableRecord);
    localStorage.setItem(
      localStorageKeys.instantSearchHistoryOption,
      value,
    );
  }, [disableRecord]);

  React.useEffect(() => {
    const keywordToSearch = keyword.trim();
    updateInstantSearchState({
      type: 'started',
      keyword: keywordToSearch,
      adultExclude,
    });

    if (keywordToSearch === '') {
      return;
    }
    if (keywordToSearch.length === 1 && isJamo(keywordToSearch)) {
      return;
    }
    const cancelSource = CancelToken.source();
    const handle = window.setTimeout(() => {
      // make the linter happy
      (async () => {
        const result = await doInstantSearch(
          keywordToSearch,
          adultExclude,
          cancelSource.token,
        );
        if (result == null) {
          return;
        }

        updateInstantSearchState({
          type: 'done',
          keyword: keywordToSearch,
          adultExclude,
          result,
        });
        setFocusedPosition(null);
      })().catch((err) => {
        if (err?.message === 'Cancel') {
          return;
        }
        sentry.captureException(err);
      });
    }, 1000);
    return () => {
      window.clearTimeout(handle);
      cancelSource.cancel();
    };
  }, [keyword, adultExclude]);

  React.useEffect(() => {
    const history = JSON.stringify(searchHistory);
    localStorage.setItem(localStorageKeys.instantSearchHistory, history);
  }, [searchHistory]);

  let popup = null;
  if (isFocused) {
    if (keyword === '') {
      popup = (
        <InstantSearchHistory
          css={popupStyle}
          disableRecord={disableRecord}
          searchHistory={searchHistory}
          focusedPosition={focusedPosition ?? undefined}
          onDisableRecordChange={setDisableRecord}
          onItemClick={handleHistoryItemClick}
          onItemRemove={handleHistoryItemRemove}
          onItemHover={setFocusedPosition}
          onClear={handleHistoryClear}
        />
      );
    } else if (instantSearchState.type === 'done' || instantSearchState.type === 'pending') {
      const { result } = instantSearchState;
      if (result != null) {
        popup = (
          <InstantSearchResult
            css={popupStyle}
            focusedPosition={focusedPosition ?? undefined}
            result={result}
            adultExclude={adultExclude}
            onAuthorClick={handleAuthorClick}
            onBookClick={handleBookClick}
            onAdultExcludeChange={setAdultExclude}
            onItemHover={setFocusedPosition}
          />
        );
      }
    }
  }

  return (
    <WrapperForm
      focused={isFocused}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onSubmit={handleSubmit}
    >
      {/* 검색창 내부 포커스를 여기서 잡음 */}
      <FocusTrap tabIndex={-1} onKeyDown={handleKeyDown}>
        <SearchBoxWrapper focused={isFocused}>
          <SearchBoxShape>
            <StyledLens />
            <SearchBox
              placeholder={labels.searchPlaceHolder}
              value={keyword}
              onChange={handleKeywordChange}
            />
            {isFocused && keyword !== '' && (
              <SearchResetButton type="button" onClick={handleKeywordReset}>
                <StyledClear />
              </SearchResetButton>
            )}
          </SearchBoxShape>
        </SearchBoxWrapper>
        {popup}
      </FocusTrap>
    </WrapperForm>
  );
}
