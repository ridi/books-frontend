import { Section } from 'src/types/sections';
import { EventBanner } from 'src/components/EventBanner';
import { QuickMenuList } from 'src/components/QuickMenu';
import React from 'react';
import RankingBookList from 'src/components/BookSections/RankingBook/RankingBookList';
import RecommendedBook from 'src/components/RecommendedBook';
import SelectionBook from 'src/components/BookSections/SelectionBook';
import HomeKeywordFinderSection from 'src/components/KeywordFinder/HomeKeywordFinderSection';
import { MultipleLineBooks } from 'src/components/MultipleLineBooks/MultipleLineBooks';
import UserPreferredSection from 'src/components/Section/UserPreferredSection';
import AiRecommendationSection from 'src/components/Section/AIRecommendationSection';
import TopBannerCarousel from 'src/components/TopBanner';

interface HomeSectionRendererProps {
  section: Section;
  genre: string;
  order: number;
}

function HomeSectionRenderer(props: HomeSectionRendererProps) {
  const {
    section,
    section: {
      slug,
      title,
      extra,
    },
    genre,
  } = props;

  if (!section.items) {
    // 사파리 disk cache 된 섹션 정보가 호출 될 때
    // 특정섹션에 items 필드가 자체가 존재하지 않는 경우를 방어합니다.
    // ex) AI 추천, KeywordFinder 등
    // 실제 사파리에서 디스크 캐시 된 데이터가 사용되는 이유는 더 찾아야합니다.
    return null;
  }

  // placeholder가 아닌데 아이템이 0개면 잘못된 섹션이므로 표시하지 않는다.
  if (section.items.length === 0 && extra && !extra.is_placeholder) {
    return null;
  }
  switch (section.type) {
    case 'HomeCarouselBanner':
      return <TopBannerCarousel banners={section.items} slug={slug} />;
    case 'HomeEventBanner':
      return <EventBanner items={section.items} genre={genre} slug={slug} />;
    case 'ReadingBooksRanking':
      return (
        <RankingBookList
          slug={slug}
          items={section.items}
          type="small"
          genre={genre}
          title={title}
          showSomeDeal
          showTimer
          extra={extra}
        />
      );
    case 'HotRelease': {
      return (
        <RecommendedBook
          slug={slug}
          title={title}
          items={section.items}
          type={section.type}
          genre={genre}
          theme="dark"
        />
      );
    }
    case 'TodayRecommendation': {
      return (
        <RecommendedBook
          slug={slug}
          title={title}
          items={section.items}
          type={section.type}
          genre={genre}
          theme={['bl', 'bl-novel', 'bl-comics', 'romance', 'fantasy'].includes(genre) ? 'dark' : 'white'}
        />
      );
    }
    case 'HomeMdSelection': {
      return (
        <>
          {section.items.map((item) => (
            <SelectionBook
              slug={`${slug}-${item.id}`}
              items={item.books}
              title={item.title}
              genre={genre}
              key={item.id}
              selectionId={item.id}
              type={section.type}
            />
          ))}
        </>
      );
    }
    case 'RecommendedNewBook':
    case 'WaitFree':
    case 'TodayNewBook':
    case 'NewSerialBook': {
      return (
        <SelectionBook
          slug={slug}
          items={section.items}
          title={title}
          genre={genre}
          type={section.type}
          extra={extra}
        />
      );
    }
    case 'BestSeller':
      return (
        <RankingBookList
          slug={slug}
          items={section.items}
          title={title}
          genre={genre}
          type="big"
          showTimer={false}
          extra={extra}
        />
      );
    case 'HomeQuickMenu': {
      return <QuickMenuList items={section.items} />;
    }
    case 'UserPreferredBestseller': {
      return (
        <UserPreferredSection
          slug={slug}
          items={section.items}
          genre={genre}
          type={section.type}
        />
      );
    }
    case 'AiRecommendation': {
      return (
        <AiRecommendationSection
          slug={slug}
          genre={genre}
          type={section.type}
          extra={extra}
        />
      );
    }
    case 'KeywordFinder': {
      return <HomeKeywordFinderSection genre={genre} />;
    }
    case 'RecommendedBook': {
      return (
        <MultipleLineBooks
          slug={slug}
          genre={genre}
          title={title}
          items={section.items}
        />
      );
    }
    default:
      return null;
  }
}

export const MemoHomeSectionRenderer: React.FC<HomeSectionRendererProps> = React.memo(
  HomeSectionRenderer,
);

export default MemoHomeSectionRenderer;
