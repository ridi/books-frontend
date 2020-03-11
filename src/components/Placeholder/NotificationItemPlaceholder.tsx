import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { RIDITheme } from 'src/styles';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';


const NotificationPlaceholderWrap = styled.div<{ opacity: number }, RIDITheme>`
  position: relative;
  display: flex;
  margin: 0px auto;
  padding: 14px 0px;
  min-height: 620px;
  opacity: ${(props) => props.opacity};
  ${orBelow(
    BreakPoint.LG,
    css`
      margin: 0 16px;
    `,
  )};
  ::after {
    content: '';
    width: 100%;
    position: absolute;
    height: 1px;
    background: ${(props) => props.theme.dividerColor};
    opacity: ${(props) => props.theme.dividerOpacity};
    bottom: 0;
    left: 0;
  }
`;

const NotificationThumbnail = styled.div<{}, RIDITheme>`
  flex: none;
  width: 56px;
  height: 80px;
  background: ${(props) => props.theme.placeholderColor};
`;

const NotificationMeta = styled.div`
  margin-left: 16px;
  padding-right: 26px;
  flex: 1;
`;

const NotificationTitle = styled.div<{}, RIDITheme>`
  width: 100%;
  height: 20px;
  margin-bottom: 7px;
  background: ${(props) => props.theme.placeholderColor};
`;

const NotificationDate = styled.div<{}, RIDITheme>`
  width: 84px;
  height: 20px;
  background: ${(props) => props.theme.placeholderColor};
`;

interface NotificationPlaceholderProps {
  num: number;
}

interface NotificationItemPlaceholderProps {
  opacity: number;
}

const NotificationItemPlaceholder: React.FC<NotificationItemPlaceholderProps> = (props) => (
  <NotificationPlaceholderWrap opacity={props.opacity}>
    <NotificationThumbnail />
    <NotificationMeta>
      <NotificationTitle />
      <NotificationDate />
    </NotificationMeta>
  </NotificationPlaceholderWrap>
);

const NotificationPlaceholder: React.FC<NotificationPlaceholderProps> = (props) => {
  const { num } = props;

  return (
    <>
      {[...Array(num)].map((item, i) => (
        <NotificationItemPlaceholder key={i} opacity={Number((1 - (i * 0.14)).toFixed(1))} />
      ))}
    </>
  );
};

export default NotificationPlaceholder;
