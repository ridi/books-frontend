import React from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { useRouter } from 'next/router';
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

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 60px 0;
  > * + * {
    margin-left: 4px;
  }
`;

const PageButton = styled.button`
  min-width: 38px;
  height: 32px;
  > a {
    padding: 7px 8px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 13px;
  }
  border: solid 1px ${slateGray20};
  color: ${slateGray50};
  box-shadow: 0 1px 1px 0 rgba(206, 210, 214, 0.3);

  ${orBelow(BreakPoint.LG, 'min-width: 42px;')}
`;

const Pages = styled.ul`
  display: flex;

  > * + * {
    margin-left: -1px;
  }
`;

const Page = styled(PageButton)<{ isActive?: boolean }>`
  ${(props) => props.isActive && css`
    position: relative;
    border-color: ${dodgerBlue60};
    background: ${dodgerBlue50};
    color: white;
  `}

  &:first-of-type {
    border-bottom-left-radius: 3px;
    border-top-left-radius: 3px;
  }
  &:last-of-type {
    border-bottom-right-radius: 3px;
    border-top-right-radius: 3px;
  }
`.withComponent('li');

const StyledPageButton = styled(PageButton)`
  border-radius: 3px;
  font-size: 13px;
  font-weight: bold;
`;

const Arrow = styled(ArrowBoldV)<{ rotate: boolean }>`
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
}

// const MAX_ITEM = 9600; // search api result window 10000. 24 * 400 = 9600
const MAX_PAGE = 400;

function getQueryParamsToString(searchParam: URLSearchParams, page: string) {
  const params = new URLSearchParams(searchParam);
  params.set('page', page);
  return params.toString();
}

export function Pagination(props: PaginationProps) {
  const {
    totalItem,
    currentPage,
    itemPerPage,
    showStartAndLastButton,
    showPageCount = 5,
  } = props;
  const totalPage = Math.min(MAX_PAGE, Math.ceil(totalItem / itemPerPage));
  const totalPagination = Math.ceil(totalPage / showPageCount);
  const currentPaginationPosition = Math.ceil(currentPage / showPageCount);
  const showPreviousButton = currentPaginationPosition > 1;
  const showNextButton = currentPaginationPosition < totalPagination;

  const router = useRouter();
  const searchParam = new URLSearchParams(router.query as Record<string, string> || {});
  return (
    <PaginationWrapper>
      {showPreviousButton && (
        <>
          {showStartAndLastButton && (
            <>
              <StyledPageButton>
                <Link
                  href={`/search?${getQueryParamsToString(searchParam, '1')}`}
                >
                  <a>처음</a>
                </Link>
              </StyledPageButton>
              <Ellipsis />
            </>
          )}

          <StyledPageButton>
            <Link
              href={`/search?${getQueryParamsToString(searchParam, ((currentPaginationPosition - 2) * showPageCount + 1).toString())}`}
            >
              <a>
                <Arrow rotate />
              </a>
            </Link>
          </StyledPageButton>
        </>
      )}
      <Pages>
        {Array.from({ length: showPageCount }, (v, i) => i).map((page, index) => {
          const moveToPage = (currentPaginationPosition - 1) * showPageCount + (index + 1);
          if (totalPage < moveToPage) {
            return null;
          }
          return (
            <Page isActive={currentPage === moveToPage} key={index}>
              <Link href={`/search?${getQueryParamsToString(searchParam, moveToPage.toString())}`}>
                <a>{moveToPage}</a>
              </Link>
            </Page>
          );
        })}
      </Pages>
      {showNextButton && (
        <>
          <StyledPageButton>
            <Link
              href={`/search?${getQueryParamsToString(searchParam, (currentPaginationPosition * showPageCount + 1).toString())}`}
            >
              <a>
                <Arrow rotate={false} />
              </a>
            </Link>
          </StyledPageButton>
          {showStartAndLastButton && (
            <>
              <Ellipsis />
              <StyledPageButton>
                <Link href={`/search?${getQueryParamsToString(searchParam, totalPage.toString())}`}>
                  <a>마지막</a>
                </Link>
              </StyledPageButton>
            </>
          )}
        </>
      )}
    </PaginationWrapper>
  );
}
