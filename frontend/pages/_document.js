import { Html, Head, Main, NextScript } from 'next/document';
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="robots" content="index, follow" />
      </Head>
      <body><Main /><NextScript /></body>
    </Html>
  );
}
