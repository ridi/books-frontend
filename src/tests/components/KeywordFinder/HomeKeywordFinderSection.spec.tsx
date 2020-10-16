import * as React from 'react';
import HomeKeywordFinderSection from 'src/components/KeywordFinder/HomeKeywordFinderSection';
import { render, cleanup, getByText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';

afterEach(cleanup);

interface Keyword {
  id: number;
  name: string;
  tag_id: number;
  set_id: number;
}

const popularKeywords: Record<string, Keyword[]> = {
  'bl-novel': [
    {
      id: 1,
      set_id: 15,
      tag_id: 2412,
      name: '판타지물',
    },
    {
      id: 1,
      set_id: 15,
      tag_id: 2414,
      name: '동양풍',
    },
    {
      id: 1,
      set_id: 15,
      tag_id: 2806,
      name: '차원이동/영혼바뀜',
    },
  ],
  comics: [
    {
      id: 1,
      set_id: 20,
      tag_id: 188,
      name: '러브코믹',
    },
    {
      id: 1,
      set_id: 20,
      tag_id: 2972,
      name: '츤데레',
    },
    {
      id: 1,
      set_id: 16,
      tag_id: 555,
      name: '달달물',
    },
  ],
  'fantasy-serial': [
    {
      id: 1,
      set_id: 18,
      tag_id: 92,
      name: '현대판타지',
    },
    {
      id: 1,
      set_id: 18,
      tag_id: 96,
      name: '차원이동물',
    },
    {
      id: 1,
      set_id: 18,
      tag_id: 88,
      name: '게임판타지',
    },
  ],
  romance: [
    {
      id: 1,
      set_id: 1,
      tag_id: 150,
      name: '고수위',
    },
    {
      id: 1,
      set_id: 1,
      tag_id: 52,
      name: '후회남',
    },
    {
      id: 1,
      set_id: 1,
      tag_id: 36,
      name: '친구>연인',
    },
  ],
};

const renderComponent = (genre: string) =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <HomeKeywordFinderSection
        genre={genre}
        items={popularKeywords[genre]}
      />
    </ThemeProvider>,
  );

describe('test keyword finder section', () => {
  it('should be render comics keyword', () => {
    const { container } = renderComponent('comics');
    const itemNode = getByText(container, '달달물');
    expect(itemNode).not.toBe(null);
  });
  it('should be render fantasy keyword', () => {
    const { container } = renderComponent('fantasy-serial');
    const itemNode = getByText(container, '게임판타지');
    expect(itemNode).not.toBe(null);
  });
  it('should be render romance keyword', () => {
    const { container } = renderComponent('romance');
    const itemNode = getByText(container, '후회남');
    expect(itemNode).not.toBe(null);
  });
  it('should be render bl keyword', () => {
    const { container } = renderComponent('bl-novel');
    const itemNode = getByText(container, '동양풍');
    expect(itemNode).not.toBe(null);
  });
});
