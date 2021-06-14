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

function gtagEvent(eventName: string, params: any) {
  gtag('event', eventName, params);
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

export function setUserIdx(userIdx: string | null) {
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


interface Item {
  item_id: string;
  item_name: string;
  price?: string;
  item_brand?: string;
  item_category?: string;
  item_category2?: string;
  item_category3?: string;
  item_category4?: string;
  item_variant?: string;
  item_list_name?: string;
  item_list_id?: string;
  index?: number;
  quantity?: string;
}
function parseItem(bookLike: Record<string, unknown>): Item {
  return {
    item_id: bookLike.b_id as string,
    item_name: bookLike.title as string,
  };
}

interface SendViewItemListOptions {
  item_list_id?: string;
  item_list_name?: string;
}
export function sendViewItemList(books: Record<string, unknown>[], options: SendViewItemListOptions) {
  const { item_list_id } = options || {};
  const items = (books || []).map(parseItem).map((item, index) => ({
    ...item,
    item_list_id,
    index,
  }));

  gtagEvent('view_item_list', { items });
}
