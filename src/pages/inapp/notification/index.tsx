import * as React from 'react';
import { ConnectedInitializeProps } from 'src/types/common';
import { darkTheme, defaultTheme } from 'src/styles/themes';
import * as Cookies from 'js-cookie';
import { ThemeProvider } from 'emotion-theming';
import NotificationPage from 'src/pages/notification';

const RIDI_APP_THEME = 'ridi_app_theme';

interface InAppNotificationProps {
  theme?: string;
  // tslint:disable-next-line
}

export class InAppNotification extends React.Component<InAppNotificationProps> {
  public static async getInitialProps(initialProps: ConnectedInitializeProps) {
    const { req } = initialProps;
    let ridiAppTheme = '';
    // Cookies값으로 Theme 확인
    if (req) {
      // ServerSide
      ridiAppTheme = req.cookies[RIDI_APP_THEME];
    } else {
      // ClientSide
      ridiAppTheme = Cookies.get(RIDI_APP_THEME);
    }

    return {
      ...initialProps.query,
      theme: ridiAppTheme === 'dark' ? darkTheme : defaultTheme,
    };
  }

  public render() {
    return (
      <ThemeProvider theme={this.props.theme}>
        <NotificationPage isTitleHidden={true} />
      </ThemeProvider>
    );
  }
}

export default InAppNotification;
