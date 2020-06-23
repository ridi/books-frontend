import jwtDecode from 'jwt-decode';
import React from 'react';
import Cookies from 'universal-cookie';

import { Notification } from 'src/types/notification';
import axios from 'src/utils/axios';
import { runWithExponentialBackoff } from 'src/utils/backoff';
import sentry from 'src/utils/sentry';

interface NotificationContextType {
  unreadCount?: number;
  items?: Notification[];
  requestFetchUnreadCount(): Promise<void>;
  requestFetchNotifications(limit: number): Promise<void>;
}

interface NotificationAuthResponse {
  token: string;
  expired: number;
}

interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

interface NotificationUnreadCountResponse {
  success: boolean;
  count: number;
}

const RIDI_NOTIFICATION_TOKEN = 'ridi_notification_token';

const Context = React.createContext<NotificationContextType>({
  async requestFetchUnreadCount() {},
  async requestFetchNotifications() {},
});

async function requestNotificationAuth() {
  const { data } = await axios.get<NotificationAuthResponse>(
    `${process.env.NEXT_STATIC_STORE_API}/users/me/notification-token/`,
    {
      withCredentials: true,
    },
  );

  return data;
}

async function requestNotification(limit: number, token: string) {
  const { data } = await axios.get<NotificationResponse>(
    `${process.env.NEXT_STATIC_STORE_API}/notification`,
    {
      params: { limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
}

async function requestNotificationRead(token: string) {
  await axios.put(
    `${process.env.NEXT_STATIC_STORE_API}/notification`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

async function requestUnreadCount(token: string) {
  const { data } = await axios.get<NotificationUnreadCountResponse>(
    `${process.env.NEXT_STATIC_STORE_API}/notification/unread_count`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
}

export function NotificationProvider(props: { children?: React.ReactNode }) {
  const [token, setToken] = React.useState<string>();
  const [unreadCount, setUnreadCount] = React.useState<number>();
  const [items, setItems] = React.useState<Notification[]>();

  React.useEffect(() => {
    const cookies = new Cookies();
    const newToken = cookies.get(RIDI_NOTIFICATION_TOKEN) || '';
    let isExpired = true;
    if (newToken !== '') {
      try {
        const expired = jwtDecode<{ exp: string }>(newToken).exp;
        if (expired != null) {
          const expiredTime = parseInt(expired, 10) || 0;
          isExpired = expiredTime * 1000 < Date.now();
        }
      } catch (_) {
        // do nothing
      }
    }
    if (isExpired) {
      runWithExponentialBackoff(
        requestNotificationAuth,
        {
          maxTries: 3,
          backoffTimeUnit: 500,
        },
      ).then(
        (data) => {
          setToken(data.token);
        },
        (err) => {
          if (err?.response?.statusCode === 401) {
            return;
          }
          sentry.captureException(err);
        },
      );
    } else {
      setToken(newToken);
    }
  }, []);

  React.useEffect(() => {
    if (token == null) {
      return;
    }

    const cookies = new Cookies();
    cookies.set(RIDI_NOTIFICATION_TOKEN, token, { path: '/', sameSite: 'lax' });
  }, [token]);

  const requestFetchUnreadCount = React.useCallback(
    async () => {
      if (token == null) {
        return;
      }

      const data = await runWithExponentialBackoff(
        () => requestUnreadCount(token),
        {
          maxTries: 3,
          backoffTimeUnit: 500,
        },
      );
      setUnreadCount(data.count);
    },
    [token],
  );

  const requestFetchNotifications = React.useCallback(
    async (limit: number) => {
      if (token == null) {
        return;
      }

      const data = await runWithExponentialBackoff(
        () => requestNotification(limit, token),
        {
          maxTries: 3,
          backoffTimeUnit: 500,
        },
      );
      setUnreadCount(data.unreadCount);
      setItems(data.notifications);
      await requestNotificationRead(token);
      setUnreadCount(0);
    },
    [token],
  );

  return React.createElement(
    Context.Provider,
    {
      value: {
        unreadCount,
        items,
        requestFetchUnreadCount,
        requestFetchNotifications,
      },
    },
    props.children,
  );
}

export default function useNotification(): NotificationContextType {
  return React.useContext(Context);
}
