import * as React from 'react';
import { useDispatch } from 'react-redux';
import Head from 'next/head';
import styled from '@emotion/styled';
import * as SearchTypes from 'src/types/searchResults';
import {
  dodgerBlue50,
  slateGray10,
  slateGray20,
  slateGray40,
  slateGray50,
  slateGray90,
} from '@ridi/colors';
import Lens from 'src/svgs/Lens.svg';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { SearchCategoryTab } from 'src/components/Tabs';
import { useCallback, useEffect } from 'react';
import sentry from 'src/utils/sentry';
import * as tracker from 'src/utils/event-tracker';

import { Pagination } from 'src/components/Pagination/Pagination';
import SearchLandscapeBook from 'src/components/Search/SearchLandscapeBook';
import useIsTablet from 'src/hooks/useIsTablet';
import { AdultExcludeToggle, FilterSelector } from 'src/components/Search';
import { useRouter } from 'next/router';
import { useSearchQueries } from 'src/hooks/useSearchQueries';
import { booksActions } from 'src/services/books';
import { ITEM_PER_PAGE, MAX_PAGE, runSearch } from 'src/utils/search';
import { Border } from 'src/components/Tabs/SearchCategoryTab';
import SkeletonAuthors from 'src/components/Skeleton/Authors';
import SkeletonBar from 'src/components/Skeleton/Bar';
import SkeletonCategoryTab from 'src/components/Skeleton/CategoryTab';
import Skeleton from 'src/components/Skeleton/SearchLandscapeBook';
import Authors, { MAXIMUM_AUTHOR } from 'src/components/Search/Authors';
import useAccount from 'src/hooks/useAccount';

const SearchResultSection = styled.section`
  max-width: 952px;
  min-height: 620px;
  margin: 0 auto;
  padding-top: 8px;
  ${orBelow(BreakPoint.LG, 'max-width: 100%;')}
`;

const SearchTitle = styled.h2`
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  color: ${slateGray90};
  display: flex;
  align-items: center;
  margin: 10px 0;
  ${orBelow(BreakPoint.LG, 'margin: 10px 16px;')}
`;

const TotalAuthor = styled.span`
  font-size: 13px;
  font-weight: normal;
  margin-left: 5px;
  color: ${slateGray40};
`;

const SearchBookList = styled.ul`
  display: flex;
  flex-direction: column;
`;

const SearchBookItem = styled.li`
  display: flex;
  padding: 20px 0;
  border-bottom: 1px solid ${slateGray20};
  align-items: flex-start;
  ${orBelow(BreakPoint.LG, 'margin: 0 16px;')};
`;

const Filters = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  ${orBelow(BreakPoint.LG, 'margin-left: 16px; margin-right: 16px;')}
`;

const EmptyBlock = styled.div`
  margin-top: 40px;
`;

const NoResult = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > * {
    flex: none;
    margin-bottom: 16px;
  }
  padding: 200px 0 360px;
  ${orBelow(BreakPoint.MD, 'padding: 80px 0 240px;')}
`;

const NoResultLens = styled(Lens)`
  width: 83.5px;
  height: 83.5px;
  fill: ${slateGray10};
`;

const NoResultText = styled.p`
  font-size: 14px;
  color: ${slateGray50};
`;

const SuggestButton = styled.a`
  height: 40px;
  padding: 12px 48px;
  font-weight: bold;
  font-size: 14px;
  border: 1px solid ${dodgerBlue50};
  color: ${dodgerBlue50};
  border-radius: 3px;
`;

const SkeletonH2Bar = styled(SkeletonBar)`
  width: 200px;
  margin: 10px 0;
  ${orBelow(BreakPoint.LG, 'margin: 10px 16px')}
`;

const SkeletonFilterBar = styled(SkeletonBar)<{ type: 'short' | 'long' }>`
  width: ${(props) => ({ short: 70, long: 92 }[props.type])}px;
  margin: 5px 0 17px;
`;

