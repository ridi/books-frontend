import * as React from 'react';
import { act, render, cleanup, getAllByAltText, RenderResult, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// @ts-ignore
import { ThemeProvider } from 'emotion-theming';
import { Provider } from 'react-redux';
import { defaultTheme } from 'src/styles';
import makeStore from 'src/store/config';
import { ViewportIntersectionProvider } from 'src/hooks/useViewportIntersection';
import RankingBookList from 'src/components/BookSections/RankingBook/RankingBookList';
import fixture from './rankingbook.fixture.json';

afterEach(cleanup);
const store = makeStore(
  {
    books: {
      items: {
        '3306000063': {
          id: '3306000063',
          title: {
            main: '도서 표지',
          },
          property: {
            is_adult_only: true,
            is_somedeal: true,
            is_novel: false,

          },
          file: {
            is_comic: true,
            is_comic_hd: true,
          },
          categories: [{genre: 'bl'}],
          authors: [{name: 'Ridi', id: '1', role: 'author'}]
        },
      },
      isFetching: false,
    },
  },
  { asPath: 'test', isServer: false },
);
const renderRankingBookList = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <ViewportIntersectionProvider>
          <RankingBookList
            {...fixture}
            items={[
              {
                b_id: '3306000063',
                type: 'test',
                detail: {
                  title: { main: '도서 표지' },
                  authors: [{ name: 'hi' }],
                  property: { is_adult_only: false },
                  file: { is_comic: false },
                },
              },
            ]}
          />
        </ViewportIntersectionProvider>
      </Provider>
    </ThemeProvider>,
  );

function actRender(renderFunction: () => RenderResult) {
  let ret: RenderResult;
  act(() => {
    ret = renderFunction();
  });
  return ret;
}

describe('test RankingBookList', () => {
  let originalIO: typeof IntersectionObserver;

  // simulate non-IO environment
  beforeAll(() => {
    originalIO = window.IntersectionObserver;
    window.IntersectionObserver = undefined;
  });

  afterAll(() => {
    window.IntersectionObserver = originalIO;
  });

  it('should be render RankingBookList item', async () => {
    const { container } = actRender(renderRankingBookList);
    const itemNode = await waitForElement(() => getAllByAltText(container, '도서 표지'));
    expect(itemNode).not.toBe(null);
  });
});
