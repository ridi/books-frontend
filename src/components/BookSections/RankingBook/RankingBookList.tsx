import React, { useEffect, useState } from 'react';
import BookMeta from 'src/components/BookMeta';
import ScrollContainer from 'src/components/ScrollContainer';
import { CLOCK_ICON_URL } from 'src/constants/icons';
import { BookItem, Section, StarRating } from 'src/types/sections';

import { createTimeLabel } from 'src/utils/dateTime';
import * as tracker from 'src/utils/event-tracker';

import { SectionTitle, SectionTitleLink } from '../SectionTitle';
import * as Styled from './styles';

interface RankingBookListProps {
  slug: string;
  items: BookItem[];
  type: 'small' | 'big';
  title?: string;
  showTimer: boolean;
  genre: string;
  extra?: Section['extra'];
  showSomeDeal?: boolean;
}

function Timer() {
  const [label, setLabel] = useState(createTimeLabel);
  useEffect(() => {
    const timer = window.setInterval(() => {
      setLabel(createTimeLabel());
    }, 10000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);
  return (
    <Styled.TimerWrapper>
      <img src={CLOCK_ICON_URL} height={12} width={12} alt="시계 아이콘" />
      <span>{label}</span>
    </Styled.TimerWrapper>
  );
}

interface ItemListProps {
  books: BookItem[];
  slug: string;
  genre: string;
  type: 'small' | 'big';
  showSomeDeal?: boolean;
}

function RankingBook({
  bId,
  order: index,
  slug,
  genre,
  type,
  showSomeDeal,
  rating,
}: Omit<ItemListProps, 'books'> & {bId: string; order: number; rating?: StarRating}) {
  const handleBannerClick = React.useCallback(() => {
    tracker.sendClickEvent({ id: bId }, slug, index);
  }, [bId, slug, index]);

  return (
    // auto-flow 안 되는 IE11을 위한 땜빵
    <Styled.RankingBookItem
      type={type}
      key={index}
      style={{
        msGridColumn: Math.floor(index / 3) * 2 + 1,
        msGridRow: (index % 3) + 1,
      }}
      onClick={handleBannerClick}
    >
      <Styled.ThumbnailAnchor
        type={type}
        href={`/books/${bId}`}
      >
        <Styled.StyledThumbnailWithBadge
          bId={bId}
          order={index}
          genre={genre}
          slug={slug}
          sizes={type === 'big' ? '80px' : '50px'}
          type={type}
          onlyAdultBadge={type !== 'big'}
        />
      </Styled.ThumbnailAnchor>
      <Styled.BookMetaBox>
        <Styled.RankPosition aria-label={`랭킹 순위 ${index + 1}위`}>{index + 1}</Styled.RankPosition>
        <BookMeta
          bId={bId}
          titleLineClamp={type === 'small' ? 1 : 2}
          isAIRecommendation={false}
          showSomeDeal={showSomeDeal}
          showTag={false}
          width={type === 'big' ? '177px' : undefined}
          ratingInfo={type === 'big' ? rating : undefined}
        />
      </Styled.BookMetaBox>
    </Styled.RankingBookItem>
  );
}

const ItemList: React.FunctionComponent<ItemListProps> = (props) => {
  const {
    books, slug, type, genre, showSomeDeal,
  } = props;
  return (
    <ScrollContainer>
      <Styled.List type={type}>
        {books
          .slice(0, 9)
          .map((book, index) => (
            <RankingBook
              key={book.b_id}
              bId={book.b_id}
              slug={slug}
              type={type}
              order={index}
              showSomeDeal={showSomeDeal}
              genre={genre}
              rating={book.rating}
            />
          ))}
      </Styled.List>
    </ScrollContainer>
  );
};

const RankingBookList: React.FunctionComponent<RankingBookListProps> = (props) => {
  const {
    genre, type, showTimer, extra, title, showSomeDeal, slug, items: books,
  } = props;

  return (
    <Styled.SectionWrapper>
      {title && (
        <SectionTitle>
          {showTimer && <Timer />}
          <SectionTitleLink
            title={title}
            href={extra?.detail_link}
          />
        </SectionTitle>
      )}
      <ItemList
        books={books}
        slug={slug}
        genre={genre}
        type={type}
        showSomeDeal={showSomeDeal}
      />
    </Styled.SectionWrapper>
  );
};

export default RankingBookList;
