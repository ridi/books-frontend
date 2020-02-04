import * as React from 'react';
import { cleanup, render } from '@testing-library/react';
import { MainTab } from 'src/components/Tabs';
import { ThemeProvider } from 'emotion-theming';
import { Provider } from 'react-redux';
import makeStore from 'src/store/config';
import { defaultTheme } from 'src/styles';
import { RouterContext } from 'next/dist/next-server/lib/router-context';

const store = makeStore({}, { asPath: 'test', isServer: false });
afterEach(cleanup);

const renderComponent = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <RouterContext.Provider value={{ asPath: '' }}>
        <Provider store={store}>
          <MainTab isPartials={false} />
        </Provider>
      </RouterContext.Provider>
    </ThemeProvider>,
  );

describe('MainTab test', () => {
  it('should be render MainTab component', () => {
    const { container } = renderComponent();
    expect(container).not.toBe(null);
  });
});
