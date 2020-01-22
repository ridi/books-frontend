import { takeEvery, all, call, put } from 'redux-saga/effects';
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
} from 'src/services/notification/request';
import jwt_decode from 'jwt-decode';
import * as Cookies from 'js-cookie';
import originalAxios from 'axios';

const RIDI_NOTIFICATION_TOKEN = 'ridi_notification_token';
const { captureException } = sentry();

function* watchNotificationRequest(action: Actions<typeof NotificationReducer>) {
  try {
    if (action.type === notificationActions.loadNotifications.type) {
      const { limit } = action.payload;

      const tokenRequestSource = originalAxios.CancelToken.source();
      const notificationRequestSource = originalAxios.CancelToken.source();

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
          () => requestNotificationAuth(tokenRequestSource),
          {
            retries: 2,
          },
        );
        Cookies.set(RIDI_NOTIFICATION_TOKEN, data.token);
        tokenResult = data.token;
      }

      if (tokenResult) {
        const data: NotificationResponse = yield call(
          pRetry,
          () => requestNotification(limit, tokenResult, notificationRequestSource),
          {
            retries: 2,
          },
        );

        yield put({
          type: notificationActions.setNotifications.type,
          payload: data.notifications,
        });
        yield put({
          type: notificationActions.setUnreadCount.type,
          payload: data.unreadCount,
        });
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      Cookies.remove(RIDI_NOTIFICATION_TOKEN);
    }

    yield put({ type: notificationActions.setFetching.type, payload: false });
    captureException(error);
  }
}

export function* notificationRootSaga() {
  yield all([
    takeEvery(notificationActions.loadNotifications.type, watchNotificationRequest),
  ]);
}
