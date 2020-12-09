import React, { useEffect, useCallback } from 'react';
import Head from 'next/head';
import PageTitle from 'src/components/PageTitle/PageTitle';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { RIDITheme } from 'src/styles';
import { timeAgo } from 'src/utils/common';
import NotificationIcon from 'src/svgs/Notification_solid.svg';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import NotificationItem from 'src/components/Notification/NotificationItem';
import NotificationPlaceholder from 'src/components/Notification/NotificationItemPlaceholder';
import * as tracker from 'src/utils/event-tracker';
import sentry from 'src/utils/sentry';
import useAccount from 'src/hooks/useAccount';
import useNotification from 'src/hooks/useNotification';

const Section = styled.section<{}, RIDITheme>`
  background-color: ${(props) => props.theme.backgroundColor};
  max-width: 952px;
  min-height: 620px;
  margin: 0 auto;
  ${orBelow(
    BreakPoint.LG,
    'padding: 0;',
  )};
`;

const NotiList = styled.ul`
  margin-bottom: 24px;
`;

const NoEmptyNotification = styled.p`
  text-align: center;
  padding-top: 303px;
  padding-bottom: 359px;
  ${orBelow(
    BreakPoint.M,
    `
      padding-top: 144px;
      padding-bottom: 200px;
    `,
  )};
`;

const notificationStyle = css`
  width: 65px;
  height: 71px;
  fill: #e6e8eb;
`;

const NoEmptyNotificationText = styled.span`
  display: block;
  margin-top: 20px;
  font-size: 14px;
  color: #808991;
  letter-spacing: -0.3px;
  font-weight: normal;
`;

interface NotificationPageProps {
  isTitleHidden?: boolean;
}

const NotificationPage: React.FunctionComponent<NotificationPageProps> = (props) => {
  const { isTitleHidden = false } = props;
  const { unreadCount, items, requestFetchNotifications } = useNotification();
  const loggedUser = useAccount();
  const slug = 'notification-item';

  const setPageView = useCallback(() => {
    try {
      tracker.sendPageView(window.location.href, document.referrer);
    } catch (error) {
      sentry.captureException(error);
    }
  }, []);

  useEffect(() => {
    setPageView();
  }, [loggedUser]);

  useEffect(() => {
    requestFetchNotifications(100);
  }, [requestFetchNotifications]);

  return (
    <>
      <Head>
        <title>리디북스 - 알림</title>
      </Head>
      <Section>
        {!isTitleHidden && (
          <PageTitle title="알림" mobileHidden />
        )}
        {items != null && unreadCount != null ? (
          <NotiList>
            {items.length === 0 ? (
              <NoEmptyNotification>
                <NotificationIcon css={notificationStyle} />
                <NoEmptyNotificationText>새로운 알림이 없습니다.</NoEmptyNotificationText>
              </NoEmptyNotification>
            ) : (
              items.map((item, index) => (
                <NotificationItem
                  key={item.id}
                  createdAtTimeAgo={timeAgo(item.createdAt)}
                  item={item}
                  dot={index < unreadCount}
                  slug={slug}
                  order={index}
                />
              ))
            )}
          </NotiList>
        ) : (
          <NotificationPlaceholder num={5} />
        )}
      </Section>
    </>
  );
};

export default NotificationPage;
