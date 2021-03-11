import { BRAZE_API_ENDPOINT, BRAZE_API_KEY, BRAZE_SAFARI_PUSH_ID } from 'src/constants/eventTracking';

let appboyInitialized = false;
export function initialize() {
  if (typeof window !== 'undefined' && window.appboy) {
    appboyInitialized = window.appboy.initialize(BRAZE_API_KEY, {
      baseUrl: BRAZE_API_ENDPOINT,
      safariWebsitePushId: BRAZE_SAFARI_PUSH_ID,
      enableHtmlInAppMessages: true,
    });

    window.appboy.display.automaticallyShowNewInAppMessages();
  }
}

export function setUserId(userId: string) {
  if (typeof window !== 'undefined' && window.appboy) {
    window.appboy.changeUser(userId);
  }
}

export function start(userId: string | null) {
  if (typeof window !== 'undefined' && window.appboy && appboyInitialized) {
    if (userId) {
      setUserId(userId);
    }

    window.appboy.openSession();
  }
}

export function sendPageView(eventName: string) {
  if (typeof window !== 'undefined' && window.appboy && appboyInitialized) {
    window.appboy.logCustomEvent(eventName);
  }
}
