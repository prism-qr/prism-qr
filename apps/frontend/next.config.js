/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/r/:slug',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/r/:slug`,
      },
    ];
  },
}

module.exports = nextConfig
