import '../styles/globals.css'
import React from "react";
import {RecoilRoot} from "recoil";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import {SessionProvider} from "next-auth/react";

function MyApp({Component, pageProps:{session,...pageProps}}) {
    return (
        <SessionProvider session={session}>
            <RecoilRoot>
                <Component {...pageProps} />
                <ToastContainer/>
            </RecoilRoot>
        </SessionProvider>
    )
}

export default MyApp
