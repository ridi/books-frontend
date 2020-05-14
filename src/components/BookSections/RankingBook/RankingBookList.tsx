import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import { BreakPoint, greaterThanOrEqualTo, orBelow } from 'src/utils/mediaQuery';

import { createTimeLabel } from 'src/utils/dateTime';
import {
  BookItem,
  MdBook,
  ReadingRanking,
  SectionExtra,
  StarRating,
} from 'src/types/sections';
import * as BookApi from 'src/types/book';
import BookMeta from 'src/components/BookMeta';
import { useBookDetailSelector } from 'src/hooks/useBookDetailSelector';
import { AdultBadge } from 'src/components/Badge/AdultBadge';
import { BadgeContainer } from 'src/components/Badge/BadgeContainer';
import BookBadgeRenderer from 'src/components/Badge/BookBadgeRenderer';
import FreeBookRenderer from 'src/components/Badge/FreeBookRenderer';
import SetBookRenderer from 'src/components/Badge/SetBookRenderer';
import ThumbnailRenderer from 'src/components/BookThumbnail/ThumbnailRenderer';
import ScrollContainer from 'src/components/ScrollContainer';
import { getMaxDiscountPercentage } from 'src/utils/common';
import { CLOCK_ICON_URL } from 'src/constants/icons';

import { computeBookTitle } from 'src/utils/bookTitleGenerator';
import { getThumbnailIdFromBookDetail } from 'src/utils/books';

import { SectionTitle, SectionTitleLink } from '../SectionTitle';

const SectionWrapper = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 24px;
  padding-bottom: 24px;

  ${orBelow(
    999,
    `
      padding-top: 16px;
      padding-bottom: 16px;
    `,
  )};
  position: relative;
`;

const BIG_ITEM_HEIGHT = 138;
const SMALL_ITEM_HEIGHT = 94;

const RankPosition = styled.h3`
  height: 22px;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  color: #000000;
  margin-right: 21px;
`;

const TimerWrapper = styled.div<{ opacity: number }>`
  border-radius: 14px;
  width: 96px;
  height: 30px;
  background-image: linear-gradient(255deg, #0077d9 4%, #72d2e0);
  font-size: 13px;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 13px 9px 9px;
  margin-bottom: 16px;
  transition: opacity 0.3s;
  opacity: ${(props) => props.opacity};
  > span,
  svg {
    flex: none;
  }
`;

interface RankingBookListProps {
  slug: string;
  items: ReadingRanking[];
  type: 'small' | 'big';
  title?: string;
  showTimer: boolean;
  genre: string;
  extra?: SectionExtra;
  showSomeDeal?: boolean;
}

const Timer: React.FC = () => {
  const [label, setLabel] = useState(createTimeLabel);
  useEffect(() => {
    const timer = setInterval(() => {
      setLabel(createTimeLabel());
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, [label, setLabel]);
  return (
    <TimerWrapper opacity={!label ? 0 : 1}>
      <img src={CLOCK_ICON_URL} height={12} width={12} alt="현재 시각" />
      <span>{label}</span>
    </TimerWrapper>
  );
};

const List = styled.ul<{ type: 'big' | 'small' }>`
  display: -ms-grid; // emotion이 쓰는 stylis.js가 grid를 지원하지 않음
  -ms-grid-rows: (${({ type }) => (type === 'big' ? BIG_ITEM_HEIGHT : SMALL_ITEM_HEIGHT)}px)[3];
  -ms-grid-columns: 308px 13px 308px 13px 308px; // gap 시뮬레이션
  display: grid;
  grid: repeat(3, ${({ type }) => (type === 'big' ? BIG_ITEM_HEIGHT : SMALL_ITEM_HEIGHT)}px) / auto-flow 308px;
  grid-column-gap: 13px;

  padding-left: 16px;
  padding-right: 16px;

  ${greaterThanOrEqualTo(
    BreakPoint.MD + 1,
    `
      padding-left: 20px;
      padding-right: 20px;
    `,
  )};

  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    `
      padding-left: 24px;
      padding-right: 24px;
    `,
  )};
`;

const RankingBookItem = styled.li<{ type: 'big' | 'small' }>`
  display: flex;
  align-items: center;
  box-sizing: content-box;
  .book-meta-box {
    display: flex;
    align-items: center;
    border-bottom: 1px #e6e8eb solid;
    height: 100%;
    width: 100%;
  }
  :nth-of-type(3n) {
    .book-meta-box {
      border-bottom: 0;
    }
  }
