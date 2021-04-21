import React from 'react';
import faviconWin8 from 'src/assets/favicon/favicon_win8.png';
import favicon from 'src/assets/favicon/favicon.ico';
import appleIcon57 from 'src/assets/favicon/apple-icon-57x57.png';
import appleIcon60 from 'src/assets/favicon/apple-icon-60x60.png';
import appleIcon72 from 'src/assets/favicon/apple-icon-72x72.png';
import appleIcon76 from 'src/assets/favicon/apple-icon-76x76.png';
import appleIcon114 from 'src/assets/favicon/apple-icon-114x114.png';
import appleIcon120 from 'src/assets/favicon/apple-icon-120x120.png';
import appleIcon144 from 'src/assets/favicon/apple-icon-144x144.png';
import appleIcon152 from 'src/assets/favicon/apple-icon-152x152.png';
import appleIcon180 from 'src/assets/favicon/apple-icon-180x180.png';
import androidIcon192 from 'src/assets/favicon/android-icon-192x192.png';
import appleTouchIcon from 'src/assets/favicon/apple-touch-icon.png';
import favicon32 from 'src/assets/favicon/favicon-32x32.png';
import favicon16 from 'src/assets/favicon/favicon-16x16.png';
import androidChrome192 from 'src/assets/favicon/android-chrome-192x192.png';

export default () => (
  <>
    <meta
      name="msapplication-TileImage"
      content={faviconWin8}
    />
    <meta name="msapplication-TileColor" content="#ffffff" />
    <link
      rel="shortcut icon"
      href={favicon}
    />

    <link
      rel="apple-touch-icon"
      sizes="57x57"
      href={appleIcon57}
    />
    <link
      rel="apple-touch-icon"
      sizes="60x60"
      href={appleIcon60}
    />
    <link
      rel="apple-touch-icon"
      sizes="72x72"
      href={appleIcon72}
    />
    <link
      rel="apple-touch-icon"
      sizes="76x76"
      href={appleIcon76}
    />
    <link
      rel="apple-touch-icon"
      sizes="114x114"
      href={appleIcon114}
    />
    <link
      rel="apple-touch-icon"
      sizes="120x120"
      href={appleIcon120}
    />
    <link
      rel="apple-touch-icon"
      sizes="144x144"
      href={appleIcon144}
    />
    <link
      rel="apple-touch-icon"
      sizes="152x152"
      href={appleIcon152}
    />
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href={appleIcon180}
    />
    <link
      rel="icon"
      type="image/png"
      sizes="192x192"
      href={androidIcon192}
    />

    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href={appleTouchIcon}
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href={favicon32}
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href={favicon16}
    />
    <link
      rel="icon"
      type="image/png"
      sizes="192x192"
      href={androidChrome192}
    />
  </>
);
