import axios, { OAuthRequestType } from 'src/utils/axios';
import { CancelTokenSource } from 'axios';
import { Notification } from 'src/types/notification';

export interface NotificationAuthResponse {
  token: string;
  expired: number;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

export const requestNotificationAuth = async (cancelToken: CancelTokenSource) => {
  const tokenUrl = new URL(
    '/users/me/notification-token/',
    publicRuntimeConfig.STORE_API,
  );

  const { data } = await axios.get<NotificationAuthResponse>(tokenUrl.toString(), {
    withCredentials: true,
    cancelToken: cancelToken.token,
  });

  return data;
};

export const requestNotification = async (
  limit: number,
  token: string,
  cancelToken: CancelTokenSource,
) => {
  const notificationUrl = new URL('/notification', publicRuntimeConfig.STORE_API);

  const { data } = await axios.get<NotificationResponse>(notificationUrl.toString(), {
    params: { limit },
    cancelToken: cancelToken.token,
    custom: { authorizationRequestType: OAuthRequestType.CHECK },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
