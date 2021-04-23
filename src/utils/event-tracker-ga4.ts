import { GA4_KEY } from 'src/constants/eventTracking';

/*
  기존 event-tracker를 통해 GA4를 이용하지 않고 리팩토링 기간동안 임시로 사용하기 위한 목적
*/
function gtag(...args: any[]) {
  if (window) {
    window.dataLayer = window.dataLayer || [];
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  }
}

function gtagConfig(...args: any[]) {
  gtag('config', GA4_KEY, ...args);
}

function loadTagManager(id: string) {
  return (function (w, d, s) {
    if (w) {
      gtag('js', new Date());

      const f = d.getElementsByTagName(s)[0]; const
        j: any = d.createElement(s);
      j.async = true;
      j.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      f && f.parentNode && f.parentNode.insertBefore(j, f);
      return j;
    }
  }(window, document, 'script'));
}

function cleanPrevUser(userIdx: string | null) {
  if (window && Array.isArray(window.dataLayer)) {
    window.dataLayer = window.dataLayer.filter((i: any) => {
      if (i[1] === GA4_KEY && typeof i[2] === 'object') {
        const prevUserIdx = i[2]?.user_id;
        if (prevUserIdx !== userIdx) {
          return false;
        }
      }
      return true;
    });
  }
}

export function setUserIdx(userIdx: string | null) {
  cleanPrevUser(userIdx);
  gtagConfig({ user_id: userIdx });
}

export function initWithoutUser() {
  gtagConfig();
}

let initialized = false;
export function initialize() {
  if (!initialized && loadTagManager(GA4_KEY)) {
    initialized = true;
  }
}
