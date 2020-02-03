import { takeLeading, all, call, put } from 'redux-saga/effects';
import pRetry from 'p-retry';
import { Actions } from 'immer-reducer';
import sentry from 'src/utils/sentry';
import {
  notificationActions,
  NotificationReducer,
} from 'src/services/notification/reducer';
import {
  requestNotification,
  NotificationResponse,
  requestNotificationAuth,
  NotificationAuthResponse,
  requestUnreadCount,
  NotificationUnreadCountResponse,
  requestNotificationRead,
} from 'src/services/notification/request';
import jwt_decode from 'jwt-decode';
import * as Cookies from 'js-cookie';

const RIDI_NOTIFICATION_TOKEN = 'ridi_notification_token';
const { captureException } = sentry();

function* notificationAuth() {
  let tokenResult = null;
  let expired = null;

  // 기존 Cookies의 Token 만료 확인
  const savedTokenValue = Cookies.get(RIDI_NOTIFICATION_TOKEN) || '';
  if (savedTokenValue.length > 0) {
    try {
      expired = jwt_decode(savedTokenValue).exp;
    } catch (error) {
      expired = null;
    }
  }
  const expiredTime = expired ? parseInt(expired, 10) : null;
  const isExpired = !expiredTime || expiredTime * 1000 < Date.now();
  tokenResult = savedTokenValue;

  if (isExpired) {
    const data: NotificationAuthResponse = yield call(
      pRetry,
      () => requestNotificationAuth(),
      {
        retries: 2,
      },
    );
    Cookies.set(RIDI_NOTIFICATION_TOKEN, data.token, { SameSite: 'Lax' });
    tokenResult = data.token;
  }
  return tokenResult;
}

function* watchNotificationUnreadCountRequest(
  action: Actions<typeof NotificationReducer>,
) {
  try {
    if (action.type === notificationActions.loadNotificationUnreadCount.type) {
      const token = yield call(notificationAuth);
      const data: NotificationUnreadCountResponse = yield call(
        pRetry,
        () => requestUnreadCount(token),
        {
          retries: 2,
        },
      );
      yield put({
        type: notificationActions.setUnreadCount.type,
        payload: data.count,
      });
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      Cookies.remove(RIDI_NOTIFICATION_TOKEN);
    }
    captureException(error);
  }
}

function* watchNotificationRequest(action: Actions<typeof NotificationReducer>) {
  try {
    if (action.type === notificationActions.loadNotifications.type) {
      const { limit } = action.payload;
      const token = yield call(notificationAuth);
      const data: NotificationResponse = yield call(
        pRetry,
        () => requestNotification(limit, token),
        {
          retries: 2,
        },
      );
      // Notification 호출 후 알림 읽음 처리 해주기
      yield call(requestNotificationRead, token);
      yield put({
        type: notificationActions.setNotifications.type,
        payload: data,
      });
    }
  } catch (error) {
    yield put({ type: notificationActions.setFetching.type, payload: false });
    captureException(error);
  }
}

export function* notificationRootSaga() {
  yield all([
    takeLeading(notificationActions.loadNotifications.type, watchNotificationRequest),
    takeLeading(
      notificationActions.loadNotificationUnreadCount.type,
      watchNotificationUnreadCountRequest,
    ),
  ]);
}
