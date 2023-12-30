import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';


export default class MyDocument extends Document {
  render() {
    return (
    <Html lang="en">
      <Head>
        <Script src="https://polyfill.io/v3/polyfill.min.js?features=default"></Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
    );
  }
}