`;

const ThumbnailAnchor = styled.a<{ marginRight: number }>`
  flex: none;
  margin-right: ${(props) => props.marginRight}px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

interface ItemListProps {
  books: BookItem[];
  slug: string;
  genre: string;
  type: 'small' | 'big';
  showSomeDeal?: boolean;
}
function RankingBook({
  book,
  order: index,
  slug,
  genre,
  type,
  showSomeDeal,
  rating,
}: Omit<ItemListProps, 'books'> & {book: BookApi.Book; order: number; rating?: StarRating}) {
  const title = computeBookTitle(book);
  return (
    // auto-flow 안 되는 IE11을 위한 땜빵
    <RankingBookItem
      type={type}
      key={index}
      style={{
        msGridColumn: Math.floor(index / 3) * 2 + 1,
        msGridRow: (index % 3) + 1,
      }}
    >
      <ThumbnailAnchor
        data-book-id={book.id}
        data-order={index}
        data-slug={slug}
        marginRight={type === 'big' ? 18 : 24}
        href={`/books/${book.id}`}
      >
        <ThumbnailRenderer
          slug={slug}
          className={slug}
          order={index}
          css={css`
            width: ${type === 'big' ? 80 : 50}px;
            max-height: ${type === 'big' ? 114 : 71}px;
          `}
          sizes={type === 'big' ? '80px' : '50px'}
          thumbnailId={getThumbnailIdFromBookDetail(book) || book.id}
          isAdultOnly={book.property.is_adult_only || false}
          imgSize="large"
          title={title}
        >
          {type === 'big' && (
            <BadgeContainer>
              <BookBadgeRenderer
                isRentable={
                  (!!book.price_info?.rent || !!book.series?.price_info?.rent)
                  && ['general', 'romance', 'bl'].includes(genre)
                }
                isWaitFree={book.series?.property.is_wait_free}
                discountPercentage={getMaxDiscountPercentage(book)}
              />
            </BadgeContainer>
          )}
          {type === 'big' && (
            <>
              <FreeBookRenderer
                freeBookCount={
                  book.series?.price_info?.rent?.free_book_count
                  || book.series?.price_info?.buy?.free_book_count
                  || 0
                }
                unit={book.series?.property.unit || '권'}
              />
              <SetBookRenderer setBookCount={book.setbook?.member_books_count} />
            </>
          )}
          {book.property?.is_adult_only && <AdultBadge />}
        </ThumbnailRenderer>
      </ThumbnailAnchor>
      <div className="book-meta-box">
        <RankPosition aria-label={`랭킹 순위 ${index + 1}위`}>{index + 1}</RankPosition>
        <BookMeta
          book={book}
          titleLineClamp={type === 'small' ? 1 : 2}
          isAIRecommendation={false}
          showSomeDeal={showSomeDeal}
          showTag={false}
          width={type === 'big' ? '177px' : undefined}
          ratingInfo={type === 'big' ? rating : undefined}
        />
      </div>
    </RankingBookItem>
  );
}

const ItemList: React.FC<ItemListProps> = (props) => {
  const {
    books, slug, type, genre, showSomeDeal,
  } = props;
  return (
    <ScrollContainer>
      <List type={type}>
        {books
          .filter((book) => book.detail)
          .slice(0, 9)
          .map((book, index) => (
            <RankingBook
              key={book.detail?.id}
              slug={slug}
              type={type}
              order={index}
              showSomeDeal={showSomeDeal}
              genre={genre}
              rating={(book as MdBook).rating}
              book={book.detail as BookApi.Book}
            />
          ))}
      </List>
    </ScrollContainer>
  );
};

const RankingBookList: React.FC<RankingBookListProps> = (props) => {
  const [books] = useBookDetailSelector(props.items);
  const {
    genre, type, showSomeDeal, slug,
  } = props;

  return (
    <SectionWrapper>
      {props.title && (
        <SectionTitle>
          {props.showTimer && <Timer />}
          <SectionTitleLink
            title={props.title}
            href={props.extra?.detail_link}
          />
        </SectionTitle>
      )}
      <ItemList
        books={books}
        slug={slug}
        genre={genre}
        type={type}
        showSomeDeal={showSomeDeal}
      />
    </SectionWrapper>
  );
};

export default RankingBookList;
