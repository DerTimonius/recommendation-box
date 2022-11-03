/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    emotion: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/original/**',
        /* protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/images/**', */
      },
    ],
  },
};

module.exports = nextConfig;
