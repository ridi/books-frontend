import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { gray100, slateGray50, slateGray60 } from '@ridi/colors';

import Switch from 'src/components/Switch';
import { ADULT_BADGE_URL } from 'src/constants/icons';
import * as SearchTypes from 'src/types/searchResults';
import { getEscapedNode } from 'src/utils/highlight';
import { BreakPoint, greaterThanOrEqualTo, orBelow } from 'src/utils/mediaQuery';

import AuthorInfo from './Authors/AuthorInfo';
import { SearchResult } from './types';

const BookListItem = styled.li<{ focused?: boolean }>`
  ${orBelow(BreakPoint.LG, 'min-height: 40px;')};
  cursor: pointer;

  :hover, :focus-within {
    background-color: rgba(0, 0, 0, 0.05);
  }
  ${(props) => props.focused && 'background-color: rgba(0, 0, 0, 0.05);'}
  ${(props) => orBelow(
    BreakPoint.LG,
    `
      :hover, :focus-within {
        background-color: white;
      }
      ${props.focused && 'background-color: white;'}
    `,
  )}
  &, button {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05);
  }
`;

const AuthorListItem = styled(BookListItem)`
  display: flex;
`;

const searchResultItemButton = css`
  height: 100%;
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  flex-wrap: wrap;

  &:focus {
    outline: none;
  }
`;

const AuthorListItemButton = styled.button`
  ${searchResultItemButton}
`;

const BookListItemButton = styled.button`
  display: flex;
  align-items: center;
  ${searchResultItemButton}
`;

const BookTitle = styled.span`
  font-size: 14px;
  line-height: 1.4em;
  word-break: keep-all;
  margin-right: 6px;
  color: ${gray100};
  ${greaterThanOrEqualTo(BreakPoint.LG + 1, 'max-width: 298px;')};
`;

const authorPublisherCSS = css`
  line-height: 1.4em;
  color: ${slateGray50};
  -webkit-font-smoothing: antialiased;
  max-width: 298px;
`;

const Author = styled.span`
  ${authorPublisherCSS};
  font-size: 14px;
  margin-right: 5px;
`;

const AuthorPublisher = styled.span`
  ${authorPublisherCSS};
  font-size: 13px;
  padding-left: 5px;
  margin-right: 5px;
  ${greaterThanOrEqualTo(BreakPoint.LG + 1, 'max-width: 298px;')}
`;

const InstantSearchDivider = styled.hr`
  height: 1px;
  border: 0;
  border-top: 1px solid #e6e8e0;
  margin: 4px 16px;
  display: block;
`;

const Divider = styled.div`
  height: 12px;
  width: 1px;
  background: #e6e8e0;
`;

const AdultExcludeButton = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 44px;
  margin-bottom: 4px;
  padding: 9px 16px;
  outline: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  color: ${slateGray60};
  :active {
    background-color: rgba(0, 0, 0, 0.05);
  }
  :hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05);
`;

interface InstantSearchResultProps {
  focusedPosition?: number;
  result: SearchResult;
  adultExclude?: boolean;
  onAuthorClick?(id: number): void;
  onBookClick?(id: string): void;
  onAdultExcludeChange?(value: boolean): void;
  className?: string;
}

// Todo 사용 컴포넌트마다 다른 options 사용해서 보여주기
const AuthorLabel: React.FC<{ author: string; authors: SearchTypes.AuthorsInfo[] }> = (props) => {
  const viewedAuthors = props.authors
    && props.authors
      .filter((author) => author.role !== 'translator')
      .map((author) => author.name);
  if (!viewedAuthors || viewedAuthors.length === 0) {
    return <Author>{props.author}</Author>;
  }

  return (
    <Author>
      {viewedAuthors.length > 2
        ? `${viewedAuthors[0]} 외 ${viewedAuthors.length - 1}명`
        : `${viewedAuthors.join(', ')}`}
    </Author>
  );
};

const ResultWrapper = styled.div`
  padding: 4px 0 0;
  border-radius: 3px;
  background-color: white;

  ${orBelow(BreakPoint.LG, 'border-radius: 0;')}
`;

export default function InstantSearchResult(props: InstantSearchResultProps) {
  const {
    focusedPosition,
    result: { authors, books },
    adultExclude = false,
    onAuthorClick,
    onBookClick,
    onAdultExcludeChange,
    className,
  } = props;
  const handleAuthorClick = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    const id = e.currentTarget.dataset.authorId;
    id && onAuthorClick?.(Number(id));
  }, [onAuthorClick]);
  const handleBookClick = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    const id = e.currentTarget.dataset.bookId;
    id && onBookClick?.(id);
  }, [onBookClick]);
  const authorCount = authors.length;

  return (
    <ResultWrapper className={className}>
      {authors.length > 0 && (
        <>
          <ul>
            {authors.map((author, index) => (
              <AuthorListItem
                key={index}
                focused={focusedPosition === index}
              >
                <AuthorListItemButton
                  type="button"
                  data-author-id={author.id}
                  tabIndex={-1}
                  onClick={handleAuthorClick}
                >
                  <AuthorInfo author={author} />
                </AuthorListItemButton>
              </AuthorListItem>
            ))}
          </ul>
          <InstantSearchDivider />
        </>
      )}
      {books.length > 0 && (
        <>
          <ul>
            {books.map((book: SearchTypes.SearchBookDetail, index) => (
              <BookListItem
                key={index}
                focused={focusedPosition === authorCount + index}
              >
                <BookListItemButton
                  type="button"
                  data-book-id={book.b_id}
                  tabIndex={-1}
                  onClick={handleBookClick}
                >
                  <BookTitle>
                    {getEscapedNode(
                      book.highlight.web_title_title || book.web_title_title,
                    )}
                  </BookTitle>
                  <AuthorLabel author={book.author} authors={book.authors_info} />
                  <Divider />
                  <AuthorPublisher>{book.publisher}</AuthorPublisher>
                  {book.age_limit > 18 && (
                    <img width={19} src={ADULT_BADGE_URL} alt="성인 전용 도서" />
                  )}
                </BookListItemButton>
              </BookListItem>
            ))}
          </ul>
          <InstantSearchDivider />
          <AdultExcludeButton>
            성인 제외
            <Switch checked={adultExclude} onChange={onAdultExcludeChange} />
          </AdultExcludeButton>
        </>
      )}
    </ResultWrapper>
  );
}
