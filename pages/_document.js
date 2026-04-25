import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Favicons — applied globally to every page */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#13151C" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
