import * as React from 'react';
import {
  act,
  cleanup,
  getAllByAltText,
  getAllByText,
  render,
  RenderResult,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ThemeProvider } from 'emotion-theming';
import { Provider } from 'react-redux';
import RecommendedBookCarousel from 'src/components/RecommendedBook/RecommendedBookCarousel';
import RecommendedBookList from 'src/components/RecommendedBook/RecommendedBookList';
import RecommendedBook from 'src/components/RecommendedBook';
import { defaultTheme } from 'src/styles';
import makeStore from 'src/store/config';
import { ViewportIntersectionProvider } from 'src/hooks/useViewportIntersection';
import { HotRelease, TodayRecommendation } from '../../../types/sections';
import { AuthorRole } from 'src/types/book';

afterEach(cleanup);
const store = makeStore(
  {
    books: {
      items: {
        '12345': {
          b_id: '12345',
          title: { main: '도서 표지' },
          categories: [],
          property: {},
          authors: [],
          clientBookFields: {
            isAvailableSelect: true,
          },
        },
        '12346': {
          b_id: '12346',
          title: {main: '도서 표지'},
          categories: [{genre: 'comic'}],
          property: {},
          authors: [{id: 1, role: AuthorRole.AUTHOR, name: '작가'}],
          clientBookFields: {
            isAvailableSelect: true,
            isAlreadyCheckedAtSelect: true,
          },
        },
      },
      isFetching: false,
    },
  },
  { asPath: 'test', isServer: false },
);

const books: HotRelease[] = [
  {
    b_id: '12345',
    sentence: "오늘은 자고 가련\\r\\n'동양풍 + 외전 출간",
  },
  {
    b_id: '12346',
    sentence: "오늘은 자고 가련\\r\\n'동양풍 + 외전 출간",
  },
];

function actRender(renderFunction: () => RenderResult) {
  let ret: RenderResult;
  act(() => {
    ret = renderFunction();
  });
  return ret;
}

const renderList = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <ViewportIntersectionProvider>
          <RecommendedBookList
            slug={'home-general-hotrelease'}
            theme={'dark'}
            genre="general"
            type="HotRelease"
            items={books as HotRelease[]}
          />
        </ViewportIntersectionProvider>
      </Provider>
    </ThemeProvider>,
  );

const renderCarousel = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <ViewportIntersectionProvider>
          <RecommendedBookCarousel
            theme={'dark'}
            genre={'general'}
            slug={'home-general-hotrelease'}
            type="HotRelease"
            items={books as HotRelease[]}
          />
        </ViewportIntersectionProvider>
      </Provider>
    </ThemeProvider>,
  );

const renderTodayRecommendation = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <ViewportIntersectionProvider>
          <RecommendedBookCarousel
            genre={'romance'}
            theme={'white'}
            slug={'home-romance-today-recommendation'}
            type="TodayRecommendation"
            items={books as TodayRecommendation[]}
          />
        </ViewportIntersectionProvider>
      </Provider>
    </ThemeProvider>,
  );

const renderContainer = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <ViewportIntersectionProvider>
          <RecommendedBook
            title={'집 앞 서점!'}
            genre={'romance'}
            theme={'white'}
            slug={'home-romance-today-recommendation'}
            type="TodayRecommendation"
            items={books as TodayRecommendation[]}
          />
        </ViewportIntersectionProvider>
      </Provider>
    </ThemeProvider>,
  );

describe('test recommendedBook wrapper', () => {
  let originalIO: typeof IntersectionObserver;

  // simulate non-IO environment
  beforeAll(() => {
    originalIO = window.IntersectionObserver;
    window.IntersectionObserver = undefined;
  });

  afterAll(() => {
    window.IntersectionObserver = originalIO;
  });

  it('should be render List', () => {
    const { container } = actRender(renderList);
    const itemNode = getAllByAltText(container, '도서 표지');
    expect(itemNode).not.toBe(null);
  });
  it('should be render RecommendedBookCarousel', () => {
    const { container } = actRender(renderCarousel);
    const itemNode = getAllByAltText(container, '도서 표지');
    expect(itemNode).not.toBe(null);
  });
  it('should be render White theme', () => {
    const { container } = actRender(renderTodayRecommendation);
    const itemNode = getAllByText(container, /오늘은 자고 가련/);
    expect(itemNode).not.toBe(null);
  });
  it('should be render RecommendedBookContainer', () => {
    // books from store
    const { container } = actRender(renderContainer);
    const itemNode = getAllByText(container, /집 앞 서점!/);
    expect(itemNode).not.toBe(null);
  });
});
