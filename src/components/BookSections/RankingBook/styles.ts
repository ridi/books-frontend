import styled from '@emotion/styled';
import ThumbnailWithBadge from 'src/components/Book/ThumbnailWithBadge';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

export const SectionWrapper = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 0;
  position: relative;

  ${orBelow(999, 'padding: 16px 0;')};
`;

const BIG_ITEM_HEIGHT = 138;
const SMALL_ITEM_HEIGHT = 94;

export const RankPosition = styled.h3`
  height: 22px;
  margin-right: 21px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: #000000;
`;

export const TimerWrapper = styled.div`
  width: 96px;
  height: 30px;
  padding: 9px;
  padding-right: 13px;
  margin-bottom: 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background-image: linear-gradient(255deg, #0077d9 4%, #72d2e0);
  border-radius: 14px;

  font-size: 13px;
  font-weight: bold;
  color: white;

  > * {
    flex: none;
  }
`;

export const List = styled.ul<{ type: 'big' | 'small' }>`
  display: -ms-grid; // emotion이 쓰는 stylis.js가 grid를 지원하지 않음
  -ms-grid-rows: (${({ type }) => (type === 'big' ? BIG_ITEM_HEIGHT : SMALL_ITEM_HEIGHT)}px)[3];
  -ms-grid-columns: 308px 13px 308px 13px 308px; // gap 시뮬레이션
  display: grid;
  grid: repeat(3, ${({ type }) => (type === 'big' ? BIG_ITEM_HEIGHT : SMALL_ITEM_HEIGHT)}px) / auto-flow 308px;
  grid-column-gap: 13px;

  padding: 0 24px;
  ${orBelow(BreakPoint.LG, 'padding: 0 20px;')}
  ${orBelow(BreakPoint.MD, 'padding: 0 16px;')}
`;

export const BookMetaBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px #e6e8eb solid;
`;

export const RankingBookItem = styled.li<{ type: 'big' | 'small' }>`
  display: flex;
  align-items: center;
  box-sizing: content-box;

  &:nth-of-type(3n) ${BookMetaBox} {
    border-bottom: 0;
  }
`;

export const ThumbnailAnchor = styled.a<{ type: 'big' | 'small' }>`
  flex: none;
  margin-right: ${(props) => (props.type === 'big' ? 18 : 24)}px;
`;

export const StyledThumbnailWithBadge = styled(ThumbnailWithBadge)<{ type: 'big' | 'small' }>`
  width: ${(props) => (props.type === 'big' ? 80 : 50)}px;
  max-height: ${(props) => (props.type === 'big' ? 114 : 71)}px;
`;
