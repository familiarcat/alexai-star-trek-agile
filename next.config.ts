import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['socket.io'],
  eslint: {
    // Disable ESLint during build to avoid TypeScript parsing issues
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('socket.io');
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/socket/:path*',
        destination: '/api/socket/:path*',
      },
    ];
  },
};

export default nextConfig; 