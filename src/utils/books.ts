import { decodeHTML } from 'entities';

import * as BookApi from 'src/types/book';

function decodeDescField(options: { value?: string; prefix?: string }): string {
  const { value = '', prefix } = options;
  const stripped = value
    .replace(/\r?\n/g, ' ')
    .replace(/(<([^>]+)>)/gi, '');
  const decoded = decodeHTML(stripped);
  if (prefix != null && decoded !== '') {
    return `<${prefix}> ${decoded}`;
  }
  return decoded;
}

export function constructSearchDesc(description: BookApi.BookDesc): string {
  const intro = decodeDescField({ value: description.intro });
  const publisherReview = decodeDescField({
    value: description.publisher_review,
    prefix: '출판사 서평',
  });
  const author = decodeDescField({
    value: description.author,
    prefix: '저자 소개',
  });
  const toc = decodeDescField({
    value: description.toc,
    prefix: '목차',
  });
  return [intro, publisherReview, author, toc]
    .filter((value) => value !== '')
    .join(' ');
}

/* 미완결 된 Series 도서중 공개(opened) 된 마지막 회차의 표지 ID를 구함 */
export function getThumbnailIdFromBookDetail(book: BookApi.Book | null) {
  if (!book) {
    return null;
  }
  // book.series.property.is_serial 이 아니라 장르를 체크해서 마지막 볼륨 bId 를 넘긴다.
  const categoryName = book.categories[0].genre ?? 'general';
  if (book.series) {
    if (
      categoryName !== 'general' && !book.series.property.is_completed && book.series.property.opened_last_volume_id.length !== 0
    ) {
      return book.series.property.opened_last_volume_id;
    }
  }
  return book.id;
}
