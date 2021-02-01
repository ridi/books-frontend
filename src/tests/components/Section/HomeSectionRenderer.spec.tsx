import '@testing-library/jest-dom/extend-expect';
import { act, cleanup, render } from '@testing-library/react';
import React from 'react';

import HomeSectionRenderer from 'src/components/Section/HomeSectionRenderer';
import { Section } from 'src/types/sections';

function mockCreateComponent(name: string) {
  const component = () => {
    return <>{name}</>;
  };
  component.displayName = `Mock(${name})`;
  return component;
}

jest.mock('src/components/BookSections/RankingBook/RankingBookList', () => ({
  __esModule: true,
  default: mockCreateComponent('RankingBookList'),
}));

jest.mock('src/components/RecommendedBook', () => ({
  __esModule: true,
  default: mockCreateComponent('RecommendedBook'),
}));

jest.mock('src/components/BookSections/SelectionBook', () => ({
  __esModule: true,
  default: mockCreateComponent('SelectionBook'),
}));

jest.mock('src/components/TopBanner', () => ({
  __esModule: true,
  default: mockCreateComponent('TopBanner'),
}));

jest.mock('src/components/EventBanner/EventBanner', () => ({
  __esModule: true,
  default: mockCreateComponent('EventBanner'),
}));

jest.mock('src/components/QuickMenu/QuickMenuList', () => ({
  __esModule: true,
  QuickMenuList: mockCreateComponent('QuickMenuList'),
}));

jest.mock('src/components/Section/UserPreferredSection', () => ({
  __esModule: true,
  default: mockCreateComponent('UserPreferredSection'),
}));

jest.mock('src/components/Section/AIRecommendationSection', () => ({
  __esModule: true,
  default: mockCreateComponent('AIRecommendationSection'),
}));

jest.mock('src/components/KeywordFinder/HomeKeywordFinderSection', () => ({
  __esModule: true,
  default: mockCreateComponent('HomeKeywordFinderSection'),
}));

jest.mock('src/components/MultipleLineBooks/MultipleLineBooks', () => ({
  __esModule: true,
  MultipleLineBooks: mockCreateComponent('MultipleLineBooks'),
}));

describe('HomeSectionRenderer', () => {
  afterEach(() => {
    cleanup();
  });

  it.each([
    ['ReadingBooksRanking', 'RankingBookList'],
    ['BestSeller', 'RankingBookList'],
    ['HotRelease', 'RecommendedBook'],
    ['TodayRecommendation', 'RecommendedBook'],
    ['RecommendedNewBook', 'SelectionBook'],
    ['WaitFree', 'SelectionBook'],
    ['TodayNewBook', 'SelectionBook'],
    ['NewSerialBook', 'SelectionBook'],
    ['HomeCarouselBanner', 'TopBanner'],
    ['HomeEventBanner', 'EventBanner'],
    ['HomeEventBannerTop', 'EventBanner'],
    ['HomeEventBannerMiddle', 'EventBanner'],
    ['HomeEventBannerBottom', 'EventBanner'],
    ['HomeQuickMenu', 'QuickMenuList'],
    ['UserPreferredBestseller', 'UserPreferredSection'],
    ['AiRecommendation', 'AIRecommendationSection'],
    ['KeywordFinder', 'HomeKeywordFinderSection'],
    ['RecommendedBook', 'MultipleLineBooks'],
  ])('should render %s as %s', (type, expectedKind) => {
    const section: Section = {
      type,
      slug: '',
      title: '',
      items: [],
    };
    const renderResult = render(
      <HomeSectionRenderer section={section} genre="" order={0} />
    );
    expect(renderResult.container).toHaveTextContent(expectedKind);
  });

  it('should render HomeMdSelection as a list of SelectionBook', () => {
    const section: Section = {
      type: 'HomeMdSelection',
      slug: '',
      title: '',
      items: [
        {
          id: 1,
          title: '',
          books: [],
        },
        {
          id: 2,
          title: '',
          books: [],
        },
        {
          id: 3,
          title: '',
          books: [],
        },
      ],
    };
    const renderResult = render(
      <HomeSectionRenderer section={section} genre="" order={0} />
    );
    expect(renderResult.container).toHaveTextContent('SelectionBook'.repeat(3));
  });
});
