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

  const platformCount = (asset.platforms.ondo ? 1 : 0) +
    (asset.platforms.xstocks ? 1 : 0) +
    (asset.platforms.robinhood ? 1 : 0);

  // Check if Robinhood multiplier > 1 (e.g. 1.001148)
  const rhMultiplier = asset.platforms.robinhood?.multiplier;
  const hasDividendGrowth = rhMultiplier && parseFloat(rhMultiplier) > 1.000001;
  const formattedMultiplier = hasDividendGrowth ? `${parseFloat(rhMultiplier).toFixed(4)}x` : null;

  return (
    <div
      className="asset-card"
      onClick={() => onClick(asset)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(asset);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${asset.name} (${asset.ticker})`}
    >
      <div className="card-top">
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
        <div className="card-title-group">
          <span className="card-ticker">{asset.ticker}</span>
          {platformCount > 1 && (
            <span className="badge badge-multichain" title={`Available across ${platformCount} ecosystems`}>
              {platformCount} Chains
            </span>
          )}
        </div>
      </div>

      <div className="card-name" title={asset.name}>
        {asset.name}
      </div>

      <div className="card-badges">
        <span className={`badge ${asset.type === 'ETF' ? 'badge-etf' : 'badge-stock'}`}>
          {asset.type}
        </span>
        {asset.platforms.robinhood && (
          <span className="badge badge-robinhood" title="Official Robinhood Chain Token (Chain ID 4663)">
            Robinhood
          </span>
        )}
        {asset.platforms.ondo && (
          <span className="badge badge-ondo" title="Ondo Finance (Ethereum)">
            Ondo
          </span>
        )}
        {asset.platforms.xstocks && (
          <span className="badge badge-xstocks" title="xStocks (Solana)">
            xStocks
          </span>
        )}
        {formattedMultiplier && (
          <span className="badge badge-multiplier" title={`Auto-reinvested dividend multiplier: ${rhMultiplier}`}>
            📈 {formattedMultiplier}
          </span>
        )}
      </div>
    </div>
  );
}
