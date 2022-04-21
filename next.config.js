/** @type {import('next').NextConfig} */
const nextConfig = {
    //https://moviesplace.shop
    //http://localhost:8080
    env: {
        APP_API: 'https://moviesplace.shop',
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
