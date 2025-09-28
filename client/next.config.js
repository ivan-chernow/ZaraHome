/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
    ],
  },
  // Экспериментальные функции для улучшения производительности
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
