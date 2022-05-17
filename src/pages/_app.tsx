// import "../styles/globals.css";
// import type { AppProps } from "next/app";
import { StyledEngineProvider } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";

// function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     <StyledEngineProvider injectFirst>
//       <CssBaseline />
//       <Component {...pageProps} />
//     </StyledEngineProvider>
//   );
// }

// export default MyApp;

import * as React from "react";
import "../styles/globals.css";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "@styles/theme";
import createEmotionCache from "@utils/createEmotionCache";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props: any) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}
