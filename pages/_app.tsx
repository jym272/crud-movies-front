import '../styles/globals.css'
import {Auth, Layout, StoreProvider} from "../components";
import {NextComponentWithAuth} from "../Types";

function MyApp({Component, pageProps}: { Component: NextComponentWithAuth, pageProps: any }) {
    return <StoreProvider>
        <Layout>
            <Auth auth={Component.auth}>
                <Component {...pageProps} />
            </Auth>
        </Layout>
    </StoreProvider>
}

export default MyApp
