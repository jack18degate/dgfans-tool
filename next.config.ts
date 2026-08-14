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
      {
        source: '/onchainstocks/articoli',
        destination: '/articles/index.html',
      },
      {
        source: '/onchainstocks/articles',
        destination: '/articles/index.html',
      },
      {
        source: '/onchainstocks/articoli/:slug',
        destination: '/articles/:slug.html',
      },
      {
        source: '/onchainstocks/articles/:slug',
        destination: '/articles/:slug.html',
      },
    ];
  },
};

export default nextConfig;
