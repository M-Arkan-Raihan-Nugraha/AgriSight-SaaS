import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['firebase-admin'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'www.gstatic.com',
      },
    ],
  },
};

export default nextConfig;
