import * as BookApi from 'src/types/book';

export const safeJSONParse = (source: string | null, defaultValue: any) => {
  if (!source) {
    return defaultValue;
  }
  try {
    return JSON.parse(source);
  } catch (err) {
    return defaultValue;
  }
};

export const isJSON = (source: string) => {
  try {
    JSON.parse(source);
    return true;
  } catch (err) {
    return false;
  }
};

export const timeAgo = (timestamp: number) => {
  let diff = Date.now() - timestamp;

  // 분단위로 변환
  diff = Math.floor(diff / (60 * 1000));

  if (diff < 1) {
    return '방금 전';
  }

  if (diff < 60) {
    return `${diff}분 전`;
  }

  // 시간단위로 변환
  diff = Math.floor(diff / 60);
  if (diff < 24) {
    return `${diff}시간 전`;
  }

  // 일 단위로 변환
  diff = Math.floor(diff / 24);
  if (diff < 30) {
    return `${diff}일 전`;
  }

  // 월 단위로 변환
  diff = Math.floor(diff / 30);

  return `${diff}개월 전`;
};

export const keyToArray = (target: any[] | Record<string, any>, key: string): any[] => {
  if (!target || !key) {
    return [];
  }

  const arr = [];
  if (Array.isArray(target)) {
    target.forEach((item) => arr.push(...keyToArray(item, key)));
  } else if (typeof target === 'object' && target) {
    Object.keys(target).forEach((innerKey) => {
      if (innerKey === key) {
        arr.push(target[key]);
      } else {
        arr.push(...keyToArray(target[innerKey], key));
      }
    });
  }
  return arr;
};

export const splitArrayToChunk = (array: any[], size: number) => {
  const chunked_arr = [];
  let index = 0;
  while (index < array.length) {
    chunked_arr.push(array.slice(index, size + index));
    index += size;
  }
  return chunked_arr;
};

export const getMaxDiscountPercentage = (book?: BookApi.Book) => {
  if (!book) {
    return 0;
  }
  const singleBuyDiscountPercentage = book.price_info?.buy?.discount_percentage || 0;
  const singleRentDiscountPercentage = book.price_info?.rent?.discount_percentage || 0;
  const seriesBuyDiscountPercentage = book.series?.price_info?.buy?.discount_percentage || 0;
  const seriesRentDiscountPercentage = book.series?.price_info?.rent?.discount_percentage || 0;

  const excludeMax = [
    singleBuyDiscountPercentage,
    seriesBuyDiscountPercentage,
    singleRentDiscountPercentage,
    seriesRentDiscountPercentage,
  ].filter((dp) => dp < 100);

  const maxValue = Math.round(Math.max(...excludeMax));
  if (maxValue >= 10) {
    return maxValue;
  }
  return 0;
};
