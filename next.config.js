/** @type {import('next').NextConfig} */
const {PHASE_DEVELOPMENT_SERVER} = require('next/constants')


module.exports = (phase, {defaultConfig}) => {
    const nextConfig = {
        env: {
            APP_API: 'https://api.moviesplace.shop',
        },
        images: {
            domains: ["image.tmdb.org"],
        },
        reactStrictMode: true,
        async redirects() {
            return [
                {
                    source: '/home',
                    destination: '/',
                    permanent: true,
                },
            ]
        },
    }

    if (phase === PHASE_DEVELOPMENT_SERVER) {
        return {
            ...nextConfig,
            env: {
                APP_API: 'http://localhost:8080',
            },
        }
    }
    /* config options for all phases except development here */
    return nextConfig
}