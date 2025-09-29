import '../styles/globals.css';
import Head from 'next/head';
import { AuthProvider } from '../contexts/AuthContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>Menu</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
