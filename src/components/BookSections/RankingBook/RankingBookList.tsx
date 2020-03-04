import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
// import BookMeta from 'src/components/BookMeta/BookMeta';
import { RankingBookTitle } from 'src/components/BookSections/BookSectionContainer';
import { useIntersectionObserver } from 'src/hooks/useIntersectionObserver';
import ArrowV from 'src/svgs/ArrowV.svg';
import { displayNoneForTouchDevice, scrollBarHidden } from 'src/styles';
import { BreakPoint, greaterThanOrEqualTo, orBelow } from 'src/utils/mediaQuery';
import Arrow, { arrowTransition } from 'src/components/Carousel/Arrow';
import Clock from 'src/svgs/Clock.svg';
import { useScrollSlider } from 'src/hooks/useScrollSlider';
import { createTimeLabel } from 'src/utils/dateTime';
import { DisplayType, MdBook, ReadingRanking, SectionExtra } from 'src/types/sections';
import BookMeta from 'src/components/BookMeta/BookMeta';
import { useBookDetailSelector } from 'src/hooks/useBookDetailSelector';
import BookBadgeRenderer from 'src/components/Badge/BookBadgeRenderer';
import FreeBookRenderer from 'src/components/Badge/FreeBookRenderer';
import SetBookRenderer from 'src/components/Badge/SetBookRenderer';
import ThumbnailRenderer from 'src/components/BookThumbnail/ThumbnailRenderer';
import { DeviceTypeContext } from 'src/components/Context/DeviceType';
import {
  sendClickEvent,
  useEventTracker,
  useSendDisplayEvent,
} from 'src/hooks/useEventTracker';
import { getMaxDiscountPercentage } from 'src/utils/common';
import { useMultipleIntersectionObserver } from 'src/hooks/useMultipleIntersectionObserver';
import { AdultBadge } from 'src/components/Badge/AdultBadge';

const SectionWrapper = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 24px;
  padding-bottom: 24px;

  ${orBelow(
    999,
    css`
      padding-top: 16px;
      padding-bottom: 16px;
    `,
  )}
`;

const listCSS = css`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 100%;
  padding-left: 16px;
  padding-right: 16px;

  ${greaterThanOrEqualTo(
    BreakPoint.MD + 1,
    css`
      padding-left: 20px;
      padding-right: 20px;
    `,
  )};

  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    css`
      padding-left: 24px;
      padding-right: 24px;
    `,
  )};

  ${greaterThanOrEqualTo(
    BreakPoint.LG,
    css`
      //overflow: auto;
    `,
  )};
  ${scrollBarHidden};
  overflow-x: auto;
`;

const itemCSS = css`
  flex: none;
  display: flex;
  align-items: center;
  box-sizing: content-box;
  padding-right: 14px;
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

const bigItemCSS = css`
  ${itemCSS};
  height: 138px;
  width: 308px;
`;

const smallItemCSS = css`
  ${itemCSS};
  height: 94px;
  width: 308px;
`;

const rankCSS = css`
  height: 22px;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  color: #000000;
  margin-right: 21px;
`;

const timerWrapperCSS = css`
  border-radius: 14px;
  width: 96px;
  height: 30px;
  background-image: linear-gradient(255deg, #0077d9 4%, #72d2e0);
  font-size: 13px;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 9px;
  margin-bottom: 16px;
  transition: opacity 0.3s;
`;

