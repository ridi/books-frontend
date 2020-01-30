import * as React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

const NotificationPlaceholderWrap = styled.div`
  display: flex;
  margin: 14px 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f8f9fb;
`;

const NotificationThumbnail = styled.div`
  flex: none;
  width: 56px;
  height: 80px;
  background: linear-gradient(326.23deg, #f8f9fb 1.42%, #f1f1f3 49.17%, #f8f9fb 100%);
`;

const NotificationMeta = styled.div`
  margin-left: 16px;
`;

const NotificationTitle = styled.div`
  width: 854px;
  height: 20px;
  margin-bottom: 7px;
  background: linear-gradient(326.23deg, #f8f9fb 1.42%, #f1f1f3 49.17%, #f8f9fb 100%);
  ${orBelow(
    BreakPoint.LG,
    css`
      width: 696px;
    `,
  )};
  ${orBelow(
    BreakPoint.M,
    css`
      width: 245px;
    `,
  )};
`;

const NotificationDate = styled.div`
  width: 84px;
  height: 20px;
  background: linear-gradient(326.23deg, #f8f9fb 1.42%, #f1f1f3 49.17%, #f8f9fb 100%);
`;

interface NotificationPlaceholderProps {
  num: number;
}

const NotificationItemPlaceholder: React.FC = () => (
  <NotificationPlaceholderWrap>
    <NotificationThumbnail></NotificationThumbnail>
    <NotificationMeta>
      <NotificationTitle></NotificationTitle>
      <NotificationDate></NotificationDate>
    </NotificationMeta>
  </NotificationPlaceholderWrap>
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
