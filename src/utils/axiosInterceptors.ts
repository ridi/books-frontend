import axios, { AxiosError } from 'axios';
import { OAuthRequestType } from 'src/utils/axios';

export const redirectOAuthLoginPage = () => {
  const loginURL = new URL('/ridi/authorize/', publicRuntimeConfig.ACCOUNT_API);
  loginURL.searchParams.append('client_id', publicRuntimeConfig.RIDI_OAUTH2_CLIENT_ID);
  loginURL.searchParams.append('response_type', 'code');
  loginURL.searchParams.append('redirect_uri', location.href);

  location.href = loginURL.toString();
};

export const authorizeTokenFallback = async (rejectedError: AxiosError) => {
  await axios.get('/ridi/authorize/', {
    withCredentials: true,
    baseURL: publicRuntimeConfig.ACCOUNT_API,
    custom: rejectedError.config.custom,
    params: {
      client_id: publicRuntimeConfig.RIDI_OAUTH2_CLIENT_ID,
      response_type: 'code',
      redirect_uri: new URL('/ridi/complete', publicRuntimeConfig.ACCOUNT_API).toString(),
    },
  });

  // 원본 요청
  return axios(rejectedError.config);
};

export const refreshTokenFallback = async (rejectedError: AxiosError) => {
  try {
    await axios.post('/ridi/token', null, {
      baseURL: publicRuntimeConfig.ACCOUNT_API,
      withCredentials: true,
      custom: rejectedError.config.custom,
    });
  } catch (error) {
    const { response } = error;
    const { custom } = rejectedError.config;
    if (!response) {
      return Promise.reject(error);
    }
    if (!custom) {
      return Promise.reject(rejectedError);
    }
    if (custom.authorizationRequestType === OAuthRequestType.STRICT) {
      redirectOAuthLoginPage();
    }
    if (custom.authorizationRequestType === OAuthRequestType.CHECK) {
      // Access-Token 확인
      return authorizeTokenFallback(rejectedError);
    }
  }

  // 원본 요청
  return axios(rejectedError.config);
};

export const tokenInterceptor = (onRejected: AxiosError) => {
  const { response, config } = onRejected;
  if (!response) {
    return Promise.reject(onRejected);
  }
  if (!config.custom) {
    return Promise.reject(onRejected);
  }

  const { authorizationRequestType } = config.custom;
  if (authorizationRequestType === OAuthRequestType.NORMAL) {
    return Promise.reject(onRejected);
  }

  const tokenUrl = new URL('/ridi/token/', publicRuntimeConfig.ACCOUNT_API).toString();
  if (
    (response.status === 401 || response.status === 403) &&
    response.config.url !== tokenUrl
  ) {
    return refreshTokenFallback(onRejected);
  }

  return Promise.reject(onRejected);
};
