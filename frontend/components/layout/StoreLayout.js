import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from '../shop/Chatbot';
import Head from 'next/head';

export default function StoreLayout({ children, title, description, keywords }) {
  const siteName = 'Sivakasi Boutique';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} – Women's Kurtis, Nighties & Innerwear Online`;
  const desc = description || "Shop premium women's kurtis, nighties, innerwear and men's innerwear online. Best quality fashion from Sivakasi, Virudhunagar, Tamil Nadu.";
  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={desc} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={desc} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Sivakasi, Virudhunagar" />
      </Head>
      <div style={{paddingTop:'72px',minHeight:'100vh',background:'var(--gradient-bg)'}}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Chatbot />
      </div>
    </>
  );
}
