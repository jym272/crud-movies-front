import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {Layout, StoreProvider} from "../components";

function MyApp({Component, pageProps}: AppProps) {
    return <StoreProvider>
        <Layout>
            <Component {...pageProps} />
        </Layout>
    </StoreProvider>
}

export default MyApp
