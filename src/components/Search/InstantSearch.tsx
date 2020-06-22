import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import React from 'react';

import localStorageKeys from 'src/constants/localStorage';
import { RIDITheme } from 'src/styles';
import Clear from 'src/svgs/Clear.svg';
import Lens from 'src/svgs/Lens.svg';
import { orBelow, BreakPoint } from 'src/utils/mediaQuery';
import { localStorage } from 'src/utils/storages';

import InstantSearchHistory from './InstantSearchHistory';
import InstantSearchResult from './InstantSearchResult';

import mockResult from './mock.json';

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

const SearchBoxShape = styled.div`
  background: white;
  border-radius: 3px;

  display: flex;
  align-items: center;
`;

const StyledClear = styled(Clear)`
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

type SearchHistoryAction =
  | { type: 'add'; item: string }
  | { type: 'remove'; index: number }
  | { type: 'clear' }
;

export default function InstantSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = React.useState(String(router.query.q || ''));
  const [isFocused, setFocused] = React.useState(false);
  const [disableRecord, setDisableRecord] = React.useState(false);
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
  const [adultExclude, setAdultExclude] = React.useState(false);

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

  const handleFocus = React.useCallback(() => setFocused(true), []);
  const handleBlur = React.useCallback((e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget || document.activeElement;
    if (!e.currentTarget.contains(relatedTarget as (Element | null))) {
      setFocused(false);
    }
  }, []);

  React.useEffect(() => {
    const history = JSON.stringify(searchHistory);
    localStorage.setItem(localStorageKeys.instantSearchHistory, history);
  }, [searchHistory]);

  return (
    <WrapperForm
      focused={isFocused}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onSubmit={handleSubmit}
    >
      {/* 검색창 내부 포커스를 여기서 잡음 */}
      <FocusTrap tabIndex={-1}>
        <SearchBoxWrapper focused={isFocused}>
          <SearchBoxShape>
            <StyledLens />
            <SearchBox onChange={handleKeywordChange} value={keyword} />
            {isFocused && keyword !== '' && (
              <SearchResetButton type="button" onClick={handleKeywordReset}>
                <StyledClear />
              </SearchResetButton>
            )}
          </SearchBoxShape>
        </SearchBoxWrapper>
        {isFocused && (
          keyword === '' ? (
            <InstantSearchHistory
              css={popupStyle}
              disableRecord={disableRecord}
              searchHistory={searchHistory}
              onDisableRecordChange={setDisableRecord}
              onItemClick={handleHistoryItemClick}
              onItemRemove={handleHistoryItemRemove}
              onClear={handleHistoryClear}
            />
          ) : (
            <InstantSearchResult
              css={popupStyle}
              focusedPosition={0}
              result={{ books: mockResult.book.books, authors: mockResult.author.authors }}
              adultExclude={adultExclude}
              onAdultExcludeChange={setAdultExclude}
            />
          )
        )}
      </FocusTrap>
    </WrapperForm>
  );
}
