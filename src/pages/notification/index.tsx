import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';
import { NextComponentType } from 'next';
import PageTitle from 'src/components/PageTitle/PageTitle';
import { css } from '@emotion/core';
import { flexColumnStart, RIDITheme } from 'src/styles';
import { timeAgo } from 'src/utils/common';
import ArrowLeft from 'src/svgs/ChevronRight.svg';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

import * as Cookies from 'js-cookie';
import pRetry from 'p-retry';
import axios, { OAuthRequestType } from 'src/utils/axios';
import sentry from 'src/utils/sentry';

const { captureException } = sentry();
const RIDI_NOTIFICATION_TOKEN = 'ridi_notification_token';

const sectionCSS = css`
  padding: 31px 50px 0 50px;
  max-width: 1000px;
  margin: 0 auto;
  ${orBelow(
    BreakPoint.LG,
    css`
      padding: 0;
    `,
  )};
`;

const mockList = [
  {
    id: 1,
    imageUrl: 'https://img.ridicdn.net/cover/1242000373/large',
    title:
      '<strong>[10%▼]</strong> 올여름 휴가 때는 완독 챌린지! <strong>&lt;죽음&gt;, &lt;핑거스미스&gt; 등 소설/인문 26종 할인!</strong> 할인할 때 쟁여놓고, 이번 휴가 때 완독 가즈아!',
    createdAt: 1562906721836,
    url:
      '/notification/new-release/verify/852000573?utm_source=Ridibooks_DAR&utm_medium=noti&utm_content=not_set&utm_campaign=DAR_new_book&utm_term=general',
  },
  {
    id: 2,
    imageUrl: 'https://img.ridicdn.net/cover/852000573/',
    title:
      '신간알림 | <strong>에드워드 W. 사이드의 신간 &lt;경계의 음악&gt;</strong>이 출간되었습니다.',
    createdAt: 1562906701836,
    url:
      '/notification/new-release/verify/852000573?utm_source=Ridibooks_DAR&utm_medium=noti&utm_content=not_set&utm_campaign=DAR_new_book&utm_term=general',
  },
  {
    id: 3,
    imageUrl: 'https://img.ridicdn.net/cover/2200027720/large',
    title:
      '<strong>[전원 500P!] 네 마음 속 공에 #빙의해 &lt;모노크롬 루머&gt;</strong> 상황에 맞는 공들의 반응 댓글로 남기면 전원 포인트!',
    createdAt: 1562906621836,
    url:
      '/notification/new-release/verify/852000573?utm_source=Ridibooks_DAR&utm_medium=noti&utm_content=not_set&utm_campaign=DAR_new_book&utm_term=general',
  },
];

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
  padding: 14px 0;
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
  }
  transition: color 0.1s;
`;

const imageWrapperCSS = css`
  width: 100px;
  text-align: center;
  flex-shrink: 0;

  ${orBelow(
    BreakPoint.LG,
    css`
      width: 90px;
    `,
  )};
`;

const notificationTitleCSS = css`
  font-weight: normal;
  font-size: 15px;
  word-break: keep-all;
  margin-bottom: 5px;
`;

const arrow = css`
  height: 13px;
  width: 7px;
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
}

const NotificationItem: React.FunctionComponent<NotificationItemProps> = props => {
  const { item, createdAtTimeAgo } = props;
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
        </div>
        <div
          css={css`
            ${flexColumnStart};
          `}>
          <h3
            css={notificationTitleCSS}
            dangerouslySetInnerHTML={{ __html: item.message }}
          />
          <span>{createdAtTimeAgo}</span>
        </div>
        <div
          css={css`
            padding: 0 15px;
            margin-left: auto;
            ${orBelow(
              BreakPoint.LG + 1,
              css`
                display: none;
              `,
            )};
          `}>
          <ArrowLeft css={arrow} />
        </div>
      </a>
    </li>
  );
};

const fetchNotifications = async () => {
  const token = Cookies.get(RIDI_NOTIFICATION_TOKEN) || '';
  if (token.length > 0) {
    console.log(token);
    try {
      const notificationUrl = new URL('/notification', publicRuntimeConfig.STORE_API);
      const notificationResult = await pRetry(
        () =>
          axios.get(notificationUrl.toString(), {
            custom: { authorizationRequestType: OAuthRequestType.CHECK },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        { retries: 2 },
      );
      return notificationResult;
    } catch (error) {
      captureException(error);
      return [];
    }
  } else {
    // Token 갱신 필요
    return [];
  }
};

interface NotificationPageProps {
  q?: string;
  notifications: NotificationItemScheme[];
}

const NotificationPage: React.FC<NotificationPageProps> & NextComponentType = props => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const requestNotification = async () => {
      const fetchData: any = await fetchNotifications();
      setNotifications(fetchData?.data.notifications);
    };

    requestNotification();
  }, []);

  return (
    <>
      <Head>
        <title>리디북스 - 알림</title>
      </Head>
      <section css={sectionCSS}>
        <PageTitle title={'알림'} mobileHidden={true} />
        <ul css={notiListCSS}>
          {notifications.map((item, index) => (
            <NotificationItem
              key={index}
              createdAtTimeAgo={timeAgo(item.createdAt)}
              item={item}
            />
          ))}
        </ul>
      </section>
    </>
  );
};

// Todo Initial Fetch
// NotificationPage.getInitialProps = async (props: ConnectedInitializeProps) => ({
//   q: props.query.q,
//   notifications: mockList,
// });

export default NotificationPage;
