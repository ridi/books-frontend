import React, { useState, useEffect, useCallback } from 'react';
import { css, keyframes } from '@emotion/core';
import ArrowLeft from 'src/svgs/Arrow_Left_13.svg';
import Lens from 'src/svgs/Lens.svg';
import Clear from 'src/svgs/Clear.svg';
import { RIDITheme, ZIndexLayer } from 'src/styles';
import { useDebouncedCallback } from 'use-debounce';
import localStorageKeys from 'src/constants/localStorage';
import * as labels from 'src/labels/instantSearch.json';
import { isOnsetNucleusCoda } from 'src/utils/hangle';
import { safeJSONParse } from 'src/utils/common';
import axios from 'axios';
import InstantSearchResult from 'src/components/Search/InstantSearchResult';
import InstantSearchHistory from 'src/components/Search/InstantSearchHistory';
import { get } from 'ts-get';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import pRetry from 'p-retry';
import sentry from 'src/utils/sentry';
import styled from '@emotion/styled';
import { useTheme } from 'emotion-theming';

const { captureException } = sentry();

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const placeHolderCSS = css`
  opacity: 1;
  font-size: 16px;
  height: 19px;
  line-height: 19px;
  font-weight: 500;
`;

const SearchWrapper = styled.div<{}, RIDITheme>`
  font-size: 16px;
  background-color: #ffffff;
  box-sizing: border-box;
  min-width: 340px;
  border-radius: 3px;
  height: 32px;
  line-height: 32px;
  ${orBelow(
    BreakPoint.LG,
    css`
      height: 36px;
      line-height: 36px;
      min-width: unset;
      width: 100%;
    `,
  )};
  outline: none;
  form {
    width: 100%;
  }

  input {
    flex-shrink: 0;
    position: relative;
    padding-right: 3.75px; // 4 * 0.9375
    width: 98%;
    font-size: 16px;
    outline: none;
    transform: scale(0.9375);
    transform-origin: top left;
    font-weight: 500;
    color: #000000;
    ::placeholder {
      ${placeHolderCSS};
      color: ${(props) => props.theme.input.placeholder};
    }
    ::-moz-placeholder {
      ${placeHolderCSS};
      color: ${(props) => props.theme.input.placeholder};
    }
    :-moz-placeholder {
      ${placeHolderCSS};
      color: ${(props) => props.theme.input.placeholder};
    }
  }
  display: flex;
  align-items: center;
`;

const iconStyle = (theme: RIDITheme) => css`
  fill: ${theme.input.placeholder};
  flex-shrink: 0;
  margin: 5.5px 2.5px 5px 7.5px;
  width: 24px;
  height: 24px;
`;

const RemoveSearchButton = styled.button`
  outline: none;
  position: relative;
  right: 10px;
  display: flex;
  align-items: center;
`;

const focused = (theme: RIDITheme) => css`
  order: 2;
  ${orBelow(
    BreakPoint.LG,
    css`
      margin-top: 0;
      position: absolute;
      top: 0;
      left: 0;
      z-index: ${ZIndexLayer.LEVEL_9};
      background: ${theme.primaryColor};
      width: 100%;
      padding: 6px;
      box-sizing: border-box;
      animation: ${fadeIn} 0.2s ease-in-out;
      display: flex;
      align-items: center;
      order: 3;
    `,
  )};
`;

const initial = () => css`
  position: relative;
  margin-top: unset;
  outline: unset;
  order: 2;
  ${orBelow(
    BreakPoint.LG,
    css`
      margin-top: 10px;
      order: 3;
    `,
  )};
`;

const SearchFooter = styled.div`
  box-sizing: border-box;
  position: absolute;
  background-color: white;
  width: 380px;
  box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  z-index: ${ZIndexLayer.LEVEL_9};
  margin-top: 2px;
  ${orBelow(
    BreakPoint.LG,
    css`
      width: 100vw;
      left: 6px;
      box-shadow: unset;
      margin-left: -6px;
      top: 48px;
      margin-top: unset;
      border-radius: 0;
    `,
  )};
  // ie11
  @media (max-width: 999px) and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    top: 46px;
  }
`;

const dimmer = css`
  display: none;
  ${orBelow(
    BreakPoint.LG,
    css`
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: ${ZIndexLayer.LEVEL_8};
      background: rgba(0, 0, 0, 0.5);
    `,
  )};
`;

