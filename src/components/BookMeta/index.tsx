import React from 'react';
import styled from '@emotion/styled';

import StarRating from 'src/components/StarRating/StarRating';
import Tag from 'src/components/Tag/Tag';
import * as BookApi from 'src/types/book';
import { StarRating as StarRatingType } from 'src/types/sections';

import BookMetaBase from './BookMeta';

const TagWrapper = styled.div`
  display: flex;
  margin-top: 6px;
`;

interface BookMetaProps {
  book: BookApi.Book;
  titleLineClamp?: number;
  showRating: boolean;
  showSomeDeal?: boolean;
  isAIRecommendation?: boolean;
  showTag: boolean;
  width?: string;
  className?: string;
  ratingInfo?: StarRatingType;
}

export default function BookMeta(props: BookMetaProps) {
  if (props.book.is_deleted) {
    return null;
  }

  const {
    book: {
      property: { is_somedeal, is_novel },
      file: { is_comic, is_comic_hd },
    },
    showTag,
    showSomeDeal,
    showRating,
    ratingInfo,
    titleLineClamp,
    className,
    width,
  } = props;
  return (
    <BookMetaBase
      book={props.book}
      titleLineClamp={titleLineClamp}
      width={width}
      className={className}
    >
      {showRating && ratingInfo && (
        <span>
          <StarRating
            totalReviewer={ratingInfo.buyer_rating_count}
            rating={ratingInfo.buyer_rating_score || 0}
          />
        </span>
      )}
      {(showTag || (showSomeDeal && is_somedeal)) && (
        <TagWrapper>
          {showTag && (is_comic_hd || is_comic) && <Tag.Comic />}
          {showTag && is_novel && <Tag.Novel />}
          {showSomeDeal && is_somedeal && <Tag.SomeDeal />}
        </TagWrapper>
      )}
    </BookMetaBase>
  );
}
