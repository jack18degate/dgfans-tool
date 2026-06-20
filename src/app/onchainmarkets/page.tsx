'use client';

import React, { useEffect, useState } from 'react';
import AssetGrid from './components/AssetGrid';
import { Asset } from './components/AssetCard';
import { useI18n } from '../i18n';

export default function OnChainMarketsPage() {
  const [data, setData] = useState<{ assets: Asset[]; metadata: any }>({
    assets: [],
    metadata: {},
  });
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();
  const ocm = (t as any).onchainmarkets || {};

  useEffect(() => {
    fetch('/api/assets')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load assets', err);
        setLoading(false);
      });
  }, []);

  const labelTitle = ocm.title || 'RWA Token Explorer';
  const labelSubtitle =
    ocm.subtitle || 'Explore tokenized real-world assets across Ondo Markets & xStocks';

  const badgeTotal = ocm.totalAssetsBadge?.replace('{count}', data.metadata.totalAssets?.toString()) || `${data.metadata.totalAssets || 0} Total Assets`;
  const badgeStocks = ocm.stocksBadge?.replace('{count}', data.metadata.stocks?.toString()) || `${data.metadata.stocks || 0} Stocks`;
  const badgeEtfs = ocm.etfsBadge?.replace('{count}', data.metadata.etfs?.toString()) || `${data.metadata.etfs || 0} ETFs`;
  const badgeBoth = ocm.crossPlatformBadge?.replace('{count}', data.metadata.both?.toString()) || `${data.metadata.both || 0} Cross-Platform`;

  return (
    <div className="rwa-explorer">
      <div className="container">
        <header className="header">
          <h1 className="header-title">{labelTitle}</h1>
          <p className="header-subtitle">{labelSubtitle}</p>

          {!loading && data.metadata && (
            <div className="stats-row">
              <span className="stat-badge">
                <strong>{data.metadata.totalAssets || 0}</strong> {badgeTotal.split(' ').slice(1).join(' ')}
              </span>
              <span className="stat-badge">
                <strong>{data.metadata.stocks || 0}</strong> {badgeStocks.split(' ').slice(1).join(' ')}
              </span>
              <span className="stat-badge">
                <strong>{data.metadata.etfs || 0}</strong> {badgeEtfs.split(' ').slice(1).join(' ')}
              </span>
              <span className="stat-badge">
                <strong>{data.metadata.both || 0}</strong> {badgeBoth.split(' ').slice(1).join(' ')}
              </span>
            </div>
          )}
        </header>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
            <div className="loading-text">{ocm.loadingAssets || 'Loading assets...'}</div>
          </div>
        ) : (
          <AssetGrid assets={data.assets} metadata={data.metadata} />
        )}
      </div>
    </div>
  );
}
