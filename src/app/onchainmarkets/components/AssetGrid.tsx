'use client';

import React, { useState, useMemo, useEffect } from 'react';
import FilterBar from './FilterBar';
import AssetCard, { Asset } from './AssetCard';
import AssetModal from './AssetModal';
import { useI18n } from '../../i18n';

interface AssetGridProps {
  assets: Asset[];
  metadata: any;
}

export default function AssetGrid({ assets, metadata }: AssetGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const { t } = useI18n();
  const ocm = (t as any).onchainmarkets || {};

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (!hash) return;

      if (hash === '#etfs' || hash === '#etfall') {
        setTypeFilter('ETFs');
        setPlatformFilter('All');
      } else if (hash === '#etfs-both') {
        setTypeFilter('ETFs');
        setPlatformFilter('Both');
      } else if (hash === '#etfs-ondo') {
        setTypeFilter('ETFs');
        setPlatformFilter('Ondo');
      } else if (hash === '#etfs-xstocks') {
        setTypeFilter('ETFs');
        setPlatformFilter('xStocks');
      } else if (hash === '#stocks') {
        setTypeFilter('Stocks');
        setPlatformFilter('All');
      } else if (hash === '#ondo') {
        setTypeFilter('All');
        setPlatformFilter('Ondo');
      } else if (hash === '#xstocks') {
        setTypeFilter('All');
        setPlatformFilter('xStocks');
      } else if (hash === '#both') {
        setTypeFilter('All');
        setPlatformFilter('Both');
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const filtered = useMemo(() => {
    let result = assets;

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.ticker.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          (a.isin && a.isin.toLowerCase().includes(q)) ||
          a.platforms.ondo?.tokenSymbol?.toLowerCase().includes(q) ||
          a.platforms.xstocks?.tokenSymbol?.toLowerCase().includes(q)
      );
    }

    // Type
    if (typeFilter === 'Stocks') result = result.filter((a) => a.type === 'Stock');
    if (typeFilter === 'ETFs') result = result.filter((a) => a.type === 'ETF');

    // Platform
    if (platformFilter === 'Ondo') result = result.filter((a) => a.platforms.ondo);
    if (platformFilter === 'xStocks') result = result.filter((a) => a.platforms.xstocks);
    if (platformFilter === 'Both')
      result = result.filter((a) => a.platforms.ondo && a.platforms.xstocks);

    return result;
  }, [assets, searchQuery, typeFilter, platformFilter]);

  const counts = useMemo(
    () => ({
      total: assets.length,
      stocks: assets.filter((a) => a.type === 'Stock').length,
      etfs: assets.filter((a) => a.type === 'ETF').length,
      ondo: assets.filter((a) => a.platforms.ondo).length,
      xstocks: assets.filter((a) => a.platforms.xstocks).length,
      both: assets.filter((a) => a.platforms.ondo && a.platforms.xstocks).length,
    }),
    [assets]
  );

  const showingText = ocm.showingAssets
    ?.replace('{count}', filtered.length.toString())
    ?.replace('{total}', assets.length.toString())
    || `Showing ${filtered.length} of ${assets.length} assets`;

  const labelNoAssets = ocm.noAssetsFound || 'No assets match your filters';

  return (
    <>
      <FilterBar
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        platformFilter={platformFilter}
        onTypeChange={setTypeFilter}
        onPlatformChange={setPlatformFilter}
        counts={counts}
      />

      <div className="results-count" style={{ marginBottom: 16, textAlign: 'right' }}>
        {showingText}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-text">{labelNoAssets}</div>
        </div>
      ) : (
        <div className="asset-grid">
          {filtered.map((asset) => (
            <AssetCard key={asset.id} asset={asset} onClick={setSelectedAsset} />
          ))}
        </div>
      )}

      {selectedAsset && (
        <AssetModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
      )}
    </>
  );
}
