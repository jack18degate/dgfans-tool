'use client';

import React, { useEffect, useState, useRef } from 'react';
import SwapStatus from './SwapStatus';
import { Asset } from './AssetCard';
import { useI18n } from '../../i18n';

interface AssetModalProps {
  asset: Asset;
  onClose: () => void;
}

export default function AssetModal({ asset, onClose }: AssetModalProps) {
  const [swapResults, setSwapResults] = useState<Record<string, any>>({});
  const [logoError, setLogoError] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const ocm = (t as any).onchainmarkets || {};

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const platforms = Object.entries(asset.platforms);

    const initial: Record<string, { status: string }> = {};
    platforms.forEach(([platform]) => {
      initial[platform] = { status: 'LOADING' };
    });
    setSwapResults(initial);

    (async () => {
      for (const [platform, info] of platforms) {
        if (!info) continue;
        if (controller.signal.aborted) break;
        try {
          const params = new URLSearchParams({
            address: info.address,
            chain: info.chain,
            symbol: info.tokenSymbol,
          });
          const res = await fetch(`/api/check-swap?${params}`, {
            signal: controller.signal,
          });
          const data = await res.json();
          setSwapResults((prev) => ({ ...prev, [platform]: data }));
        } catch (err: any) {
          if (err.name !== 'AbortError') {
            setSwapResults((prev) => ({
              ...prev,
              [platform]: { status: 'ERROR', details: 'Request failed' },
            }));
          }
        }
      }
    })();

    return () => controller.abort();
  }, [asset]);

  const degateLink = (address: string, chain: string) =>
    `https://app.degate.com/en/swap/USDC/${address}?chain=${chain}&utm_source=dgtools`;

  const showLogo = asset.logo && !logoError;

  const labelDetails = ocm.details || 'Details';
  const labelDescription = ocm.description || 'Description';
  const labelSwapCheck = ocm.swapCheckTitle || 'Swap Check ($100 USDC)';
  const labelBuyOnDegate = ocm.buyOnDegate || 'Buy on DeGate';
  const labelContractAddresses = ocm.contractAddresses || 'Contract Addresses';
  const labelBuyOnEthereum = ocm.buyOnEthereum?.replace('{ticker}', asset.ticker) || `⟠ Buy ${asset.ticker} on Ethereum`;
  const labelBuyOnSolana = ocm.buyOnSolana?.replace('{ticker}', asset.ticker) || `◎ Buy ${asset.ticker} on Solana`;

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="modal-header">
          {showLogo ? (
            <img
              src={asset.logo}
              alt={asset.ticker}
              className="modal-logo"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="modal-logo-fallback">{asset.ticker.slice(0, 2)}</div>
          )}
          <div className="modal-title-group">
            <h2>{asset.name}</h2>
            <span className="modal-ticker">
              {asset.ticker}
              {' '}
              <span className={`badge ${asset.type === 'ETF' ? 'badge-etf' : 'badge-stock'}`}>
                {asset.type}
              </span>
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="modal-section">
          <div className="modal-section-title">{labelDetails}</div>
          <div className="modal-info-grid">
            {asset.isin && (
              <div className="modal-info-item">
                <div className="modal-info-label">ISIN</div>
                <div className="modal-info-value">{asset.isin}</div>
              </div>
            )}
            {asset.sector && (
              <div className="modal-info-item">
                <div className="modal-info-label">Sector</div>
                <div className="modal-info-value">{asset.sector}</div>
              </div>
            )}
            {asset.platforms.ondo && (
              <div className="modal-info-item">
                <div className="modal-info-label">Ondo Token</div>
                <div className="modal-info-value">{asset.platforms.ondo.tokenSymbol}</div>
              </div>
            )}
            {asset.platforms.xstocks && (
              <div className="modal-info-item">
                <div className="modal-info-label">xStocks Token</div>
                <div className="modal-info-value">{asset.platforms.xstocks.tokenSymbol}</div>
              </div>
            )}
          </div>
        </div>

        {asset.description && (
          <div className="modal-section">
            <div className="modal-section-title">{labelDescription}</div>
            <p className="modal-description">
              {asset.description.length > 200
                ? asset.description.slice(0, 200) + '...'
                : asset.description}
            </p>
          </div>
        )}

        {/* Swap Check */}
        <div className="modal-section">
          <div className="modal-section-title">{labelSwapCheck}</div>
          {asset.platforms.ondo && (
            <div className="swap-check-row">
              <div className="swap-check-label">
                <span className="badge badge-ondo">Ondo</span>
                Ethereum
              </div>
              <SwapStatus
                status={swapResults.ondo?.status || 'LOADING'}
                details={swapResults.ondo?.details}
                priceUsd={swapResults.ondo?.priceUsd}
              />
            </div>
          )}
          {asset.platforms.xstocks && (
            <div className="swap-check-row">
              <div className="swap-check-label">
                <span className="badge badge-xstocks">xStocks</span>
                Solana
              </div>
              <SwapStatus
                status={swapResults.xstocks?.status || 'LOADING'}
                details={swapResults.xstocks?.details}
                priceUsd={swapResults.xstocks?.priceUsd}
              />
            </div>
          )}
        </div>

        {/* Buy Buttons */}
        <div className="modal-section">
          <div className="modal-section-title">{labelBuyOnDegate}</div>
          <div className="buy-buttons">
            {asset.platforms.ondo && (
              <a
                href={degateLink(asset.platforms.ondo.address, 'ethereum')}
                target="_blank"
                rel="noopener noreferrer"
                className="buy-btn buy-btn-eth"
              >
                {labelBuyOnEthereum}
              </a>
            )}
            {asset.platforms.xstocks && (
              <a
                href={degateLink(asset.platforms.xstocks.address, 'solana')}
                target="_blank"
                rel="noopener noreferrer"
                className="buy-btn buy-btn-sol"
              >
                {labelBuyOnSolana}
              </a>
            )}
          </div>
        </div>

        {/* Contract Addresses */}
        <div className="modal-section">
          <div className="modal-section-title">{labelContractAddresses}</div>
          {asset.platforms.ondo && (
            <div className="modal-info-item" style={{ marginBottom: 8 }}>
              <div className="modal-info-label">Ethereum (Ondo)</div>
              <div className="modal-info-value" style={{ fontSize: '0.72rem' }}>
                {asset.platforms.ondo.address}
              </div>
            </div>
          )}
          {asset.platforms.xstocks && (
            <div className="modal-info-item">
              <div className="modal-info-label">Solana (xStocks)</div>
              <div className="modal-info-value" style={{ fontSize: '0.72rem' }}>
                {asset.platforms.xstocks.address}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
