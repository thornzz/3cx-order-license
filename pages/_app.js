import '../styles/globals.css'
import Script from "next/script";
import Head from "next/head";

function MyApp({Component, pageProps}) {
    return (

        <Component {...pageProps} />

    )
}

export default MyApp
