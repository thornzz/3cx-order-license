import "../styles/globals.css";
import React from "react";
import { RecoilRoot } from "recoil";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider ,extendTheme} from "@chakra-ui/react";
import {  MultiSelectTheme } from 'chakra-multiselect'

function MyApp({ Component, pageProps }) {
  const theme = extendTheme({
    components: {
      MultiSelect: MultiSelectTheme
    }
  })
  return (
    <ChakraProvider theme={theme}>
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
