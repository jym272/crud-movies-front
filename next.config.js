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
                GOOGLE_ID: '352060454882-qp223ohm4862v8t21g5eicnl3b2lim3s.apps.googleusercontent.com',
                GOOGLE_SECRET: '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',
            },
        }
    }
    /* config options for all phases except development here */
    return nextConfig
}