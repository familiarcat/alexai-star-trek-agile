import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['socket.io'],
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