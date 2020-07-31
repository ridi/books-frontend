import React from 'react';
import { css } from '@emotion/core';

import { Wrapper } from 'src/components/Search/SearchLandscapeBook';
import MetaWrapper from 'src/components/Search/SearchLandscapeBook/MetaWrapper';
import SkeletonBook from 'src/components/Search/Skeleton/Book';
import SkeletonBar from 'src/components/Search/Skeleton/Bar';

const longBar = css`width: 100%;`;
const shortBar = css`width: 130px;`;

export default function Skeleton() {
  return (
    <Wrapper>
      <SkeletonBook />
      <MetaWrapper>
        <SkeletonBar css={longBar} />
        <SkeletonBar css={shortBar} />
      </MetaWrapper>
    </Wrapper>
  );
}
