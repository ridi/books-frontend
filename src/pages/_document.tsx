import Document, {
  Head,
  Main,
  NextScript,
  DocumentProps,
  DocumentContext,
} from 'next/document';
import { extractCritical } from 'emotion-server';
import { EmotionCritical } from 'create-emotion-server';
import { PartialSeparator } from 'src/components/Misc';
import * as React from 'react';

interface StoreDocumentProps extends DocumentProps, EmotionCritical {
  nonce: string;
}

export default class StoreDocument extends Document<StoreDocumentProps> {
  public constructor(props: StoreDocumentProps) {
    super(props);
    const { __NEXT_DATA__, ids } = props;
    if (ids) {
      // @ts-ignore
      __NEXT_DATA__.ids = ids;
    }
  }

  public static async getInitialProps(context: DocumentContext) {
    const originalRenderPage = context.renderPage;
    // @ts-ignore
    const { locals = { nonce: '' } } = context.res;
    const { nonce } = locals;

    context.renderPage = () => originalRenderPage({
      // @ts-ignore
      enhanceApp: (App) => (props) => <App {...props} nonce={nonce} />,
      enhanceComponent: (Component) => (props) => <Component {...props} />,
    });

    const page = await Document.getInitialProps(context);

    if (page.html) {
      const styles = extractCritical(page.html);
      return { ...page, ...styles, nonce };
    }

    return { ...page, nonce };
  }

  public render() {
    const isPartials = !!this.props.__NEXT_DATA__.page.match(/^\/partials\//u);
    const { nonce } = this.props;
    return (
      <html lang="ko">
        <PartialSeparator name="HEADER" wrapped={isPartials}>
          <Head nonce={nonce}>
            <style nonce={nonce} dangerouslySetInnerHTML={{ __html: this.props.css }} />
          </Head>
        </PartialSeparator>
        <body>
          <PartialSeparator name="CONTENT" wrapped={isPartials}>
            <Main />
          </PartialSeparator>
          <PartialSeparator name="BOTTOM_SCRIPT" wrapped={isPartials}>
            <NextScript nonce={nonce} />
          </PartialSeparator>
        </body>
      </html>
    );
  }
}
