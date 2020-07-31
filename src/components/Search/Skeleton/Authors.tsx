import styled from '@emotion/styled';
import React from 'react';

import SkeletonAuthorInfo from './AuthorInfo';

const SkeletonAuthorsWrapper = styled.ul`
  margin-bottom: 16px;
`;

export default function SkeletonAuthors() {
  return (
    <SkeletonAuthorsWrapper>
      <SkeletonAuthorInfo barType="short" />
      <SkeletonAuthorInfo barType="long" />
      <SkeletonAuthorInfo barType="short" />
    </SkeletonAuthorsWrapper>
  );
}
