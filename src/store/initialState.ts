import { RootState } from './config';
import { appStateInitialState } from 'src/services/app/reducer';

export const initialState: RootState = {
  app: appStateInitialState,
  account: {
    loggedUser: null,
  },
  books: {
    isFetching: false,
    items: {},
  },
  categories: {
    isFetching: false,
    items: {},
  },
  notifications: {
    hasNotification: true,
    isFetching: false,
    unreadCount: 0,
    items: [],
  },
};
