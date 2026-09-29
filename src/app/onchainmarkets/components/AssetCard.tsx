'use client';

import React, { useState } from 'react';

export interface AssetPlatform {
  tokenSymbol: string;
  tokenName?: string;
  address: string;
  chain: string;
  chainId?: number;
  multiplier?: string;
  isin?: string;
  logo?: string;
  explorerUrl?: string;
  status?: string;
  tradingCapabilities?: any;
}

export interface Asset {
  id: string;
  name: string;
  ticker: string;
  type: 'Stock' | 'ETF';
  sector: string;
  description: string;
  isin: string;
  logo: string;
  platforms: {
    ondo?: AssetPlatform;
    xstocks?: AssetPlatform;
    robinhood?: AssetPlatform;
  };
}

interface AssetCardProps {
  asset: Asset;
  onClick: (asset: Asset) => void;
}

export default function AssetCard({ asset, onClick }: AssetCardProps) {
  const [imgError, setImgError] = useState(false);

  const platformCount =
    (asset.platforms.ondo ? 1 : 0) +
    (asset.platforms.xstocks ? 1 : 0) +
    (asset.platforms.robinhood ? 1 : 0);

  return (
    <div
      className="asset-card asset-card-minimal"
      onClick={() => onClick(asset)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(asset);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Visualizza ${asset.name} (${asset.ticker})`}
      title={`${asset.name} (${asset.ticker})`}
    >
      <div className="card-minimal-content">
        <div className="card-minimal-main">
          <div className="card-logo-container">
            {asset.logo && !imgError ? (
              <img
                src={asset.logo}
                alt={asset.ticker}
                className="card-logo"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="card-logo-fallback">{asset.ticker.slice(0, 2)}</div>
            )}
          </div>
          <div className="card-minimal-info">
            <span className="card-ticker">{asset.ticker}</span>
            <span className="card-chain-pill">
              {platformCount} {platformCount === 1 ? 'Chain' : 'Chain'}
            </span>
          </div>
        </div>

        <div className="card-arrow-icon" aria-hidden="true" title="Apri dettagli">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </div>
      </div>
    </div>
  );
}
