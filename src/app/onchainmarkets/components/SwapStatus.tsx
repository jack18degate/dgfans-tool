'use client';

import React from 'react';
import { useI18n } from '../../i18n';

interface SwapStatusProps {
  status: string;
  details?: string;
  priceUsd?: number | null;
}

export default function SwapStatus({ status, details, priceUsd }: SwapStatusProps) {
  const { t } = useI18n();

  const getStatusLabel = (s: string) => {
    // Falls back to safe default if translation doesn't exist
    const ocm = (t as any).onchainmarkets || {};
    switch (s) {
      case 'LOADING':
        return ocm.checkingSwap || 'Checking swap...';
      case 'SWAPPABLE':
        return ocm.swappable || 'Swappable';
      case 'MARKET_CLOSED':
        return ocm.marketClosed || 'Market Closed';
      case 'NO_LIQUIDITY':
        return ocm.noLiquidity || 'No Liquidity';
      case 'NOT_TRADABLE':
        return ocm.notTradable || 'Not Tradable';
      case 'NO_ROUTE':
        return ocm.noRoute || 'No Route';
      case 'ERROR':
      default:
        return ocm.checkFailed || 'Check Failed';
    }
  };

  const config: Record<string, { icon: React.ReactNode; cls: string; spinner?: boolean }> = {
    LOADING:        { icon: null, cls: 'loading', spinner: true },
    SWAPPABLE:      { icon: '✅', cls: 'swappable' },
    MARKET_CLOSED:  { icon: '🕐', cls: 'market-closed' },
    NO_LIQUIDITY:   { icon: '❌', cls: 'no-liquidity' },
    NOT_TRADABLE:   { icon: '⛔', cls: 'not-tradable' },
    NO_ROUTE:       { icon: '❌', cls: 'no-liquidity' },
    ERROR:          { icon: '⚠️', cls: 'error' },
  };

  const c = config[status] || config.ERROR;

  return (
    <div>
      <span className={`swap-status ${c.cls}`}>
        {c.spinner ? <span className="spinner" /> : c.icon}
        {' '}{getStatusLabel(status)}
      </span>
      {priceUsd && <div className="swap-price">≈ ${Number(priceUsd).toFixed(2)}</div>}
    </div>
  );
}
