import { createStore, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import createSagaMiddleware, { Task } from 'redux-saga';
import { rootReducers } from 'src/store/reducers';
import { AppState } from 'src/services/app/reducer';
import { ServerResponse } from 'http';

import rootSaga from 'src/store/sagas';

import { Router } from 'server/routes';
import { initialState } from 'src/store/initialState';
import {
  createRouterMiddleware,
  initialRouterState,
  RouteState,
} from 'connected-next-router';
import { AccountState } from 'src/services/accounts/reducer';
import { BooksState } from 'src/services/books/reducer';
import { CategoryState } from 'src/services/category/reducer';
import { NotificationState } from 'src/services/notification/reducer';

export interface RootState {
  app?: AppState;
  router?: RouteState;
  account: AccountState;
  books: BooksState;
  categories: CategoryState;
  notifications: NotificationState;
}

interface MakeStoreOption {
  asPath?: string;
  storeKey?: string;
  debug?: boolean;
  // tslint:disable-next-line
  serializeState?: any;
  // tslint:disable-next-line
  deserializeState?: any;
  req?: Request;
  res?: ServerResponse;
  isServer: boolean;
}

const routerMiddleware = createRouterMiddleware({
  Router,
  method: {
    push: 'pushRoute',
    replace: 'replaceRoute',
    prefetch: 'prefetchRoute',
  },
});

const makeStore = (
  preLoadedState: RootState = initialState,
  makeStoreOption?: MakeStoreOption,
) => {
  if (makeStoreOption && makeStoreOption.asPath) {
    preLoadedState.router = initialRouterState(makeStoreOption.asPath);
  }
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    rootReducers,
    preLoadedState,
    publicRuntimeConfig.STORE_HOST === 'https://ridibooks.com'
      ? applyMiddleware(routerMiddleware, sagaMiddleware)
      : composeWithDevTools(applyMiddleware(routerMiddleware, sagaMiddleware)),
  );

  (store as Store & { sagaTask: Task }).sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

export default makeStore;
