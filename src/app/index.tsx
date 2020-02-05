import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Global } from '@emotion/core';
import { resetStyles } from 'src/styles';
import makeStore from 'src/store/config';
import InAppNotification from 'src/pages/inapp/notification';
import * as Cookies from 'js-cookie';

const RIDI_APP_THEME = 'ridi_app_theme';

const store = makeStore({}, { isServer: false });

interface AppState {
  theme: string;
}
class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    const theme = Cookies.get(RIDI_APP_THEME) || '';
    this.state = {
      theme,
    };
  }

  public render() {
    return (
      <Provider store={store}>
        <>
          {/* Todo Apply Layout */}
          <Global styles={resetStyles} />
          <Provider store={store}>
            <InAppNotification theme={this.state.theme} />
          </Provider>
        </>
      </Provider>
    );
  }
}

render(<App />, document.getElementById('app'));
