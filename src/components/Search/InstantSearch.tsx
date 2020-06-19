import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import React from 'react';

import { RIDITheme } from 'src/styles';
import { orBelow, BreakPoint } from 'src/utils/mediaQuery';
import Lens from 'src/svgs/Lens.svg';

import InstantSearchHistory from './InstantSearchHistory';

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

const StyledInstantSearchHistory = styled(InstantSearchHistory)`
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
    [],
  );

  const handleSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!disableRecord) {
      updateSearchHistory({ type: 'add', item: keyword });
    }
  }, [keyword, disableRecord]);
  const handleKeywordChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const handleHistoryItemClick = React.useCallback((idx: number) => {
    setKeyword(searchHistory[idx]);
  }, [searchHistory]);
  const handleHistoryItemRemove = React.useCallback((idx: number) => {
    updateSearchHistory({ type: 'remove', index: idx });
  }, []);
  const handleHistoryClear = React.useCallback(() => {
    updateSearchHistory({ type: 'clear' });
  }, []);

  const handleFocus = React.useCallback(() => setFocused(true), []);
  const handleBlur = React.useCallback((e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget || document.activeElement;
    if (!e.currentTarget.contains(relatedTarget as (Element | null))) {
      setFocused(false);
    }
  }, []);

  return (
    <WrapperForm
      focused={isFocused}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onSubmit={handleSubmit}
    >
      {/* 검색창 내부 포커스를 여기서 잡음 */}
      <div tabIndex={-1}>
        <SearchBoxWrapper focused={isFocused}>
          <SearchBoxShape>
            <StyledLens />
            <SearchBox onChange={handleKeywordChange} value={keyword} />
          </SearchBoxShape>
        </SearchBoxWrapper>
        {isFocused && (
          <StyledInstantSearchHistory
            disableRecord={disableRecord}
            searchHistory={searchHistory}
            onDisableRecordChange={setDisableRecord}
            onItemClick={handleHistoryItemClick}
            onItemRemove={handleHistoryItemRemove}
            onClear={handleHistoryClear}
          />
        )}
      </div>
    </WrapperForm>
  );
}
