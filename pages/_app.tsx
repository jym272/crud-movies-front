import '../styles/globals.css'
import {Auth, Layout, StoreProvider} from "../components";
import {NextComponentWithAuth} from "../Types";

function MyApp({Component, pageProps}: { Component: NextComponentWithAuth, pageProps: any }) {
    return <StoreProvider>
        <Layout>
            {Component.auth ? (
                <Auth>
                    <Component {...pageProps} />
                </Auth>
            ) : (
                <Component {...pageProps} />
            )}
        </Layout>
    </StoreProvider>
}

export default MyApp
