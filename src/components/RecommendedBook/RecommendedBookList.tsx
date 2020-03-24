import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import Arrow, { arrowTransition } from 'src/components/Carousel/Arrow';
import { useDeviceType } from 'src/hooks/useDeviceType';
import { useScrollSlider } from 'src/hooks/useScrollSlider';
import { displayNoneForTouchDevice, scrollBarHidden } from 'src/styles';
import { DisplayType } from 'src/types/sections';

import ListItem from './RecommendedBookItem';
import { RecommendedBookProps } from './types';

const ScrollContainer = styled.div`
  overflow: auto;
  ${scrollBarHidden}

  display: flex;
`;

const BookList = styled.ul<{ type: RecommendedBookProps['type'] }>`
  flex: none;
  margin-top: -7px;
  margin-left: 10px;
  padding-top: 7px;
  padding-left: 7px;
  display: flex;
  flex-wrap: nowrap;

  @media (min-width: 1000px) {
    margin-left: 0;
    justify-content: center;
  }
`;

const hotReleaseMargin = css`
  margin-right: 12px;
  @media (min-width: 834px) {
    margin-right: 20px;
  }
  @media (min-width: 1000px) {
    margin-right: 22px;
  }
`;

const todayRecommendationMargin = css`
  align-items: center;
  margin-right: 12px;
  @media (min-width: 834px) {
    margin-right: 20px;
  }
  @media (min-width: 1000px) {
    margin-right: 22px;
  }
`;

function RecommendedBookList(props: Omit<RecommendedBookProps, 'title'>) {
  const ref = React.useRef<HTMLUListElement>(null);
  const [moveLeft, moveRight, isOnTheLeft, isOnTheRight] = useScrollSlider(ref);
  const {
    theme, type, slug, genre,
  } = props;
  const { isMobile } = useDeviceType();

  const { items } = props;
  const carouselItems = React.useMemo(
    () => items
      .filter((book) => book.detail)
      .map((book, index) => (
        <ListItem
          key={index}
          book={book}
          index={index}
          type={type}
          theme={theme}
          slug={slug}
          genre={genre}
          css={
              props.type === DisplayType.HotRelease
                ? hotReleaseMargin
                : todayRecommendationMargin
            }
        />
      )),
    [items, type, theme, slug],
  );

  return (
    <div
      css={css`
        position: relative;
        margin: 20px auto 0;

        @media (min-width: 1000px) {
          width: 964px; // 950 + 14
        }
      `}
    >
      <ScrollContainer>
        <BookList type={type} ref={ref}>
          {carouselItems}
        </BookList>
      </ScrollContainer>
      {!isMobile && (
        <form css={displayNoneForTouchDevice}>
          <Arrow
            onClickHandler={moveLeft}
            label="이전"
            color={theme}
            side="left"
            wrapperStyle={[
              css`
                left: 5px;
                z-index: 2;
                position: absolute;
                transition: opacity 0.2s;
                top: 88px;
                @media (max-width: 999px) {
                  top: 72px;
                }
              `,
              !isOnTheLeft && arrowTransition,
            ]}
          />
          <Arrow
            label="다음"
            onClickHandler={moveRight}
            color={theme}
            side="right"
            wrapperStyle={[
              css`
                z-index: 2;
                right: 9px;
                position: absolute;
                transition: opacity 0.2s;
                top: 88px;
                @media (max-width: 999px) {
                  top: 72px;
                }
              `,
              !isOnTheRight && arrowTransition,
            ]}
          />
        </form>
      )}
    </div>
  );
}

export default React.memo(RecommendedBookList);
