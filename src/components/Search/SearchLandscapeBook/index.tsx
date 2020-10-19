import { css } from '@emotion/core';
import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import {
  orange40,
  slateGray20,
  slateGray40,
  slateGray50,
  slateGray60,
} from '@ridi/colors';
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSearchQueries } from 'src/hooks/useSearchQueries';

import { getEscapedNode } from 'src/utils/highlight';
import { constructSearchDesc } from 'src/utils/books';
import { computeSearchBookTitle } from 'src/utils/bookTitleGenerator';
import { BreakPoint, greaterThanOrEqualTo, orBelow } from 'src/utils/mediaQuery';
import * as SearchTypes from 'src/types/searchResults';
import { AuthorsInfo } from 'src/types/searchResults';
import Star from 'src/svgs/Star.svg';
import ThumbnailWithBadge from 'src/components/Book/ThumbnailWithBadge';
import { lineClamp } from 'src/styles';
import useAppContext from 'src/hooks/useAppContext';
import { useBookSelector, useBookDescription } from 'src/hooks/useBookDetailSelector';
import sentry from 'src/utils/sentry';
import * as tracker from 'src/utils/event-tracker';

import Skeleton from '../Skeleton/SearchLandscapeBook';
import MetaWrapper from './MetaWrapper';
import PriceInfo from './PriceInfo';

export const Wrapper = styled.div`
  display: flex;
  padding: 20px 0;
  align-items: flex-start;
`;

const StyledThumbnailWithBadge = styled(ThumbnailWithBadge)`
  width: 100px;
  ${orBelow(BreakPoint.LG, 'width: 80px;')}
`;

const SearchBookTitle = styled.h3`
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.36em;
  a:active, a:hover {
    text-decoration-line: underline;
  }
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05);
  ${lineClamp(2)}
`;

const SearchBookMetaList = styled.ul`
  display: flex;
  margin-bottom: 6px;
  ${orBelow(BreakPoint.LG, 'flex-direction: column; margin-bottom: 4px;')};
`;

const SearchBookMetaItem = styled.li`
  margin-bottom: 4px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05);
  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    `
      margin-bottom: 0;
      :not(:last-of-type)::after {
        content: '|';
        color: ${slateGray20};
        margin: 0 8px;
      }
    `,
  )};
`;

const SeriesCompleted = styled.span`
  padding: 3px 4px;
  background: ${slateGray40};
  color: white;
  font-size: 10px;
  font-weight: bold;
  margin-left: 4px;
  height: 16px;
  border-radius: 3px;
  position: relative;
  top: -1px;
`;

const starColors = {
  orange: orange40,
  gray: slateGray20,
};

const StyledStar = styled(Star, {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'fill',
})<{ color: 'orange' | 'gray' }>`
  margin-right: 2px;
  fill: ${(props) => starColors[props.color]};
`;
const authorStyle = css`
  color: ${slateGray60};
  font-size: 14px;
`;
const normalFieldStyle = css`
  color: ${slateGray50};
  font-size: 13px;
`;
const ratingStyle = css`
  color: ${orange40};
  font-size: 13px;
  font-weight: bold;
`;

const ratingCountStyle = css`
  color: ${slateGray40};
  font-size: 12px;
`;

const fieldStyles = {
  author: authorStyle,
  normal: normalFieldStyle,
  rating: ratingStyle,
  rating_count: ratingCountStyle,
};

const SearchBookMetaField = styled.span<{
  type: 'author' | 'normal' | 'rating' | 'rating_count';
}>`
  line-height: 1.36em;
  a:active, a:hover {
    text-decoration-line: underline;
  }
  -webkit-tap-highlight-color: transparent;
  ${(props) => fieldStyles[props.type]}
`;

const ThumbnailAnchor = styled.a`
  flex: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.15);
`;

const BookDesc = styled.p`
  max-width: 836px;
  font-size: 13px;
  margin-bottom: 6px;
  color: ${slateGray60};
  line-height: 1.4em;
  word-break: keep-all;
  ${orBelow(BreakPoint.LG, 'display: none;')}
`;

function StarCount({ count }: { count: number }) {
  return (
    <SearchBookMetaField type="rating_count">
      (
      {count.toLocaleString('ko-KR')}
      )
    </SearchBookMetaField>
  );
}

interface SearchLandscapeBookProps {
  index: number;
  q: string;
  item: SearchTypes.SearchBookDetail;
  title: string;
}

type CategoryNames = Pick<
  SearchTypes.SearchBookDetail,
  | 'category_name'
  | 'parent_category_name'
  | 'parent_category_name2'
>;

function computeCategoryNames(categoryNames: CategoryNames) {
  const {
    category_name,
    parent_category_name,
    parent_category_name2,
  } = categoryNames;

  if (!parent_category_name && !parent_category_name2) {
    return category_name;
  }
  if (parent_category_name && !parent_category_name2) {
    return parent_category_name;
  }
  if (!parent_category_name && parent_category_name2) {
    return parent_category_name2;
  }
  if (parent_category_name && parent_category_name === parent_category_name2) {
    return parent_category_name;
  }

  return `${parent_category_name}, ${parent_category_name2}`;
}

