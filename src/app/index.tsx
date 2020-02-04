import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Global } from '@emotion/core';
import { resetStyles } from 'src/styles';
import makeStore from 'src/store/config';
import InAppNotification from 'src/pages/inapp/notification';

const store = makeStore({}, { isServer: false });

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <>
          {/* Todo Apply Layout */}
          <Global styles={resetStyles} />
          <Provider store={store}>
            <InAppNotification />
          </Provider>
        </>
      </Provider>
    );
  }
}

render(<App />, document.getElementById('app'));
