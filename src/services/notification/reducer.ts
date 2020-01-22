import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer';
import { Notification } from 'src/types/notification';

export interface NotificationState {
  items: Notification[];
  unreadCount: number;
  isFetching: boolean;
}

export const notificationInitialState: NotificationState = {
  items: [],
  unreadCount: 0,
  isFetching: false,
};

export class NotificationReducer extends ImmerReducer<NotificationState> {
  // eslint-disable-next-line
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public loadNotifications(payload: { limit: number }) {}

  public setNotifications(payload: Notification[]) {
    this.draftState.isFetching = true;
    this.draftState.items = payload;
  }

  public setUnreadCount(payload: number) {
    this.draftState.unreadCount = payload;
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
