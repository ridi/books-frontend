import styled from '@emotion/styled';
import React from 'react';

const BooksCarouselWrapper = styled.div<{ itemsInPage: number; itemWidth: number; itemMargin: number }>`
  width: ${({ itemsInPage: n, itemWidth: w, itemMargin: d }) => (w + d) * n - d + 14}px;
  // 여기서의 margin-top: -8px 가 자식 노드(ex. <BooksCarouselList />) 의 padding-top: 8px 를 상쇄
  margin: -8px auto 0;
  overflow: hidden;
`;

const BooksCarouselList = styled.ul<{ currentIdx: number; itemWidth: number; itemMargin: number }>`
  display: flex;
  flex-wrap: nowrap;

  // 썸네일에 배지(기다무, 할인율)를 착용하기 위해 position: absolute; top: -7px; left: -7px; 하는 선택을 했다.
  // 아래 padding 은 배지 잘림 처리를 하기 위한 땜빵코드
  // 상위 컨테이너에서 overflow: auto 또는 hidden 을 강제하고
  // 특정 자식 노드에 대해 overflow-x or overflow-y 를 설정하기는 불가능 하기 때문에
  // padding-top 과 위 <BooksCarouselWrapper /> margin-top 은 서로 같은 절대값으로 상쇄되어야 함.
  padding-top: 8px;
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
