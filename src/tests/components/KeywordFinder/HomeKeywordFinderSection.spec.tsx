import * as React from 'react';
import HomeKeywordFinderSection from 'src/components/KeywordFinder/HomeKeywordFinderSection';
import { render, cleanup, getByText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';

afterEach(cleanup);

const renderComponent = (genre: string) =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <HomeKeywordFinderSection
        genre={genre}
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
    const { container } = renderComponent('fantasy');
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
