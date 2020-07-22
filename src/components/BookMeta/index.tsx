import React from 'react';
import styled from '@emotion/styled';

import StarRating from 'src/components/StarRating/StarRating';
import * as Tags from 'src/components/Tag/Tag';
import { StarRating as StarRatingType } from 'src/types/sections';

import { useBookSelector } from 'src/hooks/useBookDetailSelector';
import BookMetaBase from './BookMeta';

const TagWrapper = styled.div`
  display: flex;
  margin-top: 6px;
`;

interface BookMetaProps {
  bId: string;
  titleLineClamp?: number;
  showSomeDeal?: boolean;
  isAIRecommendation?: boolean;
  showTag?: boolean;
  width?: string;
  className?: string;
  ratingInfo?: StarRatingType;
}

export default function BookMeta(props: BookMetaProps) {
  const {
    bId,
    showTag,
    showSomeDeal,
    ratingInfo,
    titleLineClamp,
    className,
    width,
  } = props;

  const book = useBookSelector(bId);
  if (book == null || book.isDeleted) {
    return null;
  }

  const { isSomedeal, isComic, isNovel } = book;
  return (
    <BookMetaBase
      bId={bId}
      titleLineClamp={titleLineClamp}
      width={width}
      className={className}
    >
      {ratingInfo && (
        <span>
          <StarRating
            totalReviewer={ratingInfo.buyer_rating_count}
            rating={ratingInfo.buyer_rating_score || 0}
          />
        </span>
      )}
      {(showTag || (showSomeDeal && isSomedeal)) && (
        <TagWrapper>
          {showTag && isComic && <Tags.ComicTag />}
          {showTag && isNovel && <Tags.NovelTag />}
          {showSomeDeal && isSomedeal && <Tags.SomeDealTag />}
        </TagWrapper>
      )}
    </BookMetaBase>
  );
}
