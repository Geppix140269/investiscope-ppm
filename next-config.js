// File: next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'investiscope.net', 'images.unsplash.com'],
  },
  eslint: {
    ignoreDuringBuilds: false, // Change to false to catch errors
  },
  typescript: {
    ignoreBuildErrors: false, // Change to false to catch errors
  },
  experimental: {
    appDir: true,
  },
  // PWA headers
  async headers() {
    return [
      {
        source: '/service-worker.js',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
