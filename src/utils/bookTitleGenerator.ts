import * as BookApi from 'src/types/book';
import * as SearchApi from 'src/types/searchResults';

import sentry from 'src/utils/sentry';

export function computeBookTitle(book: BookApi.Book | null): string {
  if (!book) {
    return '';
  }
  if (book.is_deleted) {
    return '';
  }
  try {
    if (book.series) {
      return book.series.property.title || book.title.main;
    }
    return book.title.main;
  } catch (error) {
    sentry.captureException(error);
    return book.title.main;
  }
}

export function computeSearchBookTitle(book: SearchApi.SearchBookDetail) {
  return book.highlight.web_title_title ? book.highlight.web_title_title : book.web_title_title;
}
