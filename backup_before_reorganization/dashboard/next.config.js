/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // API routes configuration
  async rewrites() {
    return [
      // Proxy API calls to subdomains
      {
        source: '/api/agile/:path*',
        destination: 'https://agile.pbradygeorgen.com/api/:path*',
      },
      {
        source: '/api/software/:path*',
        destination: 'https://software.pbradygeorgen.com/api/:path*',
      },
      {
        source: '/api/business/:path*',
        destination: 'https://business.pbradygeorgen.com/api/:path*',
      },
      {
        source: '/api/startup/:path*',
        destination: 'https://startup.pbradygeorgen.com/api/:path*',
      },
      {
        source: '/api/n8n/:path*',
        destination: 'https://n8n.pbradygeorgen.com/api/:path*',
      },
      // Proxy Supabase calls
      {
        source: '/api/supabase/:path*',
        destination: `${process.env.SUPABASE_URL}/rest/v1/:path*`,
      },
    ]
  },
  
  // Headers for CORS and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Image optimization
  images: {
    domains: [
      'agile.pbradygeorgen.com',
      'software.pbradygeorgen.com',
      'business.pbradygeorgen.com',
      'startup.pbradygeorgen.com',
      'n8n.pbradygeorgen.com',
    ],
  },
  
  // Experimental features
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

module.exports = nextConfig 