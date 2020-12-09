import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Arrow from 'src/components/Carousel/Arrow';
import { getArrowVerticalCenterPosition } from 'src/components/Carousel';
import BooksCarousel from 'src/components/Carousel/BooksCarousel';
import { BreakPoint, greaterThanOrEqualTo } from 'src/utils/mediaQuery';

import SelectionBookItem from './SelectionBookItem';
import { SelectionBookListProps } from './types';

const arrowWrapperCSS = css`
  position: absolute;
  top: calc(50% - 9px);
`;

const CarouselWrapper = styled.div`
  width: 1005px;
  max-width: 1005px;
  margin: 6px auto 0;
  position: relative;
  height: 100%;
`;

const SelectionBookCarousel: React.FunctionComponent<SelectionBookListProps> = (props) => {
  const { genre, type, slug } = props;

  const { items } = props;
  const totalItems = items.length;

  const [currentIdx, setCurrentIdx] = React.useState(0);
  const handleLeftArrow = React.useCallback(() => {
    setCurrentIdx((idx) => {
      const page = Math.ceil(idx / 6);
      if (page === 0) {
        return totalItems - 6;
      }
      return (page - 1) * 6;
    });
  }, [totalItems]);
  const handleRightArrow = React.useCallback(() => {
    setCurrentIdx((idx) => {
      if (idx + 6 === totalItems) {
        return 0;
      }
      if (idx + 12 > totalItems) {
        return totalItems - 6;
      }
      return idx + 6;
    });
  }, [totalItems]);

  return (
    <CarouselWrapper>
      <BooksCarousel
        totalItems={items.length}
        itemsInPage={6}
        currentIdx={currentIdx}
        itemWidth={140}
        itemMargin={22}
      >
        {({ index }) => (
          <SelectionBookItem
            key={index}
            order={index}
            genre={genre}
            slug={slug}
            book={items[index]}
            type={type}
          />
        )}
      </BooksCarousel>
      {items.length > 6 && (
        <form css={css`height: 0;`}>
          <Arrow
            label="이전"
            side="left"
            onClickHandler={handleLeftArrow}
            wrapperStyle={css`
              ${arrowWrapperCSS};
              ${greaterThanOrEqualTo(
              BreakPoint.XL + 1,
              'left: -29px;',
            )};
              left: 5px;
              top: ${getArrowVerticalCenterPosition()};
            `}
          />

          <Arrow
            label="다음"
            side="right"
            onClickHandler={handleRightArrow}
            wrapperStyle={css`
              ${arrowWrapperCSS};
              ${greaterThanOrEqualTo(
              BreakPoint.XL + 1,
              'right: -36px;',
            )};
              right: 5px;
              top: ${getArrowVerticalCenterPosition()};
            `}
          />
        </form>
      )}
    </CarouselWrapper>
  );
};

export default React.memo(SelectionBookCarousel);
