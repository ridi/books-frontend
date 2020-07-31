import styled from '@emotion/styled';
import React from 'react';

import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import {
  AuthorInfoWrapper,
  AuthorIconWrapper,
} from '../Authors/AuthorInfo';

import SkeletonBar from './Bar';

const SkeletonAuthorInfoWrapper = styled(AuthorInfoWrapper)`
  padding: 11px 0;
  ${orBelow(BreakPoint.LG, 'margin: 0 16px')}
`;

const SkeletonAuthorIcon = styled(AuthorIconWrapper)`
  background: linear-gradient(334.91deg, #f8f9fb 1.42%, #f1f1f3 49.17%, #f8f9fb 100%);
`;

const SkeletonAuthorBar = styled(SkeletonBar)<{ barType: 'short' | 'long' }>`
  margin-bottom: 0;
  width: ${(props) => ({ short: 68, long: 129 }[props.barType])}px;
  height: 14px;
`;

interface Props {
  barType: 'short' | 'long';
}

export default function SkeletonAuthorInfo(props: Props) {
  const { barType } = props;
  return (
    <SkeletonAuthorInfoWrapper>
      <SkeletonAuthorIcon />
      <SkeletonAuthorBar barType={barType} />
    </SkeletonAuthorInfoWrapper>
  );
}
