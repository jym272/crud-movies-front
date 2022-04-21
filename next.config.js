/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        APP_API: 'http://localhost:8080',
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

module.exports = nextConfig
