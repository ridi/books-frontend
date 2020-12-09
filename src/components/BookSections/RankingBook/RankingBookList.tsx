import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import { createTimeLabel } from 'src/utils/dateTime';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import {
  Section, BookItem, StarRating,
} from 'src/types/sections';
import BookMeta from 'src/components/BookMeta';
import ThumbnailWithBadge from 'src/components/Book/ThumbnailWithBadge';
import ScrollContainer from 'src/components/ScrollContainer';
import { CLOCK_ICON_URL } from 'src/constants/icons';

import { SectionTitle, SectionTitleLink } from '../SectionTitle';

const SectionWrapper = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 0;
  position: relative;

  ${orBelow(999, 'padding: 16px 0;')};
`;

const BIG_ITEM_HEIGHT = 138;
const SMALL_ITEM_HEIGHT = 94;

const RankPosition = styled.h3`
  height: 22px;
  margin-right: 21px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: #000000;
`;

const TimerWrapper = styled.div`
  width: 96px;
  height: 30px;
  padding: 9px;
  padding-right: 13px;
  margin-bottom: 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background-image: linear-gradient(255deg, #0077d9 4%, #72d2e0);
  border-radius: 14px;

  font-size: 13px;
  font-weight: bold;
  color: white;

  > * {
    flex: none;
  }
`;

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
    <TimerWrapper>
      <img src={CLOCK_ICON_URL} height={12} width={12} alt="시계 아이콘" />
      <span>{label}</span>
    </TimerWrapper>
  );
}

const List = styled.ul<{ type: 'big' | 'small' }>`
  display: -ms-grid; // emotion이 쓰는 stylis.js가 grid를 지원하지 않음
  -ms-grid-rows: (${({ type }) => (type === 'big' ? BIG_ITEM_HEIGHT : SMALL_ITEM_HEIGHT)}px)[3];
  -ms-grid-columns: 308px 13px 308px 13px 308px; // gap 시뮬레이션
  display: grid;
  grid: repeat(3, ${({ type }) => (type === 'big' ? BIG_ITEM_HEIGHT : SMALL_ITEM_HEIGHT)}px) / auto-flow 308px;
  grid-column-gap: 13px;

  padding: 0 24px;
  ${orBelow(BreakPoint.LG, 'padding: 0 20px;')}
  ${orBelow(BreakPoint.MD, 'padding: 0 16px;')}
`;

const BookMetaBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px #e6e8eb solid;
`;

const RankingBookItem = styled.li<{ type: 'big' | 'small' }>`
  display: flex;
  align-items: center;
  box-sizing: content-box;

  &:nth-of-type(3n) ${BookMetaBox} {
    border-bottom: 0;
  }
`;

const ThumbnailAnchor = styled.a<{ type: 'big' | 'small' }>`
  flex: none;
  margin-right: ${(props) => (props.type === 'big' ? 18 : 24)}px;
`;

const StyledThumbnailWithBadge = styled(ThumbnailWithBadge)<{ type: 'big' | 'small' }>`
  width: ${(props) => (props.type === 'big' ? 80 : 50)}px;
  max-height: ${(props) => (props.type === 'big' ? 114 : 71)}px;
`;

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
  return (
    // auto-flow 안 되는 IE11을 위한 땜빵
    <RankingBookItem
      type={type}
      key={index}
      style={{
        msGridColumn: Math.floor(index / 3) * 2 + 1,
        msGridRow: (index % 3) + 1,
      }}
    >
      <ThumbnailAnchor type={type} href={`/books/${bId}`}>
        <StyledThumbnailWithBadge
          bId={bId}
          order={index}
          genre={genre}
          slug={slug}
          sizes={type === 'big' ? '80px' : '50px'}
          type={type}
          onlyAdultBadge={type !== 'big'}
        />
      </ThumbnailAnchor>
      <BookMetaBox>
        <RankPosition aria-label={`랭킹 순위 ${index + 1}위`}>{index + 1}</RankPosition>
        <BookMeta
          bId={bId}
          titleLineClamp={type === 'small' ? 1 : 2}
          isAIRecommendation={false}
          showSomeDeal={showSomeDeal}
          showTag={false}
          width={type === 'big' ? '177px' : undefined}
          ratingInfo={type === 'big' ? rating : undefined}
        />
      </BookMetaBox>
    </RankingBookItem>
  );
}

const ItemList: React.FunctionComponent<ItemListProps> = (props) => {
  const {
    books, slug, type, genre, showSomeDeal,
  } = props;
  return (
    <ScrollContainer>
      <List type={type}>
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
      </List>
    </ScrollContainer>
  );
};

const RankingBookList: React.FunctionComponent<RankingBookListProps> = (props) => {
  const {
    genre, type, showTimer, extra, title, showSomeDeal, slug, items: books,
  } = props;

  return (
    <SectionWrapper>
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
    </SectionWrapper>
  );
};

export default RankingBookList;
