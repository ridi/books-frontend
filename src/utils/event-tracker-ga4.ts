import { GA4_KEY } from 'src/constants/eventTracking';

/*
  기존 event-tracker를 통해 GA4를 이용하지 않고 리팩토링 기간동안 임시로 사용하기 위한 목적
*/
function gtag(...args: any[]) {
  if (window) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(args);
  }
}

function gtagConfig(...args: any[]) {
  gtag('config', GA4_KEY, ...args);
}

function loadTagManager(id: string) {
  return (function (w, d, s) {
    if (w) {
      gtag('js', new Date());
      gtagConfig();

      const f = d.getElementsByTagName(s)[0]; const
        j: any = d.createElement(s);
      j.async = true;
      j.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      f.parentNode && f.parentNode.insertBefore(j, f);
      return j;
    }
  }(window, document, 'script'));
}

let isInitialized = false;
export function initialize(debug?: boolean) {
  if (!isInitialized && loadTagManager(GA4_KEY)) {
    isInitialized = true;

    if (debug) {
      gtagConfig({ debug_mode: true });
    }
  }
}

export function setUserId(userId: string | null) {
  gtagConfig({ user_id: userId });
}
