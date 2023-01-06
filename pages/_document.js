import Document, { Html, Head, Main, NextScript } from "next/document";

function MyDocument() {
    return (
        <Html>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;500;700&display=swap"
                    rel="stylesheet"
                />
                <title>K2M 3CX Lisans Portal</title>
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}

export default MyDocument;