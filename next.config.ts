import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: '/degate-api/:path*',
        destination: 'https://v1-nd-api.degate.com/:path*'
      }
    ]
  }
};

export default nextConfig;