function SearchPage() {
  const dispatch = useDispatch();
  const { query, calculateUpdateQuery } = useSearchQueries();
  const {
    q,
    isAdultExclude,
    page,
    categoryId: currentCategoryId,
    order,
  } = query;
  const [authors, setAuthors] = React.useState<SearchTypes.AuthorResult>();
  const [books, setBooks] = React.useState<SearchTypes.BookResult>();
  const [categories, setCategories] = React.useState<SearchTypes.Aggregation[]>();
  const [keywordPending, setKeywordPending] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const result = await runSearch(query);
      setAuthors((orig) => orig || result.author);
      setBooks((orig) => orig || result.book);
      setCategories((orig) => orig || result.book.aggregations);
      setKeywordPending(false);

      const bIds = result.book.books.map((book) => book.b_id);
      dispatch({
        type: booksActions.insertBookIds.type,
        payload: { bIds, withDesc: true },
      });
    })();
  }, [query]);

  React.useEffect(() => {
    setAuthors(undefined);
    setKeywordPending(true);
  }, [q]);
  React.useEffect(() => {
    setBooks(undefined);
  }, [q, isAdultExclude, page, currentCategoryId, order]);
  React.useEffect(() => {
    setCategories(undefined);
  }, [q, isAdultExclude]);

  const router = useRouter();
  const loggedUser = useAccount();
  const isTablet = useIsTablet();
  const setPageView = useCallback(() => {
    try {
      tracker.sendPageView(window.location.href, document.referrer);
    } catch (error) {
      sentry.captureException(error);
    }
  }, []);
  const hasPagination = books != null && books.total > ITEM_PER_PAGE && books.books.length > 0;

  useEffect(() => {
    setPageView();
  }, [loggedUser]);
  useEffect(() => {
    if (books == null) {
      return;
    }
    const availableMaxPage = Math.min(Math.ceil(books.total / ITEM_PER_PAGE), MAX_PAGE);
    if (page > availableMaxPage && books.total > 0) {
      const search = calculateUpdateQuery({ page: availableMaxPage });
      router.replace(`${router.pathname}?${search}`);
    }
  }, [page, books?.total, calculateUpdateQuery]);
  useEffect(() => {
    if (categories == null) {
      return;
    }
    if (categories.every((category) => String(category.category_id) !== currentCategoryId)) {
      const search = calculateUpdateQuery({ categoryId: '0' });
      router.replace(`${router.pathname}?${search}`);
    }
  }, [categories, currentCategoryId]);

  let authorsNode = null;
  if (authors != null) {
    const { total } = authors;
    if (total > 0) {
      authorsNode = (
        <>
          <SearchTitle>
            {`‘${q}’ 저자 검색 결과`}
            <TotalAuthor>
              {total > MAXIMUM_AUTHOR ? `총 ${MAXIMUM_AUTHOR}명+` : `총 ${total}명`}
            </TotalAuthor>
          </SearchTitle>
          <Authors author={authors} q={q || ''} />
        </>
      );
    }
  } else {
    authorsNode = (
      <>
        <SkeletonH2Bar />
        <SkeletonAuthors />
      </>
    );
  }

  let categoriesNode = null;
  if (categories != null) {
    if (categories.length > 0) {
      categoriesNode = (
        <SearchCategoryTab
          categories={categories}
          currentCategoryId={parseInt(currentCategoryId, 10)}
        />
      );
    }
  } else {
    categoriesNode = (
      <>
        <SkeletonCategoryTab />
        <Border color={slateGray10} />
      </>
    );
  }

  let booksNode;
  if (books != null) {
    if (books.total > 0) {
      booksNode = (
        <SearchBookList>
          {books.books.map((item, index) => (
            <SearchBookItem key={item.b_id}>
              <SearchLandscapeBook item={item} title={item.title} q={q || ''} index={index} />
            </SearchBookItem>
          ))}
        </SearchBookList>
      );
    } else {
      booksNode = (
        <NoResult>
          <NoResultLens />
          <NoResultText>{`‘${q}’에 대한 도서 검색 결과가 없습니다.`}</NoResultText>
          <SuggestButton href="https://help.ridibooks.com/hc/ko/requests/new?ticket_form_id=664028" rel="noreferrer nooppener" target="_blank">도서 제안하기</SuggestButton>
        </NoResult>
      );
    }
  } else {
    booksNode = (
      <SearchBookList>
        {[0.8, 0.5, 0.3].map((opacity) => (
          <SearchBookItem key={opacity}>
            <Skeleton />
          </SearchBookItem>
        ))}
      </SearchBookList>
    );
  }
  return (
    <SearchResultSection>
      <Head>
        <title>
          {q}
          {' '}
          검색 결과 - 리디북스
        </title>
      </Head>
      {authorsNode}

      {keywordPending ? (
        <SkeletonH2Bar />
      ) : (
        <SearchTitle>{`‘${q}’ 도서 검색 결과`}</SearchTitle>
      )}
      {categoriesNode}
      {keywordPending ? (
        <Filters>
          <SkeletonFilterBar type="long" />
          <SkeletonFilterBar type="short" />
        </Filters>
      ) : (
        <Filters>
          <FilterSelector />
          <AdultExcludeToggle adultExclude={isAdultExclude} />
        </Filters>
      )}
      {booksNode}
      {hasPagination ? (
        <Pagination
          itemPerPage={ITEM_PER_PAGE}
          currentPage={Math.max(page, 1)} // 0 이하로 떨어지는 걸 방지
          totalItem={books?.total || 0}
          showStartAndLastButton={!isTablet}
          showPageCount={isTablet ? 5 : 10}
          maxPage={MAX_PAGE}
        />
      ) : (
        <EmptyBlock />
      )}
    </SearchResultSection>
  );
}

export default SearchPage;
