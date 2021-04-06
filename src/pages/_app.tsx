import { CacheProvider, Global } from '@emotion/core';
import createCache from '@emotion/cache';
import styled from '@emotion/styled';
import { ThemeProvider } from 'emotion-theming';
import { cache } from 'emotion';
import App, { AppContext } from 'next/app';
import Head from 'next/head';
import { END } from 'redux-saga';
import React, { ErrorInfo } from 'react';
import { UAParser } from 'ua-parser-js';
import Cookies from 'universal-cookie';

import GlobalNavigationBar from 'src/components/GNB';
import { defaultTheme, partialResetStyles, resetStyles } from 'src/styles';
import Footer from 'src/components/Footer';
import { PartialSeparator } from 'src/components/Misc';
import wrapper from 'src/store/config';
import { ViewportIntersectionProvider } from 'src/hooks/useViewportIntersection';
import Meta from 'src/components/Meta';
import DisallowedHostsFilter, { getStage } from 'src/components/Misc/DisallowedHostsFilter';
import sentry from 'src/utils/sentry';
import InAppThemeProvider, { getAppTheme, Theme } from 'src/components/Misc/InAppThemeProvider';
import { AppContextProvider } from 'src/hooks/useAppContext';
import { AccountProvider } from 'src/hooks/useAccount';
import { NotificationProvider } from 'src/hooks/useNotification';
import { initialize as initializeEventTracker } from 'src/utils/event-tracker';

interface StoreAppProps {
  // tslint:disable-next-line
  pageProps: any;
  // tslint:disable-next-line
  query: any;
  theme?: Theme;
  stage: string;
  nonce?: string;
  hasError: boolean;
  sentryErrorEventId?: string;
  error?: ErrorInfo | Error;
}

const Contents = styled.main`
  margin: 0 auto;
`;

class StoreApp extends App<StoreAppProps> {
  public static async getInitialProps({ ctx, Component }: AppContext) {
    const cookies = new Cookies(ctx.req?.headers?.cookie ?? {});
    const theme = getAppTheme(cookies);
    const stage = getStage(cookies);
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};
    if (ctx.req) {
      ctx.store.dispatch(END);
      await (ctx.store as any).sagaTask.toPromise();
    }

    return {
      pageProps,
      theme,
      stage,
      query: {
        ...ctx.query,
        is_login: ctx?.query?.is_login === 'true' ? 'true' : 'false',
      },
    };
  }

  public async componentDidMount() {
    const isPartials = this.props.router.pathname
      .toLowerCase()
      .startsWith('/partials/');
    if (!isPartials) {
      window.requestIdleCallback(initializeEventTracker, { timeout: 500 });
    }
    // Windows에서만 웹폰트 로드
    if (
      !isPartials
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
    sentry.captureException(error);
    super.componentDidCatch(error, errorInfo);
  }

  private renderHotjarScript() {
    const { query: { hjid } = {} } = this.props;
    if (!hjid) {
      return null;
    }
    return (
      <script
        id="hotjar-init"
        data-hjid={hjid}

        async
        nonce={this.props.nonce}
        src="/hotjar-init.js"
      />
    );
  }

  public render() {
    const {
      Component,
      query,
      theme,
      stage,
      pageProps,
      nonce,
    } = this.props;
    const pathname = this.props.router.pathname.toLowerCase();
    const isPartials = pathname.startsWith('/partials/');
    const isInApp = pathname.startsWith('/inapp/');
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
            {this.renderHotjarScript()}
          </Head>
          <PartialSeparator name="GLOBAL_STYLE_RESET" wrapped>
            <Global styles={partialResetStyles} />
          </PartialSeparator>
          {/* Todo Apply Layout */}
          <AccountProvider>
            <NotificationProvider>
              <Component {...pageProps} />
            </NotificationProvider>
          </AccountProvider>
        </>
      );
    }

    if (isInApp) {
      return (
        <>
          <Meta />
          <DisallowedHostsFilter stage={stage} />
          <CacheProvider value={createCache({ ...cache, nonce })}>
            <Global styles={resetStyles} />
            <AppContextProvider isInApp>
              <AccountProvider>
                <NotificationProvider>
                  <InAppThemeProvider theme={theme ?? ''}>
                    <ViewportIntersectionProvider>
                      <Contents>
                        <Component {...pageProps} />
                      </Contents>
                    </ViewportIntersectionProvider>
                  </InAppThemeProvider>
                </NotificationProvider>
              </AccountProvider>
            </AppContextProvider>
          </CacheProvider>
        </>
      );
    }

    return (
      // CacheProvider 올바르게 동작하는지 확인하기
      <>
        <Head>
          {/* eslint-disable no-useless-escape */}
          <script
            nonce={nonce}
            type="text/javascript"
            src="https://js.appboycdn.com/web-sdk/3.2/appboy.min.js"
          />
          {this.renderHotjarScript()}
          {/* eslint-enable no-useless-escape */}
        </Head>
        <Meta />
        <DisallowedHostsFilter stage={stage} />
        <CacheProvider value={createCache({ ...cache, nonce })}>
          <Global styles={resetStyles} />
          <AppContextProvider>
            <AccountProvider>
              <NotificationProvider>
                <ThemeProvider theme={defaultTheme}>
                  <ViewportIntersectionProvider rootMargin="100px">
                    <GlobalNavigationBar
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
              </NotificationProvider>
            </AccountProvider>
          </AppContextProvider>
        </CacheProvider>
      </>
    );
  }
}
export default wrapper.withRedux(StoreApp);
