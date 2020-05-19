import axios from 'axios';
import * as React from 'react';
import Index from 'src/pages/[genre]';
import { act, cleanup, render, RenderResult, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import makeStore from '../../store/config';
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from '../../styles';
import { Provider } from 'react-redux';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import blFixture from './home-bl-fixture.json';
import fantasyFixture from './home-fantasy-fixture.json';
import { ViewportIntersectionProvider } from '../../hooks/useViewportIntersection';
import { createRouter } from 'next/router';

const mockRes = {
  writeHead: () => null,
  end: () => null,
};

const router = createRouter('/', { genre: 'general' }, '', {
  subscription: jest.fn(),
  initialProps: {},
  pageLoader: jest.fn(),
  App: jest.fn(),
  Component: jest.fn(),
  isFallback: false,
  wrapApp: jest.fn(),
});

const store = makeStore(
  {
    books: {
      isFetching: false,
      items: {
        '102087083': {
          id: '102087083',
          property: {
            is_somedeal: false,
          },
          file: {
            is_comic: false,
          },
          authors: [],
          categories: [{
            genre:'fantasy'
          }],
          title: { main: '판타지 도서 타이틀' },
        },
        '111020494': {
          id: '102087083',
          property: {
            is_somedeal: false,
          },
          file: {
            is_comic: false,
          },
          authors: [],
          categories: [],
          title: { main: 'Bl 도서 Title1' },
        },
        '777035894': {
          id: '777035894',
          property: {
            is_somedeal: false,
          },
          file: {
            is_comic: false,
          },
          authors: [],
          categories: [{
            genre:'bl'
          }],
          series: {
            property: {
              last_volume_id: "999999",
              is_completed: false,
            }
          },
          title: { main: 'Bl 도서 Title2' },
        },
      },
    },
  },
  { asPath: '/', isServer: false },
);
const mockSomeProps = {
  isServer: true,
  asPath: '',
  store,
  res: mockRes,
};

function actRender(renderFunction: () => RenderResult) {
  let ret: RenderResult;
  act(() => {
    ret = renderFunction();
  });
  return ret;
}

const renderComponent = ({ props }): RenderResult => {
  return render(
    <ThemeProvider theme={defaultTheme}>
      <RouterContext.Provider value={router}>
        <Provider store={store}>
          <ViewportIntersectionProvider>
            <Index {...props} />
          </ViewportIntersectionProvider>
        </Provider>
      </RouterContext.Provider>
    </ThemeProvider>,
  );
};

afterEach(() => {
  act(() => {
    cleanup();
  });
});

describe('Genre Home Test', () => {
  it('should fetch branches', async () => {
    const handler = jest.fn().mockReturnValue({
      data: {
        slug: 'home-fantasy',
        type: 'Page',
        title: '판타지 홈',
        branches: [],
      },
    });
    (axios as any).__setHandler(handler);

    const props = await Index.getInitialProps({
      ...mockSomeProps,
      query: { genre: 'fantasy' },
      req: {
        cookies: {
          main_genre: 'fantasy',
        },
      },
    });
    expect(handler).toBeCalledTimes(1);
    expect(handler.mock.calls[0][0]).toEqual('get');
    expect(handler.mock.calls[0][1]).toEqual('/pages/home-fantasy/');
  });

  it('should render Home Component (fantasy)', async () => {
    const props = {
      genre: 'fantasy',
      slug: 'home-fantasy',
      type: 'Page',
      title: '판타지 홈',
      branches: fantasyFixture.branches,
    };
    const { getAllByText } = actRender(() => (
      renderComponent({ props }))
    );
    expect(getAllByText(/판타지 도서 타이/)[0]).not.toBeNull();
  });

  it('should render Home Component (bl)', async () => {
    const props = {
      genre: 'bl',
      slug: 'home-bl',
      type: 'Page',
      title: 'BL 홈',
      branches: blFixture.branches,
    };
    const { getAllByAltText, container } = actRender(() => (
      renderComponent({ props }))
    );

    const renderer = await waitForElement(() => getAllByAltText(/\[소설\] 리뷰 전원/), {
      timeout: 2000,
      container,
    });
    expect(renderer[0]).not.toBe(null);
  });
});
