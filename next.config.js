/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {},
  transpilePackages: ["firebase"],
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: false,
  },
  env: {
    CUSTOM_KEY: 'better-menu-app',
  },
}

module.exports = nextConfig