const arrowPosition = (side: 'left' | 'right') => css`
  ${side}: 5px;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  transition: opacity 0.2s;
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
    <div
      css={[
        timerWrapperCSS,
        !label &&
          css`
            opacity: 0;
          `,
      ]}>
      <Clock />
      <span
        css={css`
          margin-left: 7px;
        `}>
        {label}
      </span>
    </div>
  );
};

const ItemList: React.FC<any> = props => {
  const { books, slug, type, genre, isIntersecting, showSomeDeal } = props;
  const ref = useRef<HTMLUListElement>();

  const sendDisplayEvent = useSendDisplayEvent(slug);
  const [tracker] = useEventTracker();
  useMultipleIntersectionObserver(ref, slug, sendDisplayEvent);
  return (
    <ul css={listCSS} ref={ref}>
      {books
        .filter(book => book.detail)
        .slice(0, 9)
        .map((book, index) => (
          <li css={type === 'big' ? bigItemCSS : smallItemCSS} key={index}>
            <div
              css={css`
                flex: none;
                margin-right: ${props.type === 'big' ? '18px' : '24px'};
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                position: relative;
              `}>
              <a
                onClick={sendClickEvent.bind(null, tracker, book, slug, index)}
                css={css`
                  display: inline-block;
                `}
                href={`/books/${book.b_id}`}>
                <ThumbnailRenderer
                  slug={slug}
                  className={slug}
                  order={index}
                  responsiveWidth={
                    type === 'big'
                      ? [
                          css`
                            width: 80px;
                          `,
                        ]
                      : [
                          css`
                            width: 50px;
                          `,
                        ]
                  }
                  book={{ b_id: book.b_id, detail: book.detail }}
                  imgSize="large"
                  isIntersecting={isIntersecting}>
                  {type === 'big' && (
                    <div
                      css={css`
                        position: absolute;
                        display: block;
                        top: -7px;
                        left: -7px;
                        z-index: 2;
                      `}>
                      <BookBadgeRenderer
                        type={DisplayType.BestSeller}
                        wrapperCSS={css``}
                        isRentable={
                          (!!book.detail?.price_info?.rent ||
                            !!book.detail?.series?.price_info?.rent) &&
                          ['general', 'romance', 'bl'].includes(genre)
                        }
                        isWaitFree={book.detail?.series?.property.is_wait_free}
                        discountPercentage={getMaxDiscountPercentage(book.detail)}
                      />
                    </div>
                  )}
                  {type === 'big' && (
                    <>
                      <FreeBookRenderer
                        freeBookCount={
                          book.detail?.series?.price_info?.rent?.free_book_count ||
                          book.detail?.series?.price_info?.buy?.free_book_count ||
                          0
                        }
                        unit={book.detail?.series?.property.unit || '권'}
                      />
                      <SetBookRenderer
                        setBookCount={book.detail?.setbook?.member_books_count}
                      />
                    </>
                  )}
                  {book.detail?.property?.is_adult_only && <AdultBadge />}
                </ThumbnailRenderer>
              </a>
            </div>
            <div className="book-meta-box">
              <div css={rankCSS} aria-label={`랭킹 순위 ${index + 1}위`}>
                {index + 1}
              </div>
              {book.detail && (
                <BookMeta
                  book={book.detail}
                  showRating={props.type === 'big' || !!(book as MdBook).rating}
                  titleLineClamp={props.type === 'small' ? 1 : 2}
                  isAIRecommendation={false}
                  showSomeDeal={showSomeDeal}
                  showTag={false}
                  width={props.type === 'big' ? '177px' : null}
                  ratingInfo={(book as MdBook).rating}
                />
              )}
            </div>
          </li>
        ))}
    </ul>
  );
};

const RankingBookList: React.FC<RankingBookListProps> = props => {
  const targetRef = useRef(null);
  // @ts-ignore
  const isIntersecting = useIntersectionObserver(targetRef, '-150px');
  const ref = useRef<HTMLUListElement>(null);
  const [books] = useBookDetailSelector(props.items);
  const { genre, type, showSomeDeal, slug } = props;

  const [moveLeft, moveRight, isOnTheLeft, isOnTheRight] = useScrollSlider(ref, true);
  const deviceType = useContext(DeviceTypeContext);
  return (
    <>
      <SectionWrapper ref={targetRef}>
        {props.title && (
          <RankingBookTitle>
            {props.showTimer && <Timer />}
            {props.extra?.detail_link ? (
              // Todo Refactor
              <a href={props.extra.detail_link}>
                <span>{props.title}</span>
                <span
                  css={css`
                    margin-left: 7.8px;
                  `}>
                  <ArrowV />
                </span>
              </a>
            ) : (
              <span>{props.title}</span>
            )}
          </RankingBookTitle>
        )}
        <div
          css={css`
            position: relative;
            height: ${type === 'big' ? '414px' : '282px'}; // badge + (7 * 3)
          `}>
          <ItemList
            books={books}
            slug={slug}
            genre={genre}
            type={type}
            showSomeDeal={showSomeDeal}
            isIntersecting={isIntersecting}
          />
          {!['mobile', 'tablet'].includes(deviceType) && (
            <form
              css={[
                css`
                  height: 0;
                  @media (min-width: 1000px) {
                    display: none;
                  }
                `,
                displayNoneForTouchDevice,
              ]}>
              <Arrow
                label="이전"
                side="left"
                onClickHandler={moveLeft}
                wrapperStyle={[
                  arrowPosition('left'),
                  !isOnTheLeft && arrowTransition,
                  css`
                    z-index: 2;
                  `,
                ]}
              />
              <Arrow
                label="다음"
                side="right"
                onClickHandler={moveRight}
                wrapperStyle={[
                  arrowPosition('right'),
                  !isOnTheRight && arrowTransition,
                  css`
                    z-index: 2;
                  `,
                ]}
              />
            </form>
          )}
        </div>
      </SectionWrapper>
    </>
  );
};

export default RankingBookList;
