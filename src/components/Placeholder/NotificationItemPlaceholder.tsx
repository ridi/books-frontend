import * as React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { RIDITheme } from 'src/styles';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

const NotificationPlaceholderWrap = (theme: RIDITheme) => css`
  position: relative;
  display: flex;
  margin: 0px 16px;
  padding: 14px 0px;
  ::after {
    content: '';
    width: 100%;
    position: absolute;
    height: 1px;
    background: ${theme.dividerColor};
    opacity: ${theme.dividerOpacity};
    bottom: 0px;
  }
`;

const NotificationThumbnail = (theme: RIDITheme) => css`
  flex: none;
  width: 56px;
  height: 80px;
  background: ${theme.placeholderColor};
`;

const NotificationMeta = styled.div`
  margin-left: 16px;
`;

const NotificationTitle = (theme: RIDITheme) => css`
  width: 854px;
  height: 20px;
  margin-bottom: 7px;
  background: ${theme.placeholderColor};
  ${orBelow(
    BreakPoint.LG,
    css`
      width: 696px;
    `,
  )};
  ${orBelow(
    BreakPoint.MD,
    css`
      width: 245px;
    `,
  )};
`;

const NotificationDate = (theme: RIDITheme) => css`
  width: 84px;
  height: 20px;
  background: ${theme.placeholderColor};
`;

interface NotificationPlaceholderProps {
  num: number;
}

const NotificationItemPlaceholder: React.FC = () => (
  <div css={NotificationPlaceholderWrap}>
    <div css={NotificationThumbnail}></div>
    <NotificationMeta>
      <div css={NotificationTitle}></div>
      <div css={NotificationDate}></div>
    </NotificationMeta>
  </div>
);

const NotificationPlaceholder: React.FC<NotificationPlaceholderProps> = props => {
  const { num } = props;

  return (
    <>
      {[...Array(num)].map((item, i) => (
        <NotificationItemPlaceholder key={i} />
      ))}
    </>
  );
};

export default NotificationPlaceholder;
