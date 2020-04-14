import { captureException, withScope, init } from '@sentry/node';

const sentryOptions = {
  dsn: process.env.SENTRY_DSN,
  release: process.env.BUILD_ID,
  maxBreadcrumbs: 30,
  environment: process.env.STAGE,
  attachStacktrace: true,
  ignoreErrors: [
    'ERR_BLOCKED_BY_CLIENT',
    'fb_xd_fragment',
    'Failed to fetch',
    'NetworkError when attempting to fetch resource',
    '__naverapp__',
    '__gCrWeb.autofill.extractForms',
    'There is no clipping info for given tab', // Evernote extension error
    "Unexpected token 'else'",
    'Let/Const 다시 선언',
    'ReferenceError: Let/Const 다시 선언',
    'TypeError: 특정 호스트 이름을 가진\n' + '서버를 찾을 수 없습니다.',
    '특정 호스트 이름을 가진\n' + '서버를 찾을 수 없습니다.\n',
    'Unexpected identifier',
    'Unexpected end of input',
    'TypeError: WebKit에 내부 오류 발생',
    'Software caused connection abort',
    '소프트웨어에 의한 연결 중단',
    'No identifiers allowed directly after numeric literal',
    '특정 호스트 이름을 가진 서버를 찾을 수 없습니다',
    'TypeError: cancelled',
    'TypeError: 취소됨',
    'The Internet connection appears to be offline.',
    '서버에 안전하게 연결할 수 없습니다',
    'SSL',
    'A server with the specified hostname could not be found.',
    'The network connection was lost.',
    'kCFErrorDomainCFNetwork',
    '网络连接已中断。',
    '错误的 URL',
    '已取消',
    '未能找到使用指定主机名的服务器。',
    '指定されたホスト名のサーバが見つかりませんでした。',
    '未能完成该操作。软件导致连接中止',
    'Type error',
    'キャンセルしました',
    'supported-color-schemes',
    '请求超时。',
    'Abgebrochen',
    'Non-error was thrown: "Cancel". You should only throw errors.',
    'TypeError: Non-error was thrown: "Cancel". You should only throw errors.',
    'cancelado',
    'AdBlock',
    'mttLongPressVar',
    'Blocked a frame with origin',
    "has no method 'checkDomStatus'",
    '이 서버에 대한 인증서가 유효하지 않습니다',
  ],
  sampleRate: 0.1,
  whitelistUrls: [
    /https?:\/\/(.+\.)?ridibooks\.com/,
    /https?:\/\/(.+\.)?ridi\.io/,
    /https?:\/\/s3.ap-northeast-2.amazonaws.com\/beacon-ridibooks(-test)*/,
  ],
};

// 서버이거나, 클라이언트에서 partials가 아닌 경우 초기화
if (process.env.IS_SERVER || !window.isPartials) {
  init(sentryOptions);
}

const Sentry = {
  captureException(error, ctx = null) {
    let eventId;
    withScope((scope) => {
      // isAxiosError
      if (error.config) {
        if (error.response) {
          scope.setExtra('Axios Response Url', error.config.url);
          scope.setTag('AXIOS_RESPONSE_CODE', error.response.status);
          scope.setTag('API_URL', error.config.url);
          scope.setFingerprint([error.config.url, error.response.status, error.message]);
        }
      }
      if (ctx) {
        const {
          isServer, req, res, err, asPath, query,
        } = ctx;
        scope.setTag('isServer', isServer);
        scope.setTag('path', asPath);
        scope.setExtra('NEXT_JS_ERROR', String(err));
        scope.setExtra('query', query);

        if (req && res) {
          scope.setExtra('NEXT_JS_RES_STATUS_CODE', res.statusCode);
        }
      }
      eventId = captureException(error);
    });
    return eventId;
  },
};
export default Sentry;
