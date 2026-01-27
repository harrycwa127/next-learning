import { Head, Html, Main, NextScript } from 'next/document';
import { SpeedInsights } from "@vercel/speed-insights/next";

function MyDocument() {
  return (
    <Html>
      <Head />
      <body className="overflow-x-hidden bg-white text-black antialiased transition-colors dark:bg-gray-900 dark:text-white">
        <Main />
        <NextScript />
        <SpeedInsights />
      </body>
    </Html>
  );
}

export default MyDocument;
