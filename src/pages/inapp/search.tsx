import React from 'react';
import { Global, css } from '@emotion/core';
import SearchPage from 'src/pages/search';

export default () => (
  <>
    <Global styles={css`html {background: white; }`} />
    <SearchPage forceAdultExclude />
  </>
);
