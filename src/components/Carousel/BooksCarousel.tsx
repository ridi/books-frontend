import styled from '@emotion/styled';
import React from 'react';

const BooksCarouselWrapper = styled.div<{ itemsInPage: number; itemWidth: number; itemMargin: number }>`
  width: ${({ itemsInPage: n, itemWidth: w, itemMargin: d }) => (w + d) * n - d + 14}px;
  margin: 0 auto;
  overflow: hidden;
`;

const BooksCarouselList = styled.ul<{ currentIdx: number; itemWidth: number; itemMargin: number }>`
  display: flex;
  flex-wrap: nowrap;

  margin-top: 0;
  padding-top: 7px;
  padding-left: 7px;

  transform: translateX(${({ currentIdx: idx, itemWidth: w, itemMargin: d }) => -idx * (w + d)}px);
  transition: transform 0.2s;

  > li + li {
    margin-left: ${(props) => props.itemMargin}px;
  }
`;

interface BooksCarouselProps {
  totalItems: number;
  itemsInPage: number;
  currentIdx: number;
  itemWidth: number;
  itemMargin: number;
  className?: string;
  children: (props: { index: number; itemWidth: number }) => React.ReactNode;
}

export default function BooksCarousel(props: BooksCarouselProps) {
  const { children, className, ...restProps } = props;
  const nodes = Array.from(
    { length: props.totalItems },
    (_, index) => children({ index, itemWidth: props.itemWidth }),
  );

  return (
    <BooksCarouselWrapper className={className} {...restProps}>
      <BooksCarouselList {...restProps}>
        {nodes}
      </BooksCarouselList>
    </BooksCarouselWrapper>
  );
}
