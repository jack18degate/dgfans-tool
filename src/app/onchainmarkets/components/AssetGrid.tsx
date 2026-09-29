'use client';

import React, { useState, useMemo, useEffect } from 'react';
import FilterBar from './FilterBar';
import AssetCard, { Asset } from './AssetCard';
import AssetModal from './AssetModal';
import { useI18n } from '../../i18n';

interface AssetGridProps {
  assets: Asset[];
  metadata: any;
  initialPlatformFilter?: string;
  initialTypeFilter?: string;
}

export default function AssetGrid({
  assets,
  metadata,
  initialPlatformFilter = 'All',
  initialTypeFilter = 'All',
}: AssetGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState(initialTypeFilter);
  const [platformFilter, setPlatformFilter] = useState(initialPlatformFilter);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const { t } = useI18n();
  const ocm = (t as any).onchainmarkets || {};

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (!hash) return;

      if (hash === '#robinhood' || hash === '#rh') {
        setPlatformFilter('Robinhood');
        setTypeFilter('All');
      } else if (hash === '#ondo') {
        setPlatformFilter('Ondo');
        setTypeFilter('All');
      } else if (hash === '#xstocks') {
        setPlatformFilter('xStocks');
        setTypeFilter('All');
      } else if (hash === '#both' || hash === '#multichain' || hash === '#crossplatform') {
        setPlatformFilter('Both');
        setTypeFilter('All');
      } else if (hash === '#etfs' || hash === '#etfall') {
        setTypeFilter('ETFs');
        setPlatformFilter('All');
      } else if (hash === '#stocks') {
        setTypeFilter('Stocks');
        setPlatformFilter('All');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const counts = useMemo(
    () => ({
      total: assets.length,
      stocks: assets.filter((a) => a.type === 'Stock').length,
      etfs: assets.filter((a) => a.type === 'ETF').length,
      robinhood: assets.filter((a) => a.platforms.robinhood).length,
      ondo: assets.filter((a) => a.platforms.ondo).length,
      xstocks: assets.filter((a) => a.platforms.xstocks).length,
      both: assets.filter((a) => {
        const c =
          (a.platforms.ondo ? 1 : 0) +
          (a.platforms.xstocks ? 1 : 0) +
          (a.platforms.robinhood ? 1 : 0);
        return c > 1;
      }).length,
    }),
    [assets]
  );

  const filtered = useMemo(() => {
    let result = assets;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.ticker.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          (a.isin && a.isin.toLowerCase().includes(q)) ||
          a.platforms.robinhood?.tokenSymbol?.toLowerCase().includes(q) ||
          a.platforms.robinhood?.tokenName?.toLowerCase().includes(q) ||
          a.platforms.ondo?.tokenSymbol?.toLowerCase().includes(q) ||
          a.platforms.xstocks?.tokenSymbol?.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (typeFilter === 'Stocks') result = result.filter((a) => a.type === 'Stock');
    if (typeFilter === 'ETFs') result = result.filter((a) => a.type === 'ETF');

    // Platform filter
    if (platformFilter === 'Robinhood') result = result.filter((a) => a.platforms.robinhood);
    if (platformFilter === 'Ondo') result = result.filter((a) => a.platforms.ondo);
    if (platformFilter === 'xStocks') result = result.filter((a) => a.platforms.xstocks);
    if (platformFilter === 'Both') {
      result = result.filter((a) => {
        const c =
          (a.platforms.ondo ? 1 : 0) +
          (a.platforms.xstocks ? 1 : 0) +
          (a.platforms.robinhood ? 1 : 0);
        return c > 1;
      });
    }

    return result;
  }, [assets, searchQuery, typeFilter, platformFilter]);

  const showingText =
    ocm.showingAssets
      ?.replace('{count}', filtered.length.toLocaleString())
      ?.replace('{total}', assets.length.toLocaleString()) ||
    `Showing ${filtered.length} of ${assets.length} assets`;

  const labelNoAssets = ocm.noAssetsFound || 'No assets match your filters';
  const labelClearSearch = ocm.clearSearch || 'Reset filters';

  const isFiltered = searchQuery !== '' || typeFilter !== 'All' || platformFilter !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    setTypeFilter('All');
    setPlatformFilter('All');
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname);
    }
  };

  return (
    <>
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        platformFilter={platformFilter}
        onTypeChange={setTypeFilter}
        onPlatformChange={setPlatformFilter}
        counts={counts}
      />

      <div className="results-header-row">
        <div className="results-count">{showingText}</div>
        {isFiltered && (
          <button type="button" className="btn-reset-filters" onClick={resetAllFilters}>
            ✕ {labelClearSearch}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-text">{labelNoAssets}</div>
          {isFiltered && (
            <button type="button" className="btn-empty-reset" onClick={resetAllFilters}>
              {labelClearSearch}
            </button>
          )}
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
