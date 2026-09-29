'use client';

import React, { useEffect, useState } from 'react';
import AssetGrid from './components/AssetGrid';
import { Asset } from './components/AssetCard';
import { useI18n } from '../i18n';
import Link from 'next/link';

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
    ocm.subtitle ||
    'Explore tokenized real-world assets across Ondo Markets, Robinhood Chain & xStocks';

  const badgeTotal =
    ocm.totalAssetsBadge?.replace('{count}', data.metadata.totalAssets?.toLocaleString()) ||
    `${data.metadata.totalAssets || 0} Total Assets`;
  const badgeStocks =
    ocm.stocksBadge?.replace('{count}', data.metadata.stocks?.toLocaleString()) ||
    `${data.metadata.stocks || 0} Stocks`;
  const badgeEtfs =
    ocm.etfsBadge?.replace('{count}', data.metadata.etfs?.toLocaleString()) ||
    `${data.metadata.etfs || 0} ETFs`;
  const badgeRobinhood =
    ocm.robinhoodBadge?.replace('{count}', data.metadata.robinhood?.toLocaleString()) ||
    `${data.metadata.robinhood || 0} Robinhood`;
  const badgeBoth =
    ocm.crossPlatformBadge?.replace('{count}', data.metadata.both?.toLocaleString()) ||
    `${data.metadata.both || 0} Cross-Platform`;

  const handleStatClick = (hash: string) => {
    window.location.hash = hash;
  };

  return (
    <div className="rwa-explorer">
      <div className="container">
        <header className="header">
          <h1 className="header-title">{labelTitle}</h1>
          <p className="header-subtitle">{labelSubtitle}</p>

          {!loading && data.metadata && (
            <div className="stats-row">
              <button
                type="button"
                className="stat-badge stat-badge-interactive"
                onClick={() => handleStatClick('')}
                title="View all assets"
              >
                <strong>{data.metadata.totalAssets || 0}</strong> {badgeTotal.split(' ').slice(1).join(' ')}
              </button>
              <button
                type="button"
                className="stat-badge stat-badge-interactive"
                onClick={() => handleStatClick('#stocks')}
                title="Filter Stocks"
              >
                <strong>{data.metadata.stocks || 0}</strong> {badgeStocks.split(' ').slice(1).join(' ')}
              </button>
              <button
                type="button"
                className="stat-badge stat-badge-interactive"
                onClick={() => handleStatClick('#etfs')}
                title="Filter ETFs"
              >
                <strong>{data.metadata.etfs || 0}</strong> {badgeEtfs.split(' ').slice(1).join(' ')}
              </button>
              <button
                type="button"
                className="stat-badge stat-badge-interactive stat-badge-rh"
                onClick={() => handleStatClick('#robinhood')}
                title="Filter official Robinhood Chain tokens"
              >
                <span className="rh-dot" />
                <strong>{data.metadata.robinhood || 0}</strong> Robinhood
              </button>
              <button
                type="button"
                className="stat-badge stat-badge-interactive stat-badge-ondo"
                onClick={() => handleStatClick('#ondo')}
                title="Filter Ondo Finance assets"
              >
                <strong>{data.metadata.ondo || 0}</strong> Ondo
              </button>
              <button
                type="button"
                className="stat-badge stat-badge-interactive stat-badge-xstocks"
                onClick={() => handleStatClick('#xstocks')}
                title="Filter xStocks assets"
              >
                <strong>{data.metadata.xstocks || 0}</strong> xStocks
              </button>
              <button
                type="button"
                className="stat-badge stat-badge-interactive stat-badge-both"
                onClick={() => handleStatClick('#both')}
                title="Filter multi-platform assets"
              >
                <strong>{data.metadata.both || 0}</strong> {badgeBoth.split(' ').slice(1).join(' ')}
              </button>
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
