import React from 'react';
import { Global, css } from '@emotion/core';
import SearchPage from 'src/pages/search';

export default () => {
  React.useEffect(() => {
    window.isExternalLink = (url: string) => !/(\/inapp\/search\?|\/books\/[0-9]+\/in-app-search\?|\?q=)/g.test(url);
    window.isLoginRequired = () => false;
    return () => {
      delete window.isExternalLink;
      delete window.isLoginRequired;
    };
  }, []);

  return (
    <>
      <Global styles={css`html {background: white; }`} />
      <SearchPage forceAdultExclude />
    </>
  );
};
