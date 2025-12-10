/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Enable standalone output for Docker
  transpilePackages: ["@repo/ui", "@repo/core"],
  assetPrefix: "/dashboard", // For static assets
}

module.exports = nextConfig

