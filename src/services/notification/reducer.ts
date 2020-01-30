import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer';
import { Notification } from 'src/types/notification';
import { NotificationResponse } from 'src/services/notification/request';

export interface NotificationState {
  items: Notification[];
  hasNotification: boolean;
  unreadCount: number;
  isFetching: boolean;
}

export const notificationInitialState: NotificationState = {
  items: [],
  unreadCount: 0,
  isFetching: false,
  hasNotification: false,
};

export class NotificationReducer extends ImmerReducer<NotificationState> {
  // eslint-disable-next-line
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public loadNotifications(payload: { limit: number }) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public loadNotificationUnreadCount() {}

  public setNotifications(payload: NotificationResponse) {
    this.draftState.isFetching = true;
    this.draftState.items = payload.notifications;
    this.draftState.unreadCount = payload.unreadCount;
    // GNB Tab의 알림 표시 제거
    this.draftState.hasNotification = false;
  }

  public setUnreadCount(payload: number) {
    this.draftState.unreadCount = payload;
    if (payload > 0) {
      this.draftState.hasNotification = true;
    } else {
      this.draftState.hasNotification = false;
    }
  }

  public setFetching(payload: boolean) {
    this.draftState.isFetching = payload;
  }
}

export const notificationReducer = createReducerFunction(
  NotificationReducer,
  notificationInitialState,
);
export const notificationActions = createActionCreators(NotificationReducer);
