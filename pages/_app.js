import '../styles/globals.css'
import '../styles/Main.scss'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');
import dynamic from 'next/dynamic'
import Head from 'next/head';

// Client-side cache shared for the whole session 
// of the user in the browser.

const clientSideEmotionCache = createEmotionCache();

function MyApp({ Component, pageProps }) {
  const WalletConnectProvider = dynamic(
    () => import('../context/WalletConnectionProvider'),
    { ssr: false }
  );


  return (
    <CacheProvider value={clientSideEmotionCache}>
      <Head>
        <meta name="viewport"
          content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>

        {/* CssBaseline kickstart an elegant, 
                consistent, and simple baseline to
                build upon. */}

        <CssBaseline />
        <WalletConnectProvider>
          <Component {...pageProps} />
        </WalletConnectProvider>
      </ThemeProvider>
    </CacheProvider>

  )
}

export default MyApp
