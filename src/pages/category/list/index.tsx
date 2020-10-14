import React from 'react';
import Head from 'next/head';
import { GenreTab } from 'src/components/Tabs';
import PageTitle from 'src/components/PageTitle/PageTitle';
import { css } from '@emotion/core';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

const sectionCSS = css`
  padding: 31px 50px 50px 50px;
  max-width: 1000px;
  margin: 0 auto;
  margin-top: -20px;
  ${orBelow(
    BreakPoint.LG,
    'padding: 0;',
  )}
`;
function CategoryListPage() {
  return (
    <>
      <Head>
        <title>카테고리 - 리디북스</title>
      </Head>
      <GenreTab currentGenre="category" />
      <section css={sectionCSS}>
        <PageTitle title="카테고리" mobileHidden />
        {/*  Todo new Category */}
      </section>
    </>
  );
}
export default CategoryListPage;