function RenderAuthors(props: { authors: AuthorsInfo[]; fallback: string }) {
  const { authors, fallback } = props;
  const router = useRouter();
  const { calculateUpdateQuery } = useSearchQueries();
  const { isInApp } = useAppContext();

  if (authors.length === 0 || isInApp) {
    const anchor = isInApp ? `${router.pathname}?${calculateUpdateQuery({ q: fallback })}` : `${router.pathname}?q=${fallback}`;
    return (
      <a href={anchor}>{fallback}</a>
    );
  }
  if (authors.length === 1) {
    return (
      <a href={`/author/${authors[0].author_id}`}>{authors[0].name}</a>
    );
  }
  return (
    <>
      <a href={`/author/${authors[0].author_id}`}>{authors[0].name}</a>
      {', '}
      <a href={`/author/${authors[1].author_id}`}>{authors[1].name}</a>
      {authors.length > 2 && ` 외 ${authors.length - 2}명`}
    </>
  );
}

export default function SearchLandscapeBook(props: SearchLandscapeBookProps) {
  const {
    item, title, q, index,
  } = props;
  const router = useRouter();
  const { isInApp } = useAppContext();

  const book = useBookSelector(item.b_id);
  const rawDesc = useBookDescription(item.b_id);
  if (book === null) {
    return <Skeleton />;
  }
  if (book.isDeleted) {
    return null;
  }
  const categoryInfo: CategoryNames = {
    category_name: item.category_name,
    parent_category_name: item.parent_category_name,
    parent_category_name2: item.parent_category_name2,
  };
  const clearDesc = rawDesc ? constructSearchDesc(rawDesc) : '';
  // 대여 배지 표기 여부가 장르에 따라 바뀌기 때문에 장르를 모아둠
  const genres = book.categories.map((category) => category.sub_genre) ?? ['general'];
  let translator: AuthorsInfo | undefined;
  const authors: AuthorsInfo[] = [];
  item.authors_info.forEach((author) => {
    if (author.role === 'translator') {
      translator = author;
    } else {
      authors.push(author);
    }
  });
  const searchParam = new URLSearchParams();
  searchParam.set('_s', 'search');
  searchParam.set('_q', q);
  const searchBookClick = () => {
    try {
      tracker.sendClickEvent(
        item,
        `search.result_book.${genres[0]}`,
        index,
      );
    } catch (error) {
      sentry.captureException(error);
    }
  };

  let anchor = `/books/${item.b_id}?${searchParam.toString()}`;
  if (isInApp) {
    searchParam.append('book_title', item.title);
    anchor = `/books/${item.b_id}/in-app-search?${searchParam.toString()}`;
  }
  // 인앱에서는 북컴포넌트 전체를 링크로 사용
  const WrapperWithAnchor = isInApp ? Wrapper.withComponent('a') : Wrapper;

  return (
    <WrapperWithAnchor {...isInApp && { href: anchor }}>
      <ThumbnailAnchor href={anchor} onClick={searchBookClick}>
        <StyledThumbnailWithBadge
          bId={item.b_id}
          genre={genres[0] ?? ''}
          slug={`search.result_book.${genres[0] ?? 'etc'}`}
          sizes="(min-width: 999px) 100px, 80px"
          title={title}
        />
      </ThumbnailAnchor>
      <MetaWrapper>
        <SearchBookTitle>
          <a href={anchor} onClick={searchBookClick}>
            {getEscapedNode(computeSearchBookTitle(item))}
          </a>
        </SearchBookTitle>
        <SearchBookMetaList>
          <SearchBookMetaItem>
            <SearchBookMetaField type="author">
              <RenderAuthors authors={authors} fallback={item.author} />
            </SearchBookMetaField>
          </SearchBookMetaItem>
          {translator && (
            <SearchBookMetaItem>
              <SearchBookMetaField type="normal">
                <a href={`/author/${translator.author_id}`}>
                  {translator.name}
                  {' '}
                  역
                </a>
              </SearchBookMetaField>
            </SearchBookMetaItem>
          )}
          <SearchBookMetaItem>
            {item.buyer_rating_score > 0 ? (
              <>
                <StyledStar color="orange" />
                <SearchBookMetaField type="rating">
                  {item.buyer_rating_score.toFixed(1)}
                  점
                  {' '}
                </SearchBookMetaField>
              </>
            ) : (
              <StyledStar color="gray" />
            )}
            <StarCount count={item.buyer_rating_count} />
          </SearchBookMetaItem>
          <SearchBookMetaItem>
            <SearchBookMetaField type="normal">
              <Link href={`${router.pathname}?q=${encodeURIComponent(`출판사:${item.publisher}`)}`} passHref>
                <a>
                  {item.highlight.publisher
                    ? getEscapedNode(item.highlight.publisher)
                    : item.publisher}
                </a>
              </Link>
            </SearchBookMetaField>
          </SearchBookMetaItem>
          <SearchBookMetaItem>
            <SearchBookMetaField type="normal">
              {computeCategoryNames(categoryInfo)}
            </SearchBookMetaField>
          </SearchBookMetaItem>
          {item.book_count > 1 && book.categories[0].is_series_category && (
            <SearchBookMetaItem>
              <SearchBookMetaField type="normal">
                {`총 ${book.series?.totalBookCount || item.book_count}${book.unit || '권'}`}
              </SearchBookMetaField>
              {item.series_prices_info.length > 0 && book.series?.isComplete && (
                <SeriesCompleted>완결</SeriesCompleted>
              )}
            </SearchBookMetaItem>
          )}
        </SearchBookMetaList>
        <a href={anchor} onClick={searchBookClick}>
          <BookDesc>
            {clearDesc.length > 170 ? `${clearDesc.slice(0, 170)}...` : clearDesc}
          </BookDesc>
        </a>
        <PriceInfo
          searchApiResult={item}
          bookApiResult={book}
          genre={genres[0] ?? ''}
        />
      </MetaWrapper>
    </WrapperWithAnchor>
  );
}
