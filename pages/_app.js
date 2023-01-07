import '../styles/globals.css'
import React from "react";
import {RecoilRoot} from "recoil";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import {SessionProvider} from "next-auth/react";

function MyApp({Component, pageProps }) {
    return (
            <RecoilRoot>
                <SessionProvider session={pageProps.session}>
                <Component {...pageProps} />
                </SessionProvider>
                <ToastContainer/>
            </RecoilRoot>

    )
}
export default MyApp
