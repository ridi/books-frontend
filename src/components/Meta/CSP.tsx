import React from 'react';
import builder from 'content-security-policy-builder';

const thirdPartyVendors = [
  'www.google-analytics.com',
  'www.googletagmanager.com',
  'connect.facebook.net',
  'https://fonts.googleapis.com',
  'www.google.com',
  'www.google.co.kr',
  'sentry.io',
  'stats.g.doubleclick.net',
  'www.facebook.com',
  'stats.g.doubleclick.net',
  'staticxx.facebook.com',
  'connect.facebook.net',
  'sdk.iad-06.braze.com',
];

const whiteList = [
  'https://*.ridi.io',
  'https://*.ridibooks.com',
  'https://ridibooks.com',
  'https://books.ridibooks.com',
  'https://*.ridicdn.net',
  'https://js.appboycdn.com',
  'https://use.fontawesome.com',
  'https://appboy-images.com',
];

export default () => {
  const scriptSrc = [
    "'self'",
    ...thirdPartyVendors,
    ...whiteList,
  ];

  const styleSrc = [
    "'self'",
    "'unsafe-inline'",
    ...thirdPartyVendors,
    ...whiteList,
  ];

  if (!process.env.IS_PRODUCTION) {
    scriptSrc.push("'unsafe-eval'");
  } else {
    // styleSrc.push(nonce);
  }

  scriptSrc.push("'unsafe-inline'");

  return (
    <meta
      httpEquiv="Content-Security-Policy"
      content={builder({
        directives: {
          baseUri: ["'none'"],
          objectSrc: ["'none'"],
          imgSrc: [
            "'self'",
            // Todo Use CNAME
            'https://*.amazonaws.com',
            ...thirdPartyVendors,
            ...whiteList,
          ],
          frameSrc: ['staticxx.facebook.com', 'connect.facebook.net'],
          styleSrc,
          scriptSrc,
          connectSrc: [
            "'self'",
            // Todo Use CNAME
            'https://*.amazonaws.com',
            ...thirdPartyVendors,
            ...whiteList,
          ],
          // <meta/> 에서 report-uri 는 동작하지 않습니다. https://developers.google.com/web/fundamentals/security/csp?hl=ko
          // 'report-uri': `https://sentry.io/api/1402572/security/?sentry_key=a0a997382844435fa6c89803ef6ce8e5&sentry_environment=${process.env.STAGE};`,
        },
      })}
    />
  );
};
