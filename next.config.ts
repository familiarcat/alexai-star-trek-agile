import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Explicitly use App Router (default in Next.js 13+)
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  webpack: (config, { dev, isServer }) => {
    // Fix webpack chunk resolution issues
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Create stable vendor chunks
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // Create stable common chunks
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
      // Ensure consistent chunk IDs
      chunkIds: 'deterministic',
    }

    // Fix module resolution
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      },
    }

    return config
  },
  // Ensure stable builds
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
}

export default nextConfig 