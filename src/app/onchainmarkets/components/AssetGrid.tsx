'use client';

import React, { useState, useMemo, useEffect } from 'react';
import FilterBar from './FilterBar';
import AssetCard, { Asset } from './AssetCard';
import AssetModal from './AssetModal';
import { useI18n } from '../../i18n';
import { ASSET_ALIASES, TOP_FAMOUS_TICKERS } from '@/lib/constants.js';

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

  // Parse URL search params on mount or when assets load (e.g. ?q=apple or ?ticker=SPCX)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlQuery = params.get('q') || params.get('search');
      if (urlQuery && !searchQuery) {
        setSearchQuery(urlQuery);
      }

      const targetTicker = params.get('ticker') || params.get('asset');
      if (targetTicker && assets.length > 0) {
        const match = assets.find(
          (a) => a.ticker.toUpperCase() === targetTicker.toUpperCase()
        );
        if (match) setSelectedAsset(match);
      }
    } catch {
      /* ignore SSR */
    }
  }, [assets]);

  // Handle URL hash navigation (e.g. #robinhood, #ondo, #xstocks)
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

    // Advanced search query filter (with synonyms & aliases)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();

      // Find any tickers matching aliases
      const aliasTickers = new Set<string>();
      for (const [k, v] of Object.entries(ASSET_ALIASES)) {
        if (k.includes(q) || q.includes(k)) {
          v.forEach((t) => aliasTickers.add(t.toUpperCase()));
        }
      }

      result = result.filter((a) => {
        const tUpper = a.ticker.toUpperCase();
        if (aliasTickers.has(tUpper)) return true;
        if (a.ticker.toLowerCase().includes(q)) return true;
        if (a.name.toLowerCase().includes(q)) return true;
        if (a.isin && a.isin.toLowerCase().includes(q)) return true;
        if (a.platforms.robinhood?.tokenSymbol?.toLowerCase().includes(q)) return true;
        if (a.platforms.robinhood?.tokenName?.toLowerCase().includes(q)) return true;
        if (a.platforms.robinhood?.address?.toLowerCase().includes(q)) return true;
        if (a.platforms.ondo?.tokenSymbol?.toLowerCase().includes(q)) return true;
        if (a.platforms.ondo?.address?.toLowerCase().includes(q)) return true;
        if (a.platforms.xstocks?.tokenSymbol?.toLowerCase().includes(q)) return true;
        if (a.platforms.xstocks?.address?.toLowerCase().includes(q)) return true;
        return false;
      });
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

    // Sort: Top ~20 most famous stocks first, followed by all others alphabetically
    const famousRankMap = new Map(
      TOP_FAMOUS_TICKERS.map((t, idx) => [t.toUpperCase(), idx])
    );

    const sorted = [...result].sort((a, b) => {
      const tA = a.ticker.toUpperCase();
      const tB = b.ticker.toUpperCase();
      const rankA = famousRankMap.has(tA) ? famousRankMap.get(tA)! : 999999;
      const rankB = famousRankMap.has(tB) ? famousRankMap.get(tB)! : 999999;

      if (rankA !== rankB) {
        return rankA - rankB;
      }

      return a.ticker.localeCompare(b.ticker);
    });

    return sorted;
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

  const handleOpenAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('ticker', asset.ticker);
      history.replaceState(null, '', url.toString());
    } catch { /* ignore */ }
  };

  const handleCloseAsset = () => {
    setSelectedAsset(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('ticker');
      url.searchParams.delete('asset');
      history.replaceState(null, '', url.toString());
    } catch { /* ignore */ }
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
            <AssetCard key={asset.id} asset={asset} onClick={handleOpenAsset} />
          ))}
        </div>
      )}

      {selectedAsset && (
        <AssetModal asset={selectedAsset} onClose={handleCloseAsset} />
      )}
    </>
  );
}
