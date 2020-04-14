import * as React from 'react';
import { ConnectedInitializeProps } from 'src/types/common';
import { darkTheme, defaultTheme } from 'src/styles/themes';
import { ThemeProvider } from 'emotion-theming';
import Footer from 'src/components/Footer';
import { PartialSeparator } from 'src/components/Misc';

interface FooterProps {
  theme?: string;
  // tslint:disable-next-line
  noticeItems?: any;
}

export class PartialFooter extends React.Component<FooterProps> {
  public static async getInitialProps(initialProps: ConnectedInitializeProps) {
    // Fix me
    // will get notice items
    // const result = await axios.get('https://randomuser.me/api/');
    return { ...initialProps.query };
  }

  public render() {
    return (
      <ThemeProvider theme={!this.props.theme ? defaultTheme : darkTheme}>
        <PartialSeparator name="FOOTER" wrapped>
          <Footer />
        </PartialSeparator>
      </ThemeProvider>
    );
  }
}

export default PartialFooter;
