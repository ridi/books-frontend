import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import * as labels from 'src/labels/instantSearch.json';
import * as colors from '@ridi/colors';
import { RIDITheme } from 'src/styles';
import Exclamation from 'src/svgs/Exclamation_1.svg';
import Close from 'src/svgs/Close_2.svg';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

const TurnOffSearchHistory = styled.div`
  text-align: center;
  width: 100%;
  height: 160px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  box-sizing: content-box;
  font-size: 14px;
  color: ${colors.slateGray80};
`;

const RecentHistoryLabel = styled.p`
  padding: 12px 0 12px 16px;
  font-size: 14px;
  font-weight: normal;
  color: ${colors.slateGray50};
`;

const RemoveHistoryButton = styled.button`
  margin-left: 16px;
  height: 42px;
  width: 42px;
  outline: none;
  flex: none;
`;

const closeIcon = (theme: RIDITheme) => css`
  fill: ${theme.icon.warn};
  width: 12px;
  height: 12px;
`;

const exclamation = (theme: RIDITheme) => css`
  margin-right: 3px;
  fill: ${theme.etc.slot1};
  width: 14px;
  height: 14px;
`;

const HistoryList = styled.ul`
  li {
    box-sizing: border-box;
  }
`;

const SearchHistoryItem = styled.li<{ focused?: boolean }>`
  cursor: pointer;
  box-sizing: border-box;
  padding-left: 16px;
  font-size: 14px;
  line-height: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  a {
    padding: 14px 0;
    span {
      color: #303538;
      font-size: 15px;
      line-height: 1.33;
    }
  }
  :hover {
    background-color: #f7fafc;
  }
  :focus {
    background-color: #f7fafc;
  }
  ${(props) => props.focused && 'background-color: #f7fafc;'}
  ${(props) => orBelow(
    BreakPoint.LG,
    `
      :hover {
        background-color: white;
      }
      :focus {
        background-color: white;
      }
      ${props.focused && 'background-color: white;'}
    `,
  )}
  outline: none;
`;

const HistoryOptionPanel = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  background-color: ${colors.slateGray5};
  color: ${colors.slateGray50};
  font-size: 14px;
  line-height: 1;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  button {
    color: ${colors.slateGray80};
    opacity: 0.7;
  }
`;

const HistoryOptionButton = styled.button`
  font-size: 14px;
  outline: none;
`;

interface InstantSearchHistoryProps {
  searchHistory: string[];
  focusedPosition?: number;
  disableRecord?: boolean;
  onItemClick?(index: number): void;
  onItemRemove?(index: number): void;
  onItemHover?(index: number): void;
  onClear?(): void;
  onDisableRecordChange?(disableRecord: boolean): void;
  className?: string;
}

const InstantSearchHistory: React.FC<InstantSearchHistoryProps> = (props) => {
  const {
    searchHistory,
    focusedPosition,
    disableRecord,
    onItemClick,
    onItemRemove,
    onItemHover,
    onClear,
    onDisableRecordChange,
    className,
  } = props;

  const wrapperRef = React.useRef<HTMLUListElement>(null);

  const hasHistory = searchHistory.length > 0;
  return (
    <div css={css`background-color: white;`} className={className}>
      <RecentHistoryLabel>{labels.recentKeywords}</RecentHistoryLabel>
      <HistoryList ref={wrapperRef}>
        {!disableRecord && hasHistory ? (
          searchHistory.map((history: string, index: number) => (
            <SearchHistoryItem
              key={index}
              focused={index === focusedPosition}
              onClick={() => onItemClick?.(index)}
              onMouseEnter={() => onItemHover?.(index)}
            >
              {/* Fixme href */}
              <a href="#history" tabIndex={-1}>
                <span>{history}</span>
              </a>
              <RemoveHistoryButton
                data-value={history}
                type="button"
                onClick={(e) => { e.stopPropagation(); onItemRemove?.(index); }}
              >
                <Close css={closeIcon} />
                <span className="a11y">{labels.removeHistory}</span>
              </RemoveHistoryButton>
            </SearchHistoryItem>
          ))
        ) : (
          <TurnOffSearchHistory>
            {disableRecord && <Exclamation css={exclamation} />}
            <span
              css={css`
                color: #9ea7ad;
              `}
            >
              {disableRecord ? labels.turnOffStatus : labels.noSearchHistory}
            </span>
          </TurnOffSearchHistory>
        )}
      </HistoryList>
      <HistoryOptionPanel>
        <HistoryOptionButton
          type="button"
          onClick={() => onDisableRecordChange?.(!disableRecord)}
        >
          {!disableRecord
            ? labels.turnOffSearchHistory
            : labels.turnOnSearchHistory}
        </HistoryOptionButton>
        {hasHistory && !disableRecord && (
          <HistoryOptionButton
            type="button"
            onClick={onClear}
          >
            {labels.clearSearchHistory}
          </HistoryOptionButton>
        )}
      </HistoryOptionPanel>
    </div>
  );
};

export default InstantSearchHistory;
