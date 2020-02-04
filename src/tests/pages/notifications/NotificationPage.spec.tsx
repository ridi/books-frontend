import * as React from 'react';
import Index from 'src/pages/notification';
import { Provider } from 'react-redux';
import makeStore from 'src/store/config';

import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const store = makeStore({}, { asPath: 'test', isServer: false });
afterEach(cleanup);

test('should be render Index Component', async () => {
  // @ts-ignore

  const { getAllByText } = render(
    <Provider store={store}>
      <Index />
    </Provider>,
  );

  expect(getAllByText(/알림/)[0]).toHaveTextContent('알림');
});
