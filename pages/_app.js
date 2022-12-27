import '../styles/globals.css'
import Script from "next/script";
import Head from "next/head";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

function MyApp({Component, pageProps}) {
    return (

        <Component {...pageProps} />

    )
}

export default MyApp
