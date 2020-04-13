import { CacheProvider, Global } from '@emotion/core';
import createCache from '@emotion/cache';
import styled from '@emotion/styled';
import { ConnectedRouter } from 'connected-next-router';
import { ThemeProvider } from 'emotion-theming';
import { cache } from 'emotion';
import App, { AppContext } from 'next/app';
import Head from 'next/head';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import React, { ErrorInfo } from 'react';
import { UAParser } from 'ua-parser-js';

import GNB from 'src/components/GNB';
import { defaultTheme, partialResetStyles, resetStyles } from 'src/styles';
import Footer from 'src/components/Footer';
import { PartialSeparator } from 'src/components/Misc';
import makeStore, { RootState } from 'src/store/config';
import { ViewportIntersectionProvider } from 'src/hooks/useViewportIntersection';
import Meta from 'src/components/Meta';
import DisallowedHostsFilter from 'src/components/Misc/DisallowedHostsFilter';
import sentry from 'src/utils/sentry';
import InAppThemeProvider, { getAppTheme, Theme } from 'src/components/Misc/InAppThemeProvider';

interface StoreAppProps {
  store: Store<RootState>;
  // tslint:disable-next-line
  pageProps: any;
  isPartials?: boolean;
  isInApp?: boolean;
  theme?: Theme;
  // tslint:disable-next-line
  query: any;
  ctxPathname?: string;
  hasError: boolean;
  sentryErrorEventId?: string;
  error?: ErrorInfo | Error;
}

interface StoreAppState {
  hasError: boolean;
  sentryErrorEventId?: string;
  error?: ErrorInfo | Error;
}

const Contents = styled.main`
  margin: 0 auto;
`;

class StoreApp extends App<StoreAppProps, StoreAppState> {
  public static async getInitialProps({ ctx, Component, ...rest }: AppContext) {
    const isPartials = !!ctx.pathname.match(/^\/partials\//u);
    const isInApp = !!ctx.pathname.match(/^\/inapp\//u);
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};
    const theme = getAppTheme(ctx.req?.headers ?? {});

    return {
      pageProps,
      isPartials,
      isInApp,
      theme,
      ctxPathname: rest.router ? rest.router.asPath : '/',
      query: {
        ...ctx.query,
        is_login: ctx?.query?.is_login === 'true' ? 'true' : 'false',
      },
    };
  }

  public async serviceWorkerInit() {
    try {
      if ('serviceWorker' in navigator) {
        // 서비스 워커 일단 끔
        // const { Workbox } = await import('workbox-window');
        // const wb = new Workbox('/service-worker.js');
        // wb.addEventListener('waiting', event => {});
        // wb.addEventListener('activated', event => {});
        // wb.addEventListener('installed', event => {});
        // wb.register();
      }
    } catch (error) {
      sentry.captureException(error);
    }
  }

  public async componentDidMount() {
    if (!this.props.isPartials) {
      this.serviceWorkerInit();
    }
    // Windows에서만 웹폰트 로드
    if (
      !this.props.isPartials
      && new UAParser().getOS().name?.toLowerCase().includes('windows')
    ) {
      const WebFont = await import('webfontloader');
      WebFont.load({
        google: {
          families: ['Nanum Gothic:400,700:korean'],
        },
      });
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    sentry.captureException(error, {
      ...this.props,
      err: error,
    });
    super.componentDidCatch(error, errorInfo);
  }

  public render() {
    const {
      Component,
      ctxPathname,
      query,
      pageProps,
      isPartials,
      isInApp,
      theme,
      store,
      // @ts-ignore
      nonce,
    } = this.props;

    if (!pageProps || (pageProps.statusCode && pageProps.statusCode >= 400)) {
      return (
        <>
          <Global styles={resetStyles} />
          <Contents>
            <Component {...pageProps} />
          </Contents>
        </>
      );
    }

    if (isPartials) {
      return (
        <>
          <Head>
            <meta name="viewport" />
            {typeof document !== 'undefined' && <title>{document.title ?? ''}</title>}
          </Head>
          <PartialSeparator name="GLOBAL_STYLE_RESET" wrapped>
            <Global styles={partialResetStyles} />
          </PartialSeparator>
          {/* Todo Apply Layout */}
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </>
      );
    }

    if (isInApp) {
      return (
        <>
          <Meta />
          <DisallowedHostsFilter />
          <CacheProvider value={createCache({ ...cache, nonce })}>
            <Global styles={resetStyles} />
            <Provider store={store}>
              <ConnectedRouter>
                <InAppThemeProvider theme={theme}>
                  <ViewportIntersectionProvider>
                    <Contents>
                      <Component {...pageProps} />
                    </Contents>
                  </ViewportIntersectionProvider>
                </InAppThemeProvider>
              </ConnectedRouter>
            </Provider>
          </CacheProvider>
        </>
      );
    }

    return (
      // CacheProvider 올바르게 동작하는지 확인하기
      <>
        <Meta />
        <DisallowedHostsFilter />
        <CacheProvider value={createCache({ ...cache, nonce })}>
          <Global styles={resetStyles} />
          <Provider store={store}>
            <ConnectedRouter>
              {/* Todo Apply Layout */}
              <ThemeProvider theme={defaultTheme}>
                <ViewportIntersectionProvider rootMargin="100px">
                  <GNB
                    searchKeyword={query.search || query.q}
                    isPartials={false}
                    isLoginForPartials={query.is_login}
                  />
                  <Contents>
                    <Component {...pageProps} />
                  </Contents>
                  <Footer />
                </ViewportIntersectionProvider>
              </ThemeProvider>
            </ConnectedRouter>
          </Provider>
        </CacheProvider>
      </>
    );
  }
}
export default withRedux(makeStore, { debug: false })(withReduxSaga(StoreApp));
