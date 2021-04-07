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

  private insertHotjarScript() {
    const hjid = '2334254';
    return (
      <script
        async
        nonce={this.props.nonce}

        id="hotjar-init"
        dangerouslySetInnerHTML={{
          __html: `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${hjid},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
        }}
      />
    );
  }

  private insertBrazeScript() {
    return (
      <script
        nonce={this.props.nonce}
        type="text/javascript"
        src="https://js.appboycdn.com/web-sdk/3.2/appboy.min.js"
      />
    );
  }

  public render() {
    const { nonce, __NEXT_DATA__: { page } } = this.props;

    const isPartials = !!page.match(/^\/partials\//u);
    const isPartialGNB = page.startsWith('/partials/gnb');
    const isInApp = page.startsWith('/inapp/');

    const isHotjarInsertable = (isPartialGNB || (!isPartials && !isInApp));
    const isBrazeInsertable = !isPartials && !isInApp;

    return (
      <html lang="ko">
        <PartialSeparator name="HEADER" wrapped={isPartials}>
          <Head nonce={nonce}>
            <style nonce={nonce} dangerouslySetInnerHTML={{ __html: this.props.css }} />
            {isBrazeInsertable && this.insertBrazeScript()}
            {isHotjarInsertable && this.insertHotjarScript()}
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
