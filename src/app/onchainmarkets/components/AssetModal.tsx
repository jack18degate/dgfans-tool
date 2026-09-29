'use client';

import React, { useEffect, useState, useRef } from 'react';
import SwapStatus from './SwapStatus';
import { Asset } from './AssetCard';
import { useI18n } from '../../i18n';
import Link from 'next/link';

interface AssetModalProps {
  asset: Asset;
  onClose: () => void;
}

export default function AssetModal({ asset, onClose }: AssetModalProps) {
  const [swapResults, setSwapResults] = useState<Record<string, any>>({});
  const [logoError, setLogoError] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
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

  // Swap quote checks for Ethereum (Ondo) and Solana (xStocks)
  useEffect(() => {
    const controller = new AbortController();
    const platformsToCheck = [];
    if (asset.platforms.ondo) platformsToCheck.push(['ondo', asset.platforms.ondo]);
    if (asset.platforms.xstocks) platformsToCheck.push(['xstocks', asset.platforms.xstocks]);

    const initial: Record<string, { status: string }> = {};
    platformsToCheck.forEach(([p]) => {
      initial[p as string] = { status: 'LOADING' };
    });
    setSwapResults(initial);

    (async () => {
      for (const [platform, info] of platformsToCheck) {
        if (!info) continue;
        if (controller.signal.aborted) break;
        try {
          const params = new URLSearchParams({
            address: (info as any).address,
            chain: (info as any).chain,
            symbol: (info as any).tokenSymbol,
          });
          const res = await fetch(`/api/check-swap?${params}`, {
            signal: controller.signal,
          });
          const data = await res.json();
          setSwapResults((prev) => ({ ...prev, [platform as string]: data }));
        } catch (err: any) {
          if (err.name !== 'AbortError') {
            setSwapResults((prev) => ({
              ...prev,
              [platform as string]: { status: 'ERROR', details: 'Request failed' },
            }));
          }
        }
      }
    })();

    return () => controller.abort();
  }, [asset]);

  const copyToClipboard = (text: string, key: string) => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2000);
  };

  const degateLink = (address: string, chain: string) =>
    `https://app.degate.com/en/swap/USDC/${address}?chain=${chain}&utm_source=dgtools`;

  const showLogo = asset.logo && !logoError;

  const labelDetails = ocm.details || 'Details';
  const labelDescription = ocm.description || 'Description';
  const labelSwapCheck = ocm.swapCheckTitle || 'Swap Check ($100 USDC)';
  const labelBuyOnDegate = ocm.buyOnDegate || 'Trade on DeGate';
  const labelContractAddresses = ocm.contractAddresses || 'Supported Networks & Contracts';
  const labelBuyOnEthereum = ocm.buyOnEthereum?.replace('{ticker}', asset.ticker) || `⟠ Trade ${asset.ticker} on Ethereum`;
  const labelBuyOnSolana = ocm.buyOnSolana?.replace('{ticker}', asset.ticker) || `◎ Trade ${asset.ticker} on Solana`;
  const labelCopied = ocm.copied || 'Copied! ✓';
  const labelCopy = ocm.copyAddress || 'Copy';
  const labelExplorer = ocm.viewExplorer || 'Explorer ↗';

  const platformCount = (asset.platforms.ondo ? 1 : 0) +
    (asset.platforms.xstocks ? 1 : 0) +
    (asset.platforms.robinhood ? 1 : 0);

  const rhPlatform = asset.platforms.robinhood;
  const rhMultiplier = rhPlatform?.multiplier;
  const hasDividendGrowth = rhMultiplier && parseFloat(rhMultiplier) > 1.000001;

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="modal-content">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close dialog"
          title="Close (Esc)"
        >
          ✕
        </button>

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
            <div className="modal-subtitle-row">
              <span className="modal-ticker">{asset.ticker}</span>
              <span className={`badge ${asset.type === 'ETF' ? 'badge-etf' : 'badge-stock'}`}>
                {asset.type}
              </span>
              {platformCount > 1 && (
                <span className="badge badge-multichain">
                  {platformCount} Chains
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Overview Stats */}
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
            {rhPlatform && (
              <div className="modal-info-item modal-info-rh">
                <div className="modal-info-label">Robinhood Chain</div>
                <div className="modal-info-value">
                  <span className="rh-status-dot" /> Active (24/5 + Overnight)
                </div>
              </div>
            )}
            {hasDividendGrowth && (
              <div className="modal-info-item modal-info-multiplier">
                <div className="modal-info-label">{ocm.multiplier || 'Dividend Multiplier'}</div>
                <div className="modal-info-value">
                  {parseFloat(rhMultiplier).toFixed(6)}x
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {asset.description && (
          <div className="modal-section">
            <div className="modal-section-title">{labelDescription}</div>
            <p className="modal-description">
              {asset.description.length > 280
                ? asset.description.slice(0, 280) + '...'
                : asset.description}
            </p>
          </div>
        )}

        {/* Multi-Chain Deployments & Contracts */}
        <div className="modal-section">
          <div className="modal-section-title">{labelContractAddresses}</div>
          <div className="platform-cards-list">

            {/* Robinhood Chain Deployment */}
            {rhPlatform && (
              <div className="platform-card platform-card-robinhood">
                <div className="platform-card-header">
                  <div className="platform-brand">
                    <span className="platform-indicator rh-indicator" />
                    <strong>Robinhood Chain</strong>
                    <span className="platform-chain-tag">Arbitrum Nitro L2 (4663)</span>
                  </div>
                  <span className="badge badge-robinhood">{rhPlatform.tokenSymbol}</span>
                </div>

                <div className="platform-contract-row">
                  <code className="platform-address" title={rhPlatform.address}>
                    {rhPlatform.address}
                  </code>
                  <div className="platform-actions">
                    <button
                      type="button"
                      className={`btn-copy ${copiedKey === 'rh' ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(rhPlatform.address, 'rh')}
                      title={labelCopy}
                    >
                      {copiedKey === 'rh' ? labelCopied : '📋 ' + labelCopy}
                    </button>
                    <a
                      href={rhPlatform.explorerUrl || `https://robinhoodchain.blockscout.com/token/${rhPlatform.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-explorer"
                    >
                      {labelExplorer}
                    </a>
                  </div>
                </div>

                <div className="platform-card-footer">
                  <span>🟢 24/5 Market &amp; Overnight Trading</span>
                  <Link href="/onchainstocks" className="rh-guide-link">
                    Guida Azioni On-Chain ↗
                  </Link>
                </div>
              </div>
            )}

            {/* Ethereum (Ondo) Deployment */}
            {asset.platforms.ondo && (
              <div className="platform-card platform-card-ondo">
                <div className="platform-card-header">
                  <div className="platform-brand">
                    <span className="platform-indicator ondo-indicator" />
                    <strong>Ondo Finance</strong>
                    <span className="platform-chain-tag">Ethereum Mainnet</span>
                  </div>
                  <span className="badge badge-ondo">{asset.platforms.ondo.tokenSymbol}</span>
                </div>

                <div className="platform-contract-row">
                  <code className="platform-address" title={asset.platforms.ondo.address}>
                    {asset.platforms.ondo.address}
                  </code>
                  <div className="platform-actions">
                    <button
                      type="button"
                      className={`btn-copy ${copiedKey === 'ondo' ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(asset.platforms.ondo!.address, 'ondo')}
                      title={labelCopy}
                    >
                      {copiedKey === 'ondo' ? labelCopied : '📋 ' + labelCopy}
                    </button>
                    <a
                      href={`https://etherscan.io/token/${asset.platforms.ondo.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-explorer"
                    >
                      {labelExplorer}
                    </a>
                  </div>
                </div>

                {/* Swap Status */}
                <div className="platform-swap-row">
                  <span className="swap-source-label">CowSwap Quote ($100 USDC):</span>
                  <SwapStatus
                    status={swapResults.ondo?.status || 'LOADING'}
                    details={swapResults.ondo?.details}
                    priceUsd={swapResults.ondo?.priceUsd}
                  />
                </div>
              </div>
            )}

            {/* Solana (xStocks) Deployment */}
            {asset.platforms.xstocks && (
              <div className="platform-card platform-card-xstocks">
                <div className="platform-card-header">
                  <div className="platform-brand">
                    <span className="platform-indicator xstocks-indicator" />
                    <strong>xStocks (Backed)</strong>
                    <span className="platform-chain-tag">Solana</span>
                  </div>
                  <span className="badge badge-xstocks">{asset.platforms.xstocks.tokenSymbol}</span>
                </div>

                <div className="platform-contract-row">
                  <code className="platform-address" title={asset.platforms.xstocks.address}>
                    {asset.platforms.xstocks.address}
                  </code>
                  <div className="platform-actions">
                    <button
                      type="button"
                      className={`btn-copy ${copiedKey === 'xstocks' ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(asset.platforms.xstocks!.address, 'xstocks')}
                      title={labelCopy}
                    >
                      {copiedKey === 'xstocks' ? labelCopied : '📋 ' + labelCopy}
                    </button>
                    <a
                      href={`https://solscan.io/token/${asset.platforms.xstocks.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-explorer"
                    >
                      {labelExplorer}
                    </a>
                  </div>
                </div>

                {/* Swap Status */}
                <div className="platform-swap-row">
                  <span className="swap-source-label">Jupiter Quote ($100 USDC):</span>
                  <SwapStatus
                    status={swapResults.xstocks?.status || 'LOADING'}
                    details={swapResults.xstocks?.details}
                    priceUsd={swapResults.xstocks?.priceUsd}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DeGate Trading Buttons */}
        {(asset.platforms.ondo || asset.platforms.xstocks) && (
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
                  {labelBuyOnEthereum} ↗
                </a>
              )}
              {asset.platforms.xstocks && (
                <a
                  href={degateLink(asset.platforms.xstocks.address, 'solana')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="buy-btn buy-btn-sol"
                >
                  {labelBuyOnSolana} ↗
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
