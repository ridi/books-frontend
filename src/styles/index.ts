import { css } from '@emotion/core';

export * from './reset';
export * from './inapp';
export * from './themes';

export enum ZIndexLayer {
  LEVEL_10 = 10000,
  LEVEL_9 = 5000,
  LEVEL_8 = 2500,
  LEVEL_7 = 100,
  LEVEL_6 = 50,
  LEVEL_5 = 25,
  LEVEL_4 = 10,
  LEVEL_3 = 1,
  LEVEL_2 = 0,
  LEVEL_1 = -10000,
}

export const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const flexRowStart = css`
  display: flex;
  flex-direction: row;
  justify-content: start;
`;
export const flexColumnStart = css`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
`;

export const lineClamp = (limit: number) => css`
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: ${limit};
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  white-space: normal;
  word-break: keep-all;

  @media (-ms-high-contrast: none), (-ms-high-contrast: active) {
    white-space: nowrap;
  }
`;

export const scrollBarHidden = css`
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 0;
    height: 0;
    display: none !important; // 윈도우 크롬 등
  }
  & {
    overflow: -moz-scrollbars-none;
  }
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox 64 */
`;

export const displayNoneForTouchDevice = css`
  @media (hover: none) {
    display: none;
  }
  @media (hover: none) and (pointer: coarse) {
    display: none;
  }
  @media (hover: none) and (pointer: fine) {
    display: none;
  }
`;

export const defaultHoverStyle = css`
  :hover {
    background: rgba(0, 0, 0, 0.05);
  }
  @media(hover: none) {
    :hover {
      background: inherit;
    }
  }
`;
