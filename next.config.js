/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['typeorm', 'pg', 'bcryptjs', 'reflect-metadata'],
  },
}

module.exports = nextConfig
