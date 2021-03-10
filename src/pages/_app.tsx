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
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                  +function(a,p,P,b,y){a.appboy={};a.appboyQueue=[];for(var s="DeviceProperties Card Card.prototype.dismissCard Card.prototype.removeAllSubscriptions Card.prototype.removeSubscription Card.prototype.subscribeToClickedEvent Card.prototype.subscribeToDismissedEvent Banner CaptionedImage ClassicCard ControlCard ContentCards ContentCards.prototype.getUnviewedCardCount Feed Feed.prototype.getUnreadCardCount ControlMessage InAppMessage InAppMessage.SlideFrom InAppMessage.ClickAction InAppMessage.DismissType InAppMessage.OpenTarget InAppMessage.ImageStyle InAppMessage.Orientation InAppMessage.TextAlignment InAppMessage.CropType InAppMessage.prototype.closeMessage InAppMessage.prototype.removeAllSubscriptions InAppMessage.prototype.removeSubscription InAppMessage.prototype.subscribeToClickedEvent InAppMessage.prototype.subscribeToDismissedEvent FullScreenMessage ModalMessage HtmlMessage SlideUpMessage User User.Genders User.NotificationSubscriptionTypes User.prototype.addAlias User.prototype.addToCustomAttributeArray User.prototype.getUserId User.prototype.incrementCustomUserAttribute User.prototype.removeFromCustomAttributeArray User.prototype.setAvatarImageUrl User.prototype.setCountry User.prototype.setCustomLocationAttribute User.prototype.setCustomUserAttribute User.prototype.setDateOfBirth User.prototype.setEmail User.prototype.setEmailNotificationSubscriptionType User.prototype.setFirstName User.prototype.setGender User.prototype.setHomeCity User.prototype.setLanguage User.prototype.setLastKnownLocation User.prototype.setLastName User.prototype.setPhoneNumber User.prototype.setPushNotificationSubscriptionType InAppMessageButton InAppMessageButton.prototype.removeAllSubscriptions InAppMessageButton.prototype.removeSubscription InAppMessageButton.prototype.subscribeToClickedEvent display display.automaticallyShowNewInAppMessages display.destroyFeed display.hideContentCards display.showContentCards display.showFeed display.showInAppMessage display.toggleContentCards display.toggleFeed changeUser destroy getDeviceId initialize isPushBlocked isPushGranted isPushPermissionGranted isPushSupported logCardClick logCardDismissal logCardImpressions logContentCardsDisplayed logCustomEvent logFeedDisplayed logInAppMessageButtonClick logInAppMessageClick logInAppMessageHtmlClick logInAppMessageImpression logPurchase openSession registerAppboyPushMessages removeAllSubscriptions removeSubscription requestContentCardsRefresh requestFeedRefresh requestImmediateDataFlush resumeWebTracking setLogger stopWebTracking subscribeToContentCardsUpdates subscribeToFeedUpdates subscribeToInAppMessage subscribeToNewInAppMessages toggleAppboyLogging trackLocation unregisterAppboyPushMessages wipeData".split(" "),i=0;i<s.length;i++){for(var m=s[i],k=a.appboy,l=m.split("."),j=0;j<l.length-1;j++)k=k[l[j]];k[l[j]]=(new Function("return function "+m.replace(/\./g,"_")+"(){window.appboyQueue.push(arguments); return true}"))()}window.appboy.getCachedContentCards=function(){return new window.appboy.ContentCards};window.appboy.getCachedFeed=function(){return new window.appboy.Feed};window.appboy.getUser=function(){return new window.appboy.User};(y=p.createElement(P)).type='text/javascript';
                  y.src='https://js.appboycdn.com/web-sdk/3.2/appboy.min.js';
                  y.async=1;(b=p.getElementsByTagName(P)[0]).parentNode.insertBefore(y,b)
                  }(window,document,'script');
              `,
            }}
          />
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
