import React, { useEffect, useCallback } from 'react';
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
import { Tracker } from '@ridi/event-tracker';
import {
  sendClickEvent,
  sendDisplayEvent,
  useEventTracker,
} from 'src/hooks/useEventTracker';
import { useViewportIntersection } from 'src/hooks/useViewportIntersection';
import sentry from 'src/utils/sentry';

const Section = styled.section<{}, RIDITheme>`
  background-color: ${(props) => props.theme.backgroundColor};
  max-width: 952px;
  min-height: 620px;
  margin: 0 auto;
  ${orBelow(
    BreakPoint.LG,
    css`
      padding: 0;
    `,
  )};
`;

const NotiList = styled.ul`
  margin-bottom: 24px;
`;

const NotiListItem = styled.li<{}, RIDITheme>`
  margin: 0px;
  padding: 14px 0px;
  &:last-child {
    border-bottom: none;
  }

  :hover {
    background: ${(props) => props.theme.hoverBackground};
  }

  ${orBelow(
    BreakPoint.LG,
    css`
      padding: 14px 20px;
    `,
  )};
  ${orBelow(
    BreakPoint.M,
    css`
      padding: 14px 16px;
    `,
  )};
`;

const NotiItemWrapper = styled.a<{}, RIDITheme>`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  :link,
  :visited {
    color: black;
  }
  transition: color 0.1s;

  ::after {
    content: '';
    width: 100%;
    position: absolute;
    height: 1px;
    background: ${(props) => props.theme.dividerColor};
    opacity: ${(props) => props.theme.dividerOpacity};
    bottom: -14px;
    left: 0px;
  }
`;

const BookShadowStyle = css`
  ::after {
    display: block;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right,rgba(0,0,0,.2) 0,rgba(0,0,0,0) 5%,rgba(0,0,0,0) 95%,rgba(0,0,0,.2) 100% );
    border: solid 1px rgba(0,0,0,.1);
    content: '';
  };
`;

const ImageWrapper = styled.div<{ imageType: string }>`
  text-align: center;
  flex-shrink: 0;
  position: relative;
  align-self: flex-start;
  line-height: 0;  
  ${(props) => props.imageType === 'book' && BookShadowStyle};
`;


const Dot = styled.div<{ imageType: string }>`
  position: absolute;
  width: 4px;
  height: 4px;
  left: -9px;
  top: ${(props) => (props.imageType === 'book' ? '36px' : '24px')};
  background: #1f8ce6;
  border-radius: 999px;
`;

const NotificationMeta = styled.div`
  ${flexColumnStart};
  margin-left: 16px;
  width: 100%;
`;

const NotificationTitle = styled.h3<{}, RIDITheme>`
  width: 100%;
  font-weight: normal;
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  word-break: keep-all;
  margin-bottom: 3px;
  letter-spacing: -0.3px;
  > p {
    line-height: 1.53em;
  }
`;

const NotificationTime = styled.span`
  font-weight: normal;
  font-size: 14px;
  color: #808991;
  letter-spacing: -0.3px;
`;

const ArrowWrapper = styled.div`
  padding: 0 0 0 16px;
  margin-left: auto;
`;

const arrowStyle = css`
  height: 13px;
  width: 7px;
`;

const NoEmptyNotification = styled.p`
  text-align: center;
  padding-top: 303px;
  padding-bottom: 359px;
  ${orBelow(
    BreakPoint.M,
    css`
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
  tracker: Tracker;
  slug: string;
  order: number;
}

interface NotificationPageProps {
  isTitleHidden?: boolean;
}

export const NotificationItem: React.FunctionComponent<NotificationItemProps> = (props) => {
  const {
    item, createdAtTimeAgo, dot = false, tracker, slug, order,
  } = props;

  const handleVisibleRef = React.useRef<boolean>(false);
  const handleVisible = React.useCallback((visible) => {
    if (!handleVisibleRef.current && visible) {
      sendDisplayEvent({ slug, id: item.id, order });
      handleVisibleRef.current = true;
    }
  }, [slug, item.id, order]);

  const ref = useViewportIntersection<HTMLLIElement>(handleVisible);

  return (
    <NotiListItem ref={ref}>
      <NotiItemWrapper
        // eslint-disable-next-line react/jsx-no-bind
        onClick={sendClickEvent.bind(null, tracker, item, slug, order)}
        href={item.landingUrl}
      >
        <ImageWrapper
          className={slug}
          imageType={item.imageType}
          data-id={item.id}
          data-order={order}
        >
          <img
            alt={item.message}
            width="56px"
            src={item.imageUrl}
          />
          { dot && <Dot imageType={item.imageType} /> }
        </ImageWrapper>
        <NotificationMeta>
          <NotificationTitle dangerouslySetInnerHTML={{ __html: item.message }} />
          <NotificationTime>{createdAtTimeAgo}</NotificationTime>
        </NotificationMeta>
        <ArrowWrapper>
          <ArrowLeft css={arrowStyle} />
        </ArrowWrapper>
      </NotiItemWrapper>
    </NotiListItem>
  );
};

const NotificationPage: React.FC<NotificationPageProps> = (props) => {
  const { isTitleHidden = false } = props;
  const { items, isLoaded, unreadCount } = useSelector(
    (store: RootState) => store.notifications,
  );
  const { loggedUser } = useSelector((state: RootState) => state.account);
  const slug = 'notification-item';
  const dispatch = useDispatch();
  const [tracker] = useEventTracker();

  const setPageView = useCallback(() => {
    if (tracker) {
      try {
        tracker.sendPageView(window.location.href, document.referrer);
      } catch (error) {
        sentry.captureException(error);
      }
    }
  }, [tracker]);

  useEffect(() => {
    setPageView();
  }, [loggedUser]);

  useEffect(() => {
    if (!isLoaded) {
      dispatch(notificationActions.loadNotifications({ limit: 100 }));
    }

    return () => dispatch(notificationActions.setLoaded(false));
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>리디북스 - 알림</title>
      </Head>
      <Section>
        <PageTitle title="알림" mobileHidden={isTitleHidden} />
        {isLoaded ? (
          <NotiList>
            {items.length === 0 ? (
              <NoEmptyNotification>
                <NotificationIcon css={notificationStyle} />
                <NoEmptyNotificationText>새로운 알림이 없습니다.</NoEmptyNotificationText>
              </NoEmptyNotification>
            ) : (
              items.map((item, index) => (
                <NotificationItem
                  key={index}
                  createdAtTimeAgo={timeAgo(item.createdAt)}
                  item={item}
                  dot={index < unreadCount}
                  tracker={tracker}
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
