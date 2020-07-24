import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import {
  dodgerBlue50,
  dodgerBlue60,
  slateGray20,
  slateGray30,
  slateGray50,
} from '@ridi/colors';
import ArrowBoldV from 'src/svgs/ArrowBoldV.svg';
import More from 'src/svgs/More.svg';
import { css } from '@emotion/core';
import { defaultHoverStyle } from 'src/styles';
import { useSearchQueries } from 'src/hooks/useSearchQueries';

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
  > * + * {
    margin-left: 4px;
  }
`;

const Anchor = styled.a<{isActive?: boolean}>`
  padding: 7px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 13px;
  border-radius: 3px;
  min-width: 38px;
  height: 32px;
  color: ${slateGray50};
  box-shadow: 0 1px 1px 0 rgba(206, 210, 214, 0.3);
  border: solid 1px ${slateGray20};
  :active, :hover {
    background: rgba(0, 0, 0, 0.05);
  }
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05);
  ${defaultHoverStyle}
  ${orBelow(BreakPoint.LG, 'min-width: 42px;')}
  ${(props) => props.isActive && css`
    position: relative;
    border-color: ${dodgerBlue60};
    background: ${dodgerBlue50};
    color: white;
    :active, :hover {
      background: ${dodgerBlue50};
    }
  `}
`;

const Pages = styled.ul`
  display: flex;

  > * + * {
    margin-left: -1px;
  }
  li {
    :first-of-type {
      border-radius: 3px 0 0 3px;
    }
    :last-of-type {
      border-radius: 0 3px 3px 0;
    }
  }
  ${Anchor} {
    border-radius: inherit;
  }
`;

const Arrow = styled(ArrowBoldV)<{ rotate: boolean }>`
  fill: ${slateGray30};
  ${(props) => props.rotate && 'transform: rotate(180deg);'}
`;

const Ellipsis = styled(More)`
  transform: rotate(90deg);
  fill: ${slateGray30};
  width: 14px;
  height: 12px;
`;

interface PaginationProps {
  totalItem: number;
  itemPerPage: number;
  showPageCount: number;
  currentPage: number;
  showStartAndLastButton?: boolean;
  maxPage: number;
}

export function Pagination(props: PaginationProps) {
  const {
    totalItem,
    currentPage,
    itemPerPage,
    showStartAndLastButton,
    maxPage,
    showPageCount = 5,
  } = props;
  const totalPage = Math.min(maxPage, Math.ceil(totalItem / itemPerPage));
  const totalPagination = Math.ceil(totalPage / showPageCount);
  const currentPaginationPosition = Math.ceil(currentPage / showPageCount);
  const showPreviousButton = currentPaginationPosition > 1;
  const showNextButton = currentPaginationPosition < totalPagination;

  const router = useRouter();
  const { calculateUpdateQuery } = useSearchQueries();
  const calculatePageUpdate = React.useCallback((page: number) => calculateUpdateQuery({ page }), [calculateUpdateQuery]);
  return (
    <PaginationWrapper>
      {showPreviousButton && (
        <>
          {showStartAndLastButton && (
            <>
              <Link
                href={`${router.pathname}?${calculatePageUpdate(1)}`}
                passHref
              >
                <Anchor>처음</Anchor>
              </Link>
              <Ellipsis />
            </>
          )}
          <Link
            href={`${router.pathname}?${calculatePageUpdate((currentPaginationPosition - 2) * showPageCount + 1)}`}
            passHref
          >
            <Anchor>
              <Arrow rotate />
            </Anchor>
          </Link>
        </>
      )}
      <Pages>
        {Array.from({ length: showPageCount }).map((_, index) => {
          const moveToPage = (currentPaginationPosition - 1) * showPageCount + (index + 1);
          if (totalPage < moveToPage) {
            return null;
          }
          return (
            <li key={index}>
              <Link href={`${router.pathname}?${calculatePageUpdate(moveToPage)}`} passHref>
                <Anchor isActive={currentPage === moveToPage}>{moveToPage}</Anchor>
              </Link>
            </li>
          );
        })}
      </Pages>
      {showNextButton && (
        <>
          <Link
            href={`${router.pathname}?${calculatePageUpdate(currentPaginationPosition * showPageCount + 1)}`}
            passHref
          >
            <Anchor>
              <Arrow />
            </Anchor>
          </Link>
          {showStartAndLastButton && (
            <>
              <Ellipsis />
              <Link href={`${router.pathname}?${calculatePageUpdate(totalPage)}`} passHref>
                <Anchor>마지막</Anchor>
              </Link>
            </>
          )}
        </>
      )}
    </PaginationWrapper>
  );
}
