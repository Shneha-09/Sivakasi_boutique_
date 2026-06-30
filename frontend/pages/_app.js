import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
export default function App({ Component, pageProps }) {
  return (
    <>
      <Head><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="theme-color" content="#E91E63" /></Head>
      <Component {...pageProps} />
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Poppins, sans-serif', fontSize: '14px', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)' }, success: { iconTheme: { primary: '#E91E63', secondary: '#fff' } } }} />
    </>
  );
}
