import '../styles/globals.css'
import {Auth, Layout, StoreProvider} from "../components";
import {NextComponentWithAuth} from "../Types";
import {SessionProvider} from "next-auth/react";

function MyApp({Component, pageProps: {session, ...pageProps}}: { Component: NextComponentWithAuth, pageProps: any }) {
    return <SessionProvider session={session}>
        <StoreProvider>
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
    </SessionProvider>
}

export default MyApp
