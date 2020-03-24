import styled from '@emotion/styled';
import { BreakPoint } from 'src/utils/mediaQuery';

export const ThumbnailWrapper = styled.div<{ lgWidth?: 100 | 120 }>`
  width: 140px;
  height: 217px; // 216px -> 217px by 데미안
  display: flex;
  align-items: flex-end;
  flex-shrink: 0;
  @media (max-width: ${BreakPoint.LG}px) {
    width: ${(props) => props.lgWidth || 100}px;
    height: ${(props) => (props.lgWidth === 120 ? 184 : 159)}px; // 153px -> 159px by 데미안
  }

  img {
    max-height: calc(140px * 1.618 - 10px);
    @media (max-width: ${BreakPoint.LG}px) {
      max-height: calc(${(props) => props.lgWidth || 100}px * 1.618 - 10px);
    }
  }
`;