const arrow = css`
  display: none;
  cursor: pointer;
  fill: white;
  width: 16px;
  height: 16px;
  ${orBelow(
    BreakPoint.LG,
    css`
      display: block;
    `,
  )};
`;

const ArrowWrapperButton = styled.button`
  display: none;
  ${orBelow(
    BreakPoint.LG,
    css`
      display: block;
      padding: 0 11px 0 5px;
    `,
  )};
`;

export interface AuthorInfo {
  author_id: number;
  b_id: string;
  name: string;
  order: number;
  role: 'author' | 'translator' | 'illustrator';
}

export interface InstantSearchBookResultScheme {
  b_id: string;
  highlight: {
    web_title_title?: string;
    web_title_title_raw?: string;
    author_title_title?: string;
    author_title_title_raw?: string;
  };
  web_title_title?: string;
  web_title_title_raw?: string;
  author_title_title?: string;
  author_title_title_raw?: string;
  author: string;
  author2: string;
  authors_info: AuthorInfo[];
  publisher: string;
}

export interface InstantSearchAuthorResultScheme {
  popular_book_title: string;
  book_count: number;
  name: string;
  id: number;
  name_raw: string;
  popular_book_title_raw: string;
  highlight: {
    name: string;
    name_raw: string;
  };
}

export interface InstantSearchResultScheme {
  books: InstantSearchBookResultScheme[];
  authors: InstantSearchAuthorResultScheme[];
}

interface InstantSearchProps {
  searchKeyword: string;
  isPartials: boolean;
}

const initialSearchResult = {
  books: [],
  authors: [],
};

