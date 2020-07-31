import '@testing-library/jest-dom/extend-expect';
import { act, render, cleanup, RenderResult } from '@testing-library/react';
import { ensureMocksReset, requestIdleCallback } from '@shopify/jest-dom-mocks';
import * as React from 'react';

import App from 'src/pages/_app';
import makeStore from '../utils/makeStore';

afterEach(async () => {
  ensureMocksReset();
  await act(async () => {
    cleanup();
  });
});

const store = makeStore();

jest.mock('src/components/GNB', () => ({
  __esModule: true,
  default: () => <nav>GNB</nav>,
}));

jest.mock('src/components/Footer', () => ({
  __esModule: true,
  default: () => <footer>Footer</footer>,
}));

jest.mock('src/store/config', () => ({
  __esModule: true,
  default: {
    withRedux: x => x,
  },
}));

describe('App', () => {
  it('should render regular pages', async () => {
    const mock = jest.fn().mockReturnValue(<div>mock</div>);
    requestIdleCallback.mock();
    let renderResult: RenderResult;
    await act(async () => {
      renderResult = render(
        <App
          router={{ pathname: '/[genre]/' } as any}
          pageProps={{}}
          query={{}}
          hasError={false}
          Component={mock}
        />
      );
    });
    requestIdleCallback.runIdleCallbacks();
    expect(renderResult.container.innerHTML).not.toMatch(/GLOBAL_STYLE_RESET/);
    expect(renderResult.container).toHaveTextContent(/GNB/);
    expect(renderResult.container).toHaveTextContent(/mock/);
    expect(renderResult.container).toHaveTextContent(/Footer/);
    requestIdleCallback.restore();
  });

  it('should render inapp', async () => {
    const mock = jest.fn().mockReturnValue(<div>mock</div>);
    requestIdleCallback.mock();
    let renderResult: RenderResult;
    await act(async () => {
      renderResult = render(
        <App
          router={{ pathname: '/inapp/notifications/' } as any}
          pageProps={{}}
          query={{}}
          hasError={false}
          Component={mock}
        />
      );
    });
    requestIdleCallback.runIdleCallbacks();
    expect(renderResult.container.innerHTML).not.toMatch(/GLOBAL_STYLE_RESET/);
    expect(renderResult.container).not.toHaveTextContent(/GNB/);
    expect(renderResult.container).toHaveTextContent(/mock/);
    expect(renderResult.container).not.toHaveTextContent(/Footer/);
    requestIdleCallback.restore();
  });

  it('should render partials', async () => {
    const mock = jest.fn().mockReturnValue(<div>mock</div>);
    requestIdleCallback.mock();
    let renderResult: RenderResult;
    await act(async () => {
      renderResult = render(
        <App
          router={{ pathname: '/partials/gnb/' } as any}
          pageProps={{}}
          query={{}}
          hasError={false}
          Component={mock}
        />
      );
    });
    requestIdleCallback.runIdleCallbacks();
    expect(renderResult.container.innerHTML).toMatch(/GLOBAL_STYLE_RESET/);
    expect(renderResult.container).not.toHaveTextContent(/GNB/);
    expect(renderResult.container).toHaveTextContent(/mock/);
    expect(renderResult.container).not.toHaveTextContent(/Footer/);
    requestIdleCallback.restore();
  });
});
