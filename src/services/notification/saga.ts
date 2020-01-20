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
  requestNotificationAuth,
} from 'src/services/notification/request';
import jwt_decode from 'jwt-decode';
import * as Cookies from 'js-cookie';
import originalAxios, { CancelTokenSource } from 'axios';

const RIDI_NOTIFICATION_TOKEN = 'ridi_notification_token';
const { captureException } = sentry();

function* fetchNotification(limit: number, token: any, cancelToken: CancelTokenSource) {
  const data = yield call(pRetry, () => requestNotification(limit, token, cancelToken), {
    retries: 2,
  });
  yield put({ type: notificationActions.setNotifications.type, payload: data });
  return data;
}

function* fetchNotificationAuth(cancelToken: CancelTokenSource) {
  const data = yield call(pRetry, () => requestNotificationAuth(cancelToken), {
    retries: 2,
  });
  Cookies.set(RIDI_NOTIFICATION_TOKEN, data.token);
  return data.token;
}

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
        const token = fetchNotificationAuth(tokenRequestSource);
        tokenResult = token;
      }

      if (tokenResult) {
        const data = fetchNotification(limit, tokenResult, notificationRequestSource);
        yield put({ type: notificationActions.setUnreadCount.type, payload: 0 });
      }
    }
  } catch (error) {
    yield put({ type: notificationActions.setUnreadCount.type, payload: 0 });
    captureException(error);
  }
}

export function* notificationRootSaga() {
  yield all([
    takeEvery(notificationActions.loadNotifications.type, watchNotificationRequest),
  ]);
}
