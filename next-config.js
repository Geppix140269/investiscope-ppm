/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'investiscope.net'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable static optimization for problematic pages
  experimental: {
    appDir: true,
  },
  // Increase timeout for static generation
  staticPageGenerationTimeout: 120,
}

module.exports = nextConfig
