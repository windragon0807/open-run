/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '',
        pathname: '**',
      },
    ],
  },
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  // },
}

module.exports = nextConfig
