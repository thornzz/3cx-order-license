import '../styles/globals.css'
import React from "react";
import {RecoilRoot} from "recoil";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function MyApp({Component, pageProps}) {
    return (
        <RecoilRoot>
        <Component {...pageProps} />
            <ToastContainer/>
        </RecoilRoot>
    )
}

export default MyApp
