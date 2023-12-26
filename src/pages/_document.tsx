import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script src="https://polyfill.io/v3/polyfill.min.js?features=default"></Script>
      </Head>
      <body className="h-svh">
        <Main />
        <NextScript />
        <Script src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&callback=initMap&v=weekly`} strategy="afterInteractive"></Script>
      </body>
    </Html>
  )
}
