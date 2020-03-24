import Head from 'next/head';

import Favicon from 'src/components/Meta/Favicon';
import CSP from 'src/components/Meta/CSP';
import ogImage from 'src/assets/image/ridibooks.png';

export default () => (
  <Head>
    <Favicon />
    <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes"
    />
    <CSP />
    <meta name="twitter:site" content="@ridibooks" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@ridibooks" />
    <meta property="fb:app_id" content="208688205808637" />
    <meta name="theme-color" content="#ffffff" />
    <meta name="keywords" content="리디북스,리디,ridibooks,ridi,책,전자책,ebook" />
    <meta name="format-detection" content="telephone=no" />
    <meta property="og:url" content="https://ridibooks.com" />
    <meta property="og:image" content={ogImage} />
    <meta property="og:title" content="RIDIBOOKS" />
    <meta
      property="og:description"
      content="웹툰/웹소설, 전자책, 만화까지 취향에 딱 맞는 콘텐츠를 제안합니다."
    />
    <meta
      name="description"
      content="웹툰/웹소설, 전자책, 만화까지 취향에 딱 맞는 콘텐츠를 제안합니다."
    />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link
      href="https://fonts.googleapis.com/css?family=Nanum+Gothic&display=swap&subset=korean"
      rel="stylesheet"
    />
  </Head>
);
