import * as React from 'react';
import { QuickMenuList } from 'src/components/QuickMenu';
import { render, cleanup, getByText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// @ts-ignore
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';
import makeStore from '../../../store/config';
import { Provider } from 'react-redux';

afterEach(cleanup);
const store = makeStore(
  {
    books: {
      itmes: {
        '12345': null,
      },
      isFetching: false,
    },
  },
  { asPath: 'test', isServer: false },
);

const renderComponent = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <QuickMenuList
          items={[
            {
              id: 1,
              name: '이벤트 만세',
              icon: '/',
              bg_color: '#ffffff',
              url: '/event/12345',
              order: 1,
            },
          ]}
        />
      </Provider>
    </ThemeProvider>,
  );

describe('test QuickMenuList Component', () => {
  it('should be render QuickMenu Item', () => {
    const { container } = renderComponent();
    const itemNode = getByText(container, '이벤트 만세');
    expect(itemNode[0]).not.toBe(null);
  });
});
