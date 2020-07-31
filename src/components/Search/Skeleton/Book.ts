import styled from '@emotion/styled';

import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

const SkeletonBook = styled.div`
  background: linear-gradient(327.23deg, #F8F9FB 1.42%, #F1F1F3 49.17%, #F8F9FB 100%);
  flex: none;
  width: 100px;
  height: 140px;
  ${orBelow(BreakPoint.LG, 'width: 80px; height: 110px')}
`;

export default SkeletonBook;