export const InstantSearch: React.FC<InstantSearchProps> = React.memo(
  (props: InstantSearchProps) => {
    const { isPartials, searchKeyword } = props;
    const inputRef = React.useRef<HTMLInputElement>();
    const listWrapperRef = React.useRef<HTMLDivElement>();
    const theme = useTheme<RIDITheme>();
    const [isLoaded, setLoaded] = useState(false);
    const [isFocused, setFocus] = useState(false);
    const [keyword, setKeyword] = useState<string>(searchKeyword);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [enableSearchHistoryRecord, toggleSearchHistoryRecord] = useState(true);
    const [focusedPosition, setFocusedPosition] = useState(0);
    const [, setFetching] = useState(false);
    const [searchResult, setSearchResult] = useState<InstantSearchResultScheme>(
      initialSearchResult,
    );

    const handleSearch = useCallback(async (value: string) => {
      setFetching(true);
      if (value.trim().length < 1) {
        setFetching(false);
        return;
      }
      try {
        const url = new URL('/search', process.env.NEXT_PUBLIC_SEARCH_API);
        url.searchParams.append('site', 'ridi-store');
        url.searchParams.append('where', 'book');
        url.searchParams.append('where', 'author');
        url.searchParams.append('what', 'instant');
        url.searchParams.append('keyword', value);

        const result = await pRetry(() => axios.get(url.toString()), { retries: 2 });
        setSearchResult({
          books: get(result.data, (data) => data.book.books, []),
          authors: get(result.data, (data) => data.author.authors, []),
        });
      } catch (error) {
        setSearchResult(initialSearchResult);
        setFocusedPosition(0);
        captureException(error);
      } finally {
        setFetching(false);
      }
    }, []);
    const [debouncedHandleSearch] = useDebouncedCallback(handleSearch, 300);

    const handleOnChange = useCallback(
      (value: string) => {
        // 초-중-종성 체크
        if (value.length > 0) {
          if (value.length === 1 && isOnsetNucleusCoda(value[0])) {
            setSearchResult(initialSearchResult);
          } else {
            debouncedHandleSearch(value);
          }
        } else {
          setSearchResult(initialSearchResult);
          debouncedHandleSearch(value);
        }
        setFocusedPosition(0);
      },
      [debouncedHandleSearch],
    );
    const [debouncedOnChange] = useDebouncedCallback(handleOnChange, 100, {});
    const passEventTarget = (e) => {
      const copiedValue = e.target.value;
      setKeyword(copiedValue);
      debouncedOnChange(copiedValue);
    };

    const handleSearchWrapperBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
      const relatedTarget = e.relatedTarget || document.activeElement; // IE11
      if (!relatedTarget || !e.currentTarget.contains(relatedTarget as Element)) {
        setFocus(false);
        setFocusedPosition(0);
      }
    }, []);

    const handleToggleSearchHistoryRecord = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        localStorage.setItem(
          localStorageKeys.instantSearchHistoryOption,
          JSON.stringify(!enableSearchHistoryRecord),
        );
        toggleSearchHistoryRecord(!enableSearchHistoryRecord);
        setFocusedPosition(0);
      },
      [enableSearchHistoryRecord, toggleSearchHistoryRecord],
    );

    const handleRemoveHistory = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const label = e.currentTarget.getAttribute('data-value');
        if (label) {
          const historySet = new Set<string>([...searchHistory]);
          historySet.delete(label);
          const newHistory: string[] = Array<string>(...historySet);
          setSearchHistory(newHistory);
          // setFocusedPosition(0);
          localStorage.setItem(
            localStorageKeys.instantSearchHistory,
            JSON.stringify(newHistory.slice(0, 10)),
          );
        }
      },
      [searchHistory],
    );

    const handleClearInput = useCallback(
      (e) => {
        e.preventDefault();
        inputRef.current.value = '';
        setKeyword('');
        inputRef.current.focus();
      },
      [inputRef],
    );

    const handleClearHistory = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (enableSearchHistoryRecord) {
          localStorage.setItem(localStorageKeys.instantSearchHistory, JSON.stringify([]));
          setSearchHistory([]);
          setFocusedPosition(0);
        }
      },
      [enableSearchHistoryRecord],
    );

    const handleClickHistoryItem = useCallback((e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      const label = e.currentTarget.getAttribute('data-value');
      if (label) {
        setKeyword(label);
        setFocus(false);
        setSearchResult(initialSearchResult);

        const url = new URL(
          '/search/',
          isPartials ? process.env.NEXT_PUBLIC_ACCOUNT_HOST : location.href,
        );
        url.searchParams.append('q', label);

        window.location.href = url.toString();
      }
    }, []);

    const handleClickBookItem = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const { bookId } = e.currentTarget.dataset;

        const url = new URL(
          `/books/${bookId}`,
          isPartials ? process.env.NEXT_PUBLIC_ACCOUNT_HOST : location.href,
        );
        url.searchParams.append('_s', 'instant');
        url.searchParams.append('_q', keyword);

        window.location.href = url.toString();
        setFocus(false);
      },
      [keyword],
    );
    const handleClickAuthorItem = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const { authorId } = e.currentTarget.dataset;
        const url = new URL(
          `/author/${authorId}`,
          isPartials ? process.env.NEXT_PUBLIC_ACCOUNT_HOST : location.href,
        );
        url.searchParams.append('_s', 'instant');
        url.searchParams.append('_q', keyword);

        window.location.href = url.toString();
        setFocus(false);
      },
      [keyword],
    );

    const focusedWithSearch = () => {
      setFocus(true);
      debouncedHandleSearch(keyword);
    };

    const handleSubmit = useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (keyword.length > 0) {
          if (enableSearchHistoryRecord) {
            const newHistory = Array<string>(
              ...new Set<string>([keyword, ...searchHistory]),
            ).slice(0, 10);
            setSearchHistory(newHistory);
            localStorage.setItem(
              localStorageKeys.instantSearchHistory,
              JSON.stringify(newHistory),
            );
          }
          // Move search result page
          // Todo conditional check for partial component

          const url = new URL(
            '/search/',
            isPartials ? process.env.NEXT_PUBLIC_ACCOUNT_HOST : location.href,
          );
          url.searchParams.append('q', keyword);

          window.location.href = url.toString();

          setFocus(false);
          if (inputRef.current) {
            inputRef.current.blur();
          }
        }
      },
      [keyword, enableSearchHistoryRecord, searchHistory],
    );

    const handleSetCurrentPosition = useCallback((pos: number) => {
      setFocusedPosition(pos);
      if (pos === 0 && inputRef.current) {
        inputRef.current.focus();
      }
    }, []);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent | KeyboardEvent) => {
        if (!inputRef.current) {
          return;
        }
        if (e.which === 13 && e.target) {
          (e.target as HTMLLIElement).click();
        }
        if (e.which === 40 || e.which === 38) {
          e.preventDefault();

          const history = safeJSONParse(
            window.localStorage.getItem(localStorageKeys.instantSearchHistory),
            [],
          ).slice(0, 5);
          const total = inputRef.current.value.length < 1
            ? history.length
            : searchResult.authors.length + searchResult.books.length;
          if (e.which === 40) {
            // keyDown
            const nextPos = focusedPosition + 1;
            const pos = nextPos > total ? 0 : nextPos;
            handleSetCurrentPosition(pos);
          } else {
            const prevPos = focusedPosition - 1;
            const pos = prevPos < 0 ? total : prevPos;
            handleSetCurrentPosition(pos);
          }
        }
      },
      [
        handleSetCurrentPosition,
        focusedPosition,
        searchResult.authors.length,
        searchResult.books.length,
      ],
    );
    useEffect(() => {
      toggleSearchHistoryRecord(
        safeJSONParse(
          window.localStorage.getItem(localStorageKeys.instantSearchHistoryOption),
          true,
        ),
      );
      const history = safeJSONParse(
        window.localStorage.getItem(localStorageKeys.instantSearchHistory),
        [],
      );

      setSearchHistory(Array<string>(...new Set<string>(history)));

      if (inputRef.current) {
        setLoaded(true);

        // 검색어 query string 있을 경우 업데이트
        if (location.pathname.startsWith('/search')) {
          const searchParams = new URLSearchParams(window.location.search);
          setKeyword(searchParams.get('q') ?? '');
        }
      }

      return () => {
        // Unmount
      };
    }, []);

    const showFooter = React.useMemo(
      () =>
        // eslint-disable-next-line
        ((keyword.length < 1 && searchHistory.length > 0) ||
          searchResult.books.length > 0
          || searchResult.authors.length > 0)
        && isFocused,
      [
        isFocused,
        keyword.length,
        searchHistory.length,
        searchResult.authors.length,
        searchResult.books.length,
      ],
    );

    return (
      <>
        <div
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          onBlur={handleSearchWrapperBlur}
          css={[
            isFocused ? focused(theme) : initial(),
            css`
              outline: none;
              ${orBelow(
              BreakPoint.LG,
              css`
                  width: 100%;
                `,
            )}
            `,
          ]}
        >
          {isFocused && (
            // eslint-disable-next-line react/jsx-no-bind
            <ArrowWrapperButton onClick={setFocus.bind(null, false)}>
              <ArrowLeft css={arrow} />
              <span className="a11y">{labels.goBack}</span>
            </ArrowWrapperButton>
          )}
          <SearchWrapper>
            <Lens
              css={css`
                ${iconStyle(theme)};
                opacity: ${isFocused ? 1 : 0.6};
              `}
            />
            <form onSubmit={handleSubmit} autoComplete="off">
              <input
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                disabled={!isLoaded}
                aria-label={labels.searchPlaceHolder}
                aria-required="true"
                defaultValue={keyword}
                ref={inputRef}
                type="text"
                name="instant_search"
                placeholder={labels.searchPlaceHolder}
                onFocus={focusedWithSearch}
                onClick={focusedWithSearch}
                onKeyDown={handleKeyDown}
                onChange={passEventTarget}
              />
            </form>
            {keyword.length > 0 && isFocused && (
              <RemoveSearchButton onClick={handleClearInput}>
                <Clear
                  css={css`
                    width: 14px;
                    height: 14px;
                  `}
                />
                <span className="a11y">모두 지우기</span>
              </RemoveSearchButton>
            )}
          </SearchWrapper>
          {showFooter && (
            <SearchFooter ref={listWrapperRef}>
              <form>
                {keyword.length < 1 && searchHistory.length > 0 ? (
                  <InstantSearchHistory
                    searchHistory={searchHistory}
                    enableSearchHistoryRecord={enableSearchHistoryRecord}
                    handleClickHistoryItem={handleClickHistoryItem}
                    handleClearHistory={handleClearHistory}
                    handleRemoveHistory={handleRemoveHistory}
                    handleToggleSearchHistoryRecord={handleToggleSearchHistoryRecord}
                    handleKeyDown={handleKeyDown}
                    focusedPosition={focusedPosition}
                  />
                ) : (
                  <InstantSearchResult
                    handleKeyDown={handleKeyDown}
                    handleClickBookItem={handleClickBookItem}
                    handleClickAuthorItem={handleClickAuthorItem}
                    focusedPosition={focusedPosition}
                    result={searchResult}
                  />
                )}
              </form>
            </SearchFooter>
          )}
        </div>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        {isFocused && <div onClick={setFocus.bind(null, false)} css={dimmer} />}
      </>
    );
  },
);

export default InstantSearch;
