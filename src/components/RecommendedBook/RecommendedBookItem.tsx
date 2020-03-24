import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { ThumbnailWrapper } from 'src/components/BookThumbnail/ThumbnailWrapper';
import { PortraitBook } from 'src/components/Book/PortraitBook';
import { DisplayType, HotRelease, TodayRecommendation } from 'src/types/sections';
import BookBadgeRenderer from 'src/components/Badge/BookBadgeRenderer';
import FreeBookRenderer from 'src/components/Badge/FreeBookRenderer';
import SetBookRenderer from 'src/components/Badge/SetBookRenderer';
import ThumbnailRenderer from 'src/components/BookThumbnail/ThumbnailRenderer';
import { AdultBadge } from 'src/components/Badge/AdultBadge';
import { BadgeContainer } from 'src/components/Badge/BadgeContainer';
import { getMaxDiscountPercentage } from 'src/utils/common';
import { newlineToReactNode } from 'src/utils/highlight';
import { BreakPoint } from 'src/utils/mediaQuery';

import BookMeta from './BookMeta';

interface CommonProps {
  index: number;
  theme: 'white' | 'dark';
  slug?: string;
  genre: string;
  className?: string;
}

interface TodayRecommendationProps {
  type: DisplayType.TodayRecommendation;
  book: TodayRecommendation;
}

interface HotReleaseProps {
  type: DisplayType.HotRelease;
  book: HotRelease;
}

type Props = CommonProps & (TodayRecommendationProps | HotReleaseProps);

const bookWidthStyle = css`
  width: 100px;

  @media (min-width: 1000px) {
    width: 140px;
  }
`;

const RecommendationText = styled.p<{ bg?: 'white' | 'dark' }>`
  padding-left: 0;
  position: relative;
  margin-top: 10px;

  line-height: 18px;
  text-align: center;
  font-weight: bold;
  white-space: nowrap;
  font-size: 13px;

  width: 140px;
  @media (max-width: ${BreakPoint.LG}px) {
    width: 130px;
  }

  ${({ bg }) => bg === 'dark' && 'color: white;'}
`;

function RecommendedBookItem(props: Props) {
  const {
    book, index, type, theme, slug, genre, className,
  } = props;
  const href = `/books/${book.b_id}`;
  const singlePriceInfo = book.detail?.price_info;
  const seriesPriceInfo = book.detail?.series?.price_info;
  return (
    <PortraitBook className={className}>
      <a
        css={css`display: inline-block;`}
        href={href}
      >
        <ThumbnailWrapper>
          <ThumbnailRenderer
            order={index}
            className={slug}
            css={bookWidthStyle}
            sizes="(min-width: 1000px) 140px, 100px"
            slug={slug}
            book={{ b_id: book.b_id, detail: book.detail }}
            imgSize="large"
          >
            <BadgeContainer>
              <BookBadgeRenderer
                type={type}
                isRentable={
                  (!!singlePriceInfo?.rent
                    || !!seriesPriceInfo?.rent)
                  && ['general', 'romance', 'bl'].includes(genre)
                }
                isWaitFree={book.detail?.series?.property.is_wait_free}
                discountPercentage={getMaxDiscountPercentage(book.detail)}
              />
            </BadgeContainer>
            <FreeBookRenderer
              freeBookCount={
                seriesPriceInfo?.rent?.free_book_count
                || seriesPriceInfo?.buy?.free_book_count
                || 0
              }
              unit={book.detail?.series?.property.unit || '권'}
            />
            <SetBookRenderer setBookCount={book.detail?.setbook?.member_books_count} />
            {book.detail?.property?.is_adult_only && <AdultBadge />}
          </ThumbnailRenderer>
        </ThumbnailWrapper>
      </a>
      {/* Todo show sentence */}
      {book.detail && type === DisplayType.HotRelease && <BookMeta book={book.detail} />}
      {book.detail && type === DisplayType.TodayRecommendation && (
        <RecommendationText bg={theme}>
          {newlineToReactNode(book.sentence)}
        </RecommendationText>
      )}
    </PortraitBook>
  );
}

export default React.memo(RecommendedBookItem);
