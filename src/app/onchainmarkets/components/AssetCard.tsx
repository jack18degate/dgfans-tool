'use client';

import React, { useState } from 'react';

interface AssetPlatform {
  tokenSymbol: string;
  address: string;
  chain: string;
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
  };
}

interface AssetCardProps {
  asset: Asset;
  onClick: (asset: Asset) => void;
}

export default function AssetCard({ asset, onClick }: AssetCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="asset-card" onClick={() => onClick(asset)}>
      <div className="card-top">
        {asset.logo && !imgError ? (
          <img
            src={asset.logo}
            alt={asset.ticker}
            className="card-logo"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="card-logo-fallback">{asset.ticker.slice(0, 2)}</div>
        )}
        <span className="card-ticker">{asset.ticker}</span>
      </div>
      <div className="card-name">{asset.name}</div>
      <div className="card-badges">
        <span className={`badge ${asset.type === 'ETF' ? 'badge-etf' : 'badge-stock'}`}>
          {asset.type}
        </span>
        {asset.platforms.ondo && <span className="badge badge-ondo">Ondo</span>}
        {asset.platforms.xstocks && <span className="badge badge-xstocks">xStocks</span>}
      </div>
    </div>
  );
}
