/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xrpl-s3-bucket.s3.ap-northeast-2.amazonaws.com',
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
