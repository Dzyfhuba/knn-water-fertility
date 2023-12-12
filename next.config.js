/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.APP_ENV == 'production' ? true : false,
  },
}

module.exports = nextConfig
