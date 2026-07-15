import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: '/robinhood',
        destination: '/robinhood.html',
      },
      {
        source: '/onchainstocks',
        destination: '/onchainstocks.html',
      },
    ];
  },
};

export default nextConfig;
