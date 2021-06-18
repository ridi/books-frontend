import React from 'react';
import styled from '@emotion/styled';

import useIsTablet from 'src/hooks/useIsTablet';
import { BreakPoint } from 'src/utils/mediaQuery';

import recommendedBookBackground from 'src/assets/image/recommended_book_background@desktop.png';
import { useViewportIntersectionOnce } from 'src/hooks/useViewportIntersection';
import { sendViewItemList } from 'src/utils/event-tracker-ga4';

import RecommendedBookList from './RecommendedBookList';
import RecommendedBookCarousel from './RecommendedBookCarousel';
import { RecommendedBookProps } from './types';

const SectionTitle = styled.h2`
  max-width: 1000px;
  margin: 0 auto;
  padding-left: 25px;
  padding-right: 8px;

  font-size: 19px;
  font-weight: normal;

  @media (max-width: ${BreakPoint.LG}px) {
    padding-left: 20px;
  }

  @media (max-width: ${BreakPoint.MD}px) {
    padding-left: 16px;
  }
`;

const RecommendedBookWrapper = styled.section<{ bg: 'white' | 'dark' }>`
  padding-top: ${({ bg }) => (bg === 'white' ? 16 : 36)}px;
  padding-bottom: ${({ bg }) => (bg === 'white' ? 16 : 36)}px;

  ${({ bg }) => bg === 'white' && `
    @media (min-width: 1000px) {
      padding-top: 24px;
      padding-bottom: 24px;
    }
  `}

  ${({ bg }) => bg === 'dark' && `
    background: url(${recommendedBookBackground})
      center center no-repeat #17202e;
    background-size: contain;
    @media (max-width: ${BreakPoint.MD}px) {
      background-size: cover;
    }
  `}

  > ${SectionTitle} {
    ${({ bg }) => bg === 'dark' && 'color: white;'}
  }
`;

export default function RecommendedBook(props: RecommendedBookProps) {
  const {
    theme,
    title,
    items,
    slug,
  } = props;
  const isTablet = useIsTablet();

  const ref = useViewportIntersectionOnce<HTMLUListElement>(() => {
    sendViewItemList(items, {
      item_list_id: slug,
    });
  });
  return (
    <RecommendedBookWrapper bg={theme} ref={ref}>
      <SectionTitle>{title}</SectionTitle>
      <div>
        {isTablet ? (
          <RecommendedBookList
            {...props}
          />
        ) : (
          <RecommendedBookCarousel
            {...props}
          />
        )}
      </div>
    </RecommendedBookWrapper>
  );
}
