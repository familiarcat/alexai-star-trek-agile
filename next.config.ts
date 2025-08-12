import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['socket.io'],
  eslint: {
    // Enable ESLint during builds for proper CI/CD
    ignoreDuringBuilds: false,
    dirs: ['src', 'scripts', 'components']
  },
  typescript: {
    // Enable TypeScript checking during builds
    ignoreBuildErrors: false,
  },
  env: {
    N8N_BASE_URL: process.env.N8N_BASE_URL,
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