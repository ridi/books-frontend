import * as React from 'react';
import {
  act,
  render,
  cleanup,
  getAllByAltText,
  getAllByText,
  RenderResult,
  waitForElement,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ThemeProvider } from 'emotion-theming';
import { Provider } from 'react-redux';
import SelectionBookList from 'src/components/BookSections/SelectionBook/SelectionBookList';
import { defaultTheme } from 'src/styles';
import makeStore from 'src/store/config';
import { ViewportIntersectionProvider } from 'src/hooks/useViewportIntersection';

afterEach(cleanup);
const store = makeStore(
  {
    books: {
      itmes: {
        '12345666': {
          b_id: '12345666',
        },
      },
      isFetching: false,
    },
  },
  { asPath: 'test', isServer: false },
);
const renderSelectionBookList = (listOptions: { aiRecommendation: boolean }) =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <ViewportIntersectionProvider>
          <SelectionBookList
            isAIRecommendation={listOptions.aiRecommendation}
            items={[
              {
                b_id: '12345666',
                type: 'test',
                detail: {
                  title: { main: '도서 표지' },
                  authors: [{ name: 'hi' }],
                  property: { is_adult_only: false },
                  file: { is_comic: false },
                },
              },
            ]}
          />
        </ViewportIntersectionProvider>
      </Provider>
    </ThemeProvider>,
  );

function actRender(renderFunction: () => RenderResult) {
  let ret: RenderResult;
  act(() => {
    ret = renderFunction();
  });
  return ret;
}

describe('test SelectionBookContainer', () => {
  let originalIO: typeof IntersectionObserver;

  // simulate non-IO environment
  beforeAll(() => {
    originalIO = window.IntersectionObserver;
    window.IntersectionObserver = undefined;
  });

  afterAll(() => {
    window.IntersectionObserver = originalIO;
  });

  it('should be render SelectionBookList item', async () => {
    const { container } = actRender(() => renderSelectionBookList({ aiRecommendation: false }));
    const item = await waitForElement(() => getAllByAltText(container, '도서 표지'));
    expect(item).not.toBe(null);
  });

  it('should be render 추천제외 버튼 for AI Recommendation', async () => {
    const { container } = actRender(() => renderSelectionBookList({ aiRecommendation: true }));
    const item = await waitForElement(() => getAllByText(container, '추천 제외'));
    expect(item).not.toBe(null);
  });
});
