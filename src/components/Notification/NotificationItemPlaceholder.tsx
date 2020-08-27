import * as React from 'react';
import styled from '@emotion/styled';
import { defaultTheme, darkTheme } from 'src/styles/themes';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { NotificationPageProps } from 'src/pages/notification';
import { mq } from 'src/styles/inapp';

type COLOR_SCHEME = Pick<NotificationPageProps, 'useColorScheme'>

const NotificationPlaceholderWrap = styled.div<{ opacity: number }, COLOR_SCHEME>`
  position: relative;
  display: flex;
  margin: 0 auto;
  padding: 14px 0px;
  opacity: ${(props) => props.opacity};
  ${orBelow(
    BreakPoint.LG,
    'margin: 0 16px;',
  )};
  ::after {
    content: '';
    width: 100%;
    position: absolute;
    height: 1px;
    background: ${defaultTheme.placeholderColor};
    bottom: 0;
    left: 0;
  }
  ${({ theme }) => theme.useColorScheme && mq({
    '::after': {
      background: [defaultTheme.placeholderColor, darkTheme.placeholderColor],
    },
  })}
`;

const NotificationThumbnail = styled.div<{}, COLOR_SCHEME>`
  flex: none;
  width: 56px;
  height: 80px;
  background: ${defaultTheme.placeholderThumbnail};
  ${({ theme }) => theme.useColorScheme && mq({
    background: [defaultTheme.placeholderThumbnail, darkTheme.placeholderThumbnail],
  })}
`;

const NotificationMeta = styled.div`
  margin-left: 16px;
  padding-right: 26px;
  flex: 1;
`;

const NotificationTitle = styled.div<{}, COLOR_SCHEME>`
  width: 100%;
  height: 20px;
  margin-bottom: 7px;
  background: ${defaultTheme.placeholderColor};
  ${({ theme }) => theme.useColorScheme && mq({
    background: [defaultTheme.placeholderColor, darkTheme.placeholderColor],
  })}
`;

const NotificationDate = styled.div<{}, COLOR_SCHEME>`
  width: 84px;
  height: 20px;
  background: ${defaultTheme.placeholderColor};
  ${({ theme }) => theme.useColorScheme && mq({
    background: [defaultTheme.placeholderColor, darkTheme.placeholderColor],
  })}
`;

interface NotificationPlaceholderProps {
  num: number;
}

interface NotificationItemPlaceholderProps {
  opacity: number;
}

const NotificationItemPlaceholder: React.FC<NotificationItemPlaceholderProps> = ({ opacity }) => (
  <NotificationPlaceholderWrap opacity={opacity}>
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
