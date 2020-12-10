import { ADULT_BADGE_URL } from 'src/constants/icons';
import React from 'react';
import styled from '@emotion/styled';

const Badge = styled.img`
  display: block;
  position: absolute;
  right: 3px;
  top: 3px;
  width: 20px !important;
  height: 20px !important;
`;

export const AdultBadge: React.FunctionComponent = () => (
  <Badge src={ADULT_BADGE_URL} alt="성인 전용 도서" />
);
