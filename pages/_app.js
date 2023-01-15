import "../styles/globals.css";
import React from "react";
import { RecoilRoot } from "recoil";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <RecoilRoot>
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
        <ToastContainer />
      </RecoilRoot>
    </ChakraProvider>
  );
}
export default MyApp;
