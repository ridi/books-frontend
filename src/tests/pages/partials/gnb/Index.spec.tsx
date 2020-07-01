import * as React from 'react';
import Index from 'src/pages/partials/gnb';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import makeStore from '../../../utils/makeStore';
import { Provider } from 'react-redux';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import { createRouter } from 'next/router';
const router = createRouter('/', { genre: 'general' }, '', {
  subscription: jest.fn(),
  initialProps: {},
  pageLoader: jest.fn(),
  App: jest.fn(),
  Component: jest.fn(),
  isFallback: false,
  wrapApp: jest.fn(),
});

afterEach(cleanup);
const store = makeStore();

test('should be render Index Component', async () => {
  const props = await Index.getInitialProps({
    pathname: '',
    isServer: false,
    asPath: '',
    store,
    query: { type: '1', theme: 'dark', pathname: '/' },
  });

  const { queryByAltText } = render(
    <Provider store={store}>
      <RouterContext.Provider value={{ asPath: '', query: { pathname: '/'} }}>
        <Index {...props} />
      </RouterContext.Provider>
    </Provider>,
  );

  expect(queryByAltText(/리디셀렉트/)).not.toBe(null);
  expect(queryByAltText(/리디북스/)).not.toBe(null);
});
test('should be render with CategoryList', async () => {
  const props = await Index.getInitialProps({
    pathname: '',
    isServer: false,
    asPath: '',
    store,
    query: { type: '1', theme: 'dark', pathname: '/category/list' },
  });

  const { queryByAltText, queryByText } = render(
    <Provider store={store}>
      <RouterContext.Provider value={{ asPath: '', query: { pathname: '/'} }}>
        <Index {...props} />
      </RouterContext.Provider>
    </Provider>,
  );

  expect(queryByAltText(/리디셀렉트/)).not.toBe(null);
  expect(queryByAltText(/리디북스/)).not.toBe(null);
  expect(queryByText(/일반/)).not.toBe(null);
});
test('should be render event page with nav bar', async () => {
  const props = await Index.getInitialProps({
    pathname: '',
    isServer: false,
    asPath: '',
    store,
    query: { type: '1', theme: 'dark', pathname: '/event/romance' },
  });

  const { queryByAltText, queryByText } = render(
    <Provider store={store}>
      <RouterContext.Provider value={{ asPath: '', query: { pathname: '/'} }}>
        <Index {...props} />
      </RouterContext.Provider>
    </Provider>,
  );

  expect(queryByAltText(/리디셀렉트/)).not.toBe(null);
  expect(queryByAltText(/리디북스/)).not.toBe(null);
  expect(queryByText(/BL/)).not.toBe(null);
});

test('should be render event page with nav bar', async () => {
  const props = await Index.getInitialProps({
    pathname: '',
    isServer: false,
    asPath: '',
    store,
    query: { type: '1', theme: 'dark', pathname: '/event/12345' },
  });

  const { queryByText, queryByAltText } = render(
    <Provider store={store}>
      <RouterContext.Provider value={{ asPath: '', query: { pathname: '/'} }}>
        <Index {...props} />
      </RouterContext.Provider>
    </Provider>,
  );

  expect(queryByAltText(/리디셀렉트/)).not.toBe(null);
  expect(queryByAltText(/리디북스/)).not.toBe(null);
  expect(queryByText(/BL/)).not.toBe(null);
});

test('should be render book page with nav bar', async () => {
  const props = await Index.getInitialProps({
    pathname: '',
    isServer: false,
    asPath: '',
    store,
    query: { type: '1', theme: 'dark', pathname: '/books/123456661' },
  });

  const { queryByText, queryByAltText } = render(
    <Provider store={store}>
      <RouterContext.Provider value={{ asPath: '', query: { pathname: '/'} }}>
        <Index {...props} />
      </RouterContext.Provider>
    </Provider>,
  );

  expect(queryByAltText(/리디셀렉트/)).not.toBe(null);
  expect(queryByAltText(/리디북스/)).not.toBe(null);
  expect(queryByText(/BL/)).not.toBe(null);
});

test('should be render book page with nav bar', async () => {
  const props = await Index.getInitialProps({
    pathname: '',
    isServer: false,
    asPath: '',
    store,
    query: { type: '1', theme: 'dark', pathname: '/books/12345567990' },
  });

  const { queryByText, queryByAltText } = render(
    <Provider store={store}>
      <RouterContext.Provider value={{ asPath: '', query: { pathname: '/'} }}>
        <Index {...props} />
      </RouterContext.Provider>
    </Provider>,
  );

  expect(queryByAltText(/리디셀렉트/)).not.toBe(null);
  expect(queryByAltText(/리디북스/)).not.toBe(null);
  expect(queryByText(/BL/)).not.toBe(null);
});
