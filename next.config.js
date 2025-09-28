/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'picsum.photos', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve server-side modules on the client
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        dns: false,
        http2: false,
        // Add googleapis and related modules to prevent client-side bundling
        googleapis: false,
        'google-auth-library': false,
        'googleapis-common': false,
        gtoken: false,
        jws: false,
        jwa: false,
      };
      
      // Exclude googleapis from client bundle
      config.externals = config.externals || [];
      config.externals.push({
        googleapis: 'googleapis',
        'google-auth-library': 'google-auth-library',
        'googleapis-common': 'googleapis-common',
      });
    }
    return config;
  },
}

module.exports = nextConfig
