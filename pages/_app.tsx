import { AppProps } from "next/app";
import Head from "next/head";
import { Box, CSSReset, ThemeProvider, theme } from "@chakra-ui/core";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>WatchWith</title>
        <link rel="shortcut icon" href="images/Icon-32.png" type="image/png" />
        <link rel="manifest" href="manifest.json" />
      </Head>
      <CSSReset />
      <Box
        width={["95%", "85%", "80%", "800px"]}
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        margin="auto"
      >
        <Component {...pageProps} />
      </Box>
    </ThemeProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
