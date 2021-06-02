import React, { useCallback } from 'react';

import BookMeta from 'src/components/BookMeta';
import * as tracker from 'src/utils/event-tracker';
import { DisplayType, BookItem } from 'src/types/sections';
import PortraitBook from 'src/components/Book/PortraitBook';

interface Props {
  type: DisplayType;
  order?: number;
  slug: string;
  genre: string;
  className?: string;
  book: BookItem;
}

const SelectionBookItem: React.FunctionComponent<Props> = (props) => {
  const {
    book,
    genre,
    slug,
    order,
    className,
    type,
  } = props;
  const { b_id: bId } = book;
  const ratingInfo = type === 'HomeMdSelection'
    ? book.rating
    : undefined;

  const handleClick = useCallback(() => {
    tracker.sendClickEvent(book, slug, order);
  }, [book, slug, order]);
  const href = tracker.getTrackingURI(`/books/${bId}`, {
    sectionId: slug,
    sectionItemIdx: order,
  });

  return (
    <PortraitBook
      bId={bId}
      index={order}
      genre={genre}
      slug={slug}
      onClick={handleClick}
      className={className}
      href={href}
    >
      <BookMeta
        bId={bId}
        ratingInfo={ratingInfo}
        href={href}
      />
    </PortraitBook>
  );
};

export default React.memo(SelectionBookItem);
