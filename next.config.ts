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
      {
        source: '/onchainstock/RFQ',
        destination: '/rfq.html',
      },
    ];
  },
};

export default nextConfig;
