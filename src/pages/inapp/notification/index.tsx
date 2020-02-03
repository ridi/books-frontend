import * as React from 'react';
import { ConnectedInitializeProps } from 'src/types/common';
import { darkTheme, defaultTheme } from 'src/styles/themes';
import { ThemeProvider } from 'emotion-theming';
import NotificationPage from 'src/pages/notification';

interface InAppNotificationProps {
  theme?: string;
  // tslint:disable-next-line
}

export class InAppNotification extends React.Component<InAppNotificationProps> {
  public static async getInitialProps(initialProps: ConnectedInitializeProps) {
    // Cookies값으로 Theme 확인
    return {
      ...initialProps.query,
      theme: defaultTheme,
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
