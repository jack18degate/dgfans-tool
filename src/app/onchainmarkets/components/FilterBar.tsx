'use client';

import React from 'react';
import { useI18n } from '../../i18n';

interface FilterBarProps {
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
    both: number;
  };
}

export default function FilterBar({
  onSearchChange,
  typeFilter,
  platformFilter,
  onTypeChange,
  onPlatformChange,
  counts,
}: FilterBarProps) {
  const { t } = useI18n();
  const ocm = (t as any).onchainmarkets || {};

  const searchPlaceholder = ocm.searchPlaceholder || 'Search by ticker, name, or ISIN...';
  const labelAll = ocm.all || 'All';
  const labelStocks = ocm.stocks || 'Stocks';
  const labelEtfs = ocm.etfs || 'ETFs';
  const labelBoth = ocm.both || 'Both';

  return (
    <div className="filter-bar">
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={searchPlaceholder}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-group">
        {[
          { key: 'All', label: `${labelAll} (${counts.total})` },
          { key: 'Stocks', label: `${labelStocks} (${counts.stocks})` },
          { key: 'ETFs', label: `${labelEtfs} (${counts.etfs})` }
        ].map((item) => (
          <button
            key={item.key}
            className={`filter-pill ${typeFilter === item.key ? 'active' : ''}`}
            onClick={() => onTypeChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="filter-group">
        {[
          { key: 'All', label: labelAll },
          { key: 'Ondo', label: `Ondo (${counts.ondo})` },
          { key: 'xStocks', label: `xStocks (${counts.xstocks})` },
          { key: 'Both', label: `${labelBoth} (${counts.both})` }
        ].map((item) => {
          const isActive = platformFilter === item.key;
          let cls = 'filter-pill';
          if (isActive && item.key === 'Ondo') cls += ' active-ondo';
          else if (isActive && item.key === 'xStocks') cls += ' active-xstocks';
          else if (isActive) cls += ' active';
          return (
            <button key={item.key} className={cls} onClick={() => onPlatformChange(item.key)}>
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
