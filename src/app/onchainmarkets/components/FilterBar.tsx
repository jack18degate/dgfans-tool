'use client';

import React from 'react';
import { useI18n } from '../../i18n';
import { TRENDING_SEARCHES } from '@/lib/constants.js';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: string;
  platformFilter: string;
  onTypeChange: (type: string) => void;
  onPlatformChange: (platform: string) => void;
  counts: {
    total: number;
    stocks: number;
    etfs: number;
    ondo: number;
    xstocks: number;
    robinhood: number;
    both: number;
  };
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  typeFilter,
  platformFilter,
  onTypeChange,
  onPlatformChange,
  counts,
}: FilterBarProps) {
  const { t } = useI18n();
  const ocm = (t as any).onchainmarkets || {};

  const searchPlaceholder = ocm.searchPlaceholder || 'Search by ticker, company, or ISIN (e.g. SpaceX, Apple, Oro)...';
  const labelAll = ocm.all || 'All';
  const labelStocks = ocm.stocks || 'Stocks';
  const labelEtfs = ocm.etfs || 'ETFs';
  const labelRobinhood = ocm.robinhood || 'Robinhood';
  const labelBoth = ocm.crossPlatform || ocm.both || 'Cross-Platform';
  const labelClear = ocm.clearSearch || 'Clear';
  const labelPopular = ocm.popularSearches || 'Ricerche rapide';

  return (
    <div className="filter-bar">
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label={searchPlaceholder}
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            aria-label={labelClear}
            title={labelClear}
          >
            ✕
          </button>
        )}
      </div>

      {/* Trending / Popular Quick Searches */}
      <div className="trending-chips-row">
        <span className="trending-label">{labelPopular}:</span>
        <div className="trending-chips-scroll">
          {TRENDING_SEARCHES.map((chip) => {
            const isChipActive = searchQuery.toUpperCase() === chip.query.toUpperCase();
            return (
              <button
                key={chip.query}
                type="button"
                className={`trending-chip ${isChipActive ? 'active' : ''}`}
                onClick={() => onSearchChange(isChipActive ? '' : chip.query)}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter-controls-row">
        <div className="filter-group type-filter-group">
          {[
            { key: 'All', label: `${labelAll} (${counts.total})` },
            { key: 'Stocks', label: `${labelStocks} (${counts.stocks})` },
            { key: 'ETFs', label: `${labelEtfs} (${counts.etfs})` },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              className={`filter-pill ${typeFilter === item.key ? 'active' : ''}`}
              onClick={() => onTypeChange(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="filter-group platform-filter-group">
          {[
            { key: 'All', label: labelAll },
            { key: 'Robinhood', label: `${labelRobinhood} (${counts.robinhood})` },
            { key: 'Ondo', label: `Ondo (${counts.ondo})` },
            { key: 'xStocks', label: `xStocks (${counts.xstocks})` },
            { key: 'Both', label: `${labelBoth} (${counts.both})` },
          ].map((item) => {
            const isActive = platformFilter === item.key;
            let cls = 'filter-pill';
            if (isActive) {
              if (item.key === 'Robinhood') cls += ' active-robinhood';
              else if (item.key === 'Ondo') cls += ' active-ondo';
              else if (item.key === 'xStocks') cls += ' active-xstocks';
              else if (item.key === 'Both') cls += ' active-both';
              else cls += ' active';
            }
            return (
              <button
                key={item.key}
                type="button"
                className={cls}
                onClick={() => onPlatformChange(item.key)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
