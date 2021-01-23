import { useEffect, useState } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { Box, CSSReset, ThemeProvider, theme } from "@chakra-ui/core";
import { RoomServiceProvider } from "@roomservice/react";
import { nanoid } from "nanoid";

async function authCheck({
  room,
  ctx,
}: {
  room: string;
  ctx: { userID: number };
}) {
  const response = await fetch("/api/roomservice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ room, user: ctx.userID }),
  });

  if (response.status === 401) {
    throw new Error("Unauthorized!");
  }

  if (response.status !== 200) {
    throw await response.text();
  }

  const body = await response.json();
  return {
    user: body.user,
    resources: body.resources,
    token: body.token,
  };
}

function useUserID(): string | null {
  const [userID, setUserID] = useState<string | null>(null);

  //  useEffect forces this to happen on the client, since `window` is not
  //  available on the server during server-side rendering
  useEffect(() => {
    let userID: string | null = window.localStorage.getItem("roomservice-user");
    if (userID === null) {
      userID = nanoid();
      window.localStorage.setItem("roomservice-user", userID);
    }
    setUserID(userID);
  }, []);

  return userID;
}

function MyApp({ Component, pageProps }: AppProps) {
  const userID = useUserID();

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>WatchWith</title>
        <link rel="shortcut icon" href="images/Icon-32.png" type="image/png" />
        <link rel="manifest" href="manifest.json" />
      </Head>
      <CSSReset />
      <RoomServiceProvider
        online={userID !== null}
        clientParameters={{
          auth: authCheck,
          ctx: { userID },
        }}
      >
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
      </RoomServiceProvider>
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
