/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Enable standalone output for Docker
  transpilePackages: ["@repo/ui", "@repo/core"],
  assetPrefix: "/pdv",
}

module.exports = nextConfig

