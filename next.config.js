/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {},
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: false,
  },
  env: {
    CUSTOM_KEY: 'better-menu-app',
  },
}

module.exports = nextConfig