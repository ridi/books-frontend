import React, { useEffect } from 'react';
import Head from 'next/head';
import PageTitle from 'src/components/PageTitle/PageTitle';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { flexColumnStart, RIDITheme } from 'src/styles';
import { timeAgo } from 'src/utils/common';
import ArrowLeft from 'src/svgs/ChevronRight.svg';
import NotificationIcon from 'src/svgs/Notification_solid.svg';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { notificationActions } from 'src/services/notification';
import { RootState } from 'src/store/config';
import NotificationPlaceholder from 'src/components/Placeholder/NotificationItemPlaceholder';

const sectionCSS = css`
  padding: 31px 50px 0 50px;
  max-width: 1000px;
  min-height: 800px;
  margin: 0 auto;
  ${orBelow(
    BreakPoint.LG,
    css`
      padding: 0;
    `,
  )};
`;

const notiListCSS = css`
  margin-bottom: 70px;
  ${orBelow(
    BreakPoint.LG,
    css`
      margin-bottom: 0;
    `,
  )};
`;

const notiListItemCSS = css`
  border-bottom: 1px solid #e5e5e5;
  margin: 0px;
  padding: 14px 0px;
  &:last-child {
    border-bottom: none;
  }
  :hover {
    background: #f7fafc;
  }

  ${orBelow(
    BreakPoint.LG,
    css`
      margin: 0px 24px;
    `,
  )};
  ${orBelow(
    BreakPoint.M,
    css`
      margin: 0px 16px;
    `,
  )};
`;

const wrapperCSS = (theme: RIDITheme) => css`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  :link,
  :visited {
    color: black;
  }
  :hover {
    color: ${theme.primaryColor};
    background: #f7fafc;
  }
  transition: color 0.1s;
`;

const imageWrapperCSS = css`
  text-align: center;
  flex-shrink: 0;
  position: relative;

  ${orBelow(BreakPoint.LG, css``)};
`;

const notificationTitleCSS = css`
  font-weight: normal;
  font-size: 15px;
  color: #303538;
  word-break: keep-all;
  margin-bottom: 4px;
  letter-spacing: -0.5px;
`;

const notificationTimeCSS = css`
  font-weight: normal;
  font-size: 14px;
  color: #808991;
  letter-spacing: -0.46px;
`;

const arrow = css`
  height: 13px;
  width: 7px;
`;

const NoEmptyNotification = styled.p`
  text-align: center;
  margin-top: 303px;
  margin-bottom: 359px;
  ${orBelow(
    BreakPoint.M,
    css`
      margin-top: 144px;
      margin-bottom: 200px;
    `,
  )};
`;

const notificationIcon = css`
  width: 65px;
  height: 71px;
  fill: #e6e8eb;
`;

const NoEmptyNotificationText = styled.span`
  display: block;
  margin-top: 20px;
  font-size: 14px;
  color: #808991;
  letter-spacing: -0.46;
  font-weight: normal;
`;

interface NotificationItemScheme {
  landingUrl: string;
  expireAt: number;
  imageUrl: string;
  imageType: string;
  createdAt: number;
  userIdx: number;
  message: string;
  id: string;
  tag: string;
  itemId: string;
  strCreatedAt: string;
}

interface NotificationItemProps {
  item: NotificationItemScheme;
  createdAtTimeAgo: string;
  dot?: boolean;
}

const NotificationItem: React.FunctionComponent<NotificationItemProps> = props => {
  const { item, createdAtTimeAgo, dot = false } = props;
  return (
    <li css={notiListItemCSS}>
      <a css={wrapperCSS} href={item.landingUrl}>
        <div css={imageWrapperCSS}>
          <img
            alt={item.message}
            css={css`
              box-shadow: 0 0 3px 0.5px rgba(0, 0, 0, 0.3);
            `}
            width={'56px'}
            src={item.imageUrl}
          />
          {dot && (
            <div
              css={css`
                position: absolute;
                width: 4px;
                height: 4px;
                left: -9px;
                top: ${item.imageType === 'book' ? '36px' : '24px'};
                background: #1f8ce6;
                border-radius: 999px;
              `}
            />
          )}
        </div>
        <div
          css={css`
            ${flexColumnStart};
            margin-left: 16px;
          `}>
          <h3
            css={notificationTitleCSS}
            dangerouslySetInnerHTML={{ __html: item.message }}
          />
          <span css={notificationTimeCSS}>{createdAtTimeAgo}</span>
        </div>
        <div
          css={css`
            padding: 0 15px;
            margin-left: auto;
          `}>
          <ArrowLeft css={arrow} />
        </div>
      </a>
    </li>
  );
};

const NotificationPage: React.FC = () => {
  const { items, isFetching, unreadCount } = useSelector(
    (store: RootState) => store.notifications,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFetching) {
      dispatch(notificationActions.loadNotifications({ limit: 100 }));
    }

    return () => dispatch(notificationActions.setFetching(false));
  }, [dispatch]);

  if (!isFetching) {
    return (
      <>
        <Head>
          <title>리디북스 - 알림</title>
        </Head>
        <section css={sectionCSS}>
          <PageTitle title={'알림'} mobileHidden={false} />
          <NotificationPlaceholder num={5}></NotificationPlaceholder>
        </section>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>리디북스 - 알림</title>
      </Head>
      <section css={sectionCSS}>
        <PageTitle title={'알림'} mobileHidden={false} />
        <ul css={notiListCSS}>
          {items.length === 0 ? (
            <NoEmptyNotification>
              <NotificationIcon css={notificationIcon} />
              <NoEmptyNotificationText>새로운 알림이 없습니다.</NoEmptyNotificationText>
            </NoEmptyNotification>
          ) : (
            items.map((item, index) => (
              <NotificationItem
                key={index}
                createdAtTimeAgo={timeAgo(item.createdAt)}
                item={item}
                dot={index < unreadCount}
              />
            ))
          )}
        </ul>
      </section>
    </>
  );
};

export default NotificationPage;
