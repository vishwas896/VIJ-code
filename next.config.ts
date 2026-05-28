import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow images from external sources used in the app
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'fonts.googleapis.com' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Keep existing CSS imports working
  experimental: {},
};

export default nextConfig;
