import { configureScope } from '@sentry/browser';
import libAxios, { CancelTokenSource, AxiosError } from 'axios';
import React from 'react';

import axios, { CancelToken } from 'src/utils/axios';
import { CancelledError, runWithExponentialBackoff } from 'src/utils/backoff';
import * as tracker from 'src/utils/event-tracker';
import Sentry from 'src/utils/sentry';
import { LoggedUser } from 'src/types/account';
import * as ga4Tracker from 'src/utils/event-tracker-ga4';

export const AccountContext = React.createContext<LoggedUser | null>(null);

export async function checkLoggedIn(cancel: CancelTokenSource) {
  try {
    const { data } = await axios.get<{ result: LoggedUser}>('/accounts/me', {
      baseURL: process.env.NEXT_STATIC_ACCOUNT_API,
      withCredentials: true,
      cancelToken: cancel.token,
    });
    return data.result;
  } catch (err) {
    if (libAxios.isCancel(err)) {
      throw new CancelledError();
    }
    if (err.response?.status === 401) {
      // Not logged in
      throw new CancelledError(err);
    }
    throw err;
  }
}

export function AccountProvider(props: { children?: React.ReactNode }) {
  const [account, setAccount] = React.useState<LoggedUser | null>(null);

  React.useEffect(() => {
    const cancel = CancelToken.source();
    runWithExponentialBackoff(
      () => checkLoggedIn(cancel),
      { maxTries: 3, backoffTimeUnit: 500 },
    ).then(
      (data) => {
        configureScope((scope) => {
          scope.setUser(data);
        });
        tracker.setUserId(data?.id ?? null);

        const userIdx = data?.idx;
        if (userIdx) {
          ga4Tracker.setUserIdx(userIdx.toString());
        } else {
          ga4Tracker.initWithoutUser();
        }
        setAccount(data);
      },
      (err) => {
        if (err instanceof CancelledError) {
          if ((err.inner as AxiosError)?.response?.status === 401) {
            setAccount(null);
          }
          return;
        }
        ga4Tracker.initWithoutUser();
        Sentry.captureException(err);
      },
    );
    return () => cancel.cancel();
  }, []);

  const { children } = props;
  return React.createElement(
    AccountContext.Provider,
    { value: account },
    children,
  );
}

export default function useAccount() {
  return React.useContext(AccountContext);
}
