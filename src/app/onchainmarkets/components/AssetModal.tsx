'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Asset } from './AssetCard';
import { useI18n } from '../../i18n';

interface AssetModalProps {
  asset: Asset;
  onClose: () => void;
}

export default function AssetModal({ asset, onClose }: AssetModalProps) {
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

  const copyToClipboard = (text: string, key: string) => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2000);
  };

  const showLogo = asset.logo && !logoError;

  const labelCopy = ocm.copyAddress || 'Copia';
  const labelCopied = ocm.copied || 'Copiato ✓';
  const labelBuyEth = ocm.buyOnDegateEth || 'Acquista su DeGate (Ethereum) ↗';
  const labelBuySol = ocm.buyOnDegateSol || 'Acquista su DeGate (Solana) ↗';
  const labelBuyRh = ocm.buyOnRobinhood || 'Acquista su Robinhood ↗';
  const labelContracts = ocm.contractAddresses || 'Contratti (CA)';
  const labelDescription = ocm.description || 'Descrizione';

  const degateEthLink = asset.platforms.ondo
    ? `https://app.degate.com/en/swap/USDC/${asset.platforms.ondo.address}?chain=ethereum&utm_source=dgfans`
    : null;

  const degateSolLink = asset.platforms.xstocks
    ? `https://app.degate.com/en/swap/USDC/${asset.platforms.xstocks.address}?chain=solana&utm_source=dgfans`
    : null;

  const robinhoodLink = `https://robinhood.com/stocks/${asset.ticker}`;

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="modal-content modal-minimal">
        {/* Mobile Drag Handle */}
        <div className="modal-drag-handle" />

        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Chiudi"
          title="Chiudi (Esc)"
        >
          ✕
        </button>

        {/* 1. Titolo */}
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
            </div>
          </div>
        </div>

        {/* 2. Link per acquistare (Ethereum -> Solana -> Robinhood) */}
        <div className="modal-buy-section">
          {degateEthLink && (
            <a
              href={degateEthLink}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-buy-btn modal-buy-eth"
            >
              <span>{labelBuyEth}</span>
            </a>
          )}

          {degateSolLink && (
            <a
              href={degateSolLink}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-buy-btn modal-buy-sol"
            >
              <span>{labelBuySol}</span>
            </a>
          )}

          {asset.platforms.robinhood && (
            <a
              href={robinhoodLink}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-buy-btn modal-buy-rh"
            >
              <span>{labelBuyRh}</span>
            </a>
          )}
        </div>

        {/* 3. ISIN (Sotto i link di acquisto) */}
        {asset.isin && (
          <div className="modal-isin-bar">
            <span className="isin-label">ISIN:</span>
            <code className="isin-code">{asset.isin}</code>
            <button
              type="button"
              className={`btn-isin-copy ${copiedKey === 'isin' ? 'copied' : ''}`}
              onClick={() => copyToClipboard(asset.isin, 'isin')}
              title="Copia ISIN"
            >
              {copiedKey === 'isin' ? labelCopied : labelCopy}
            </button>
          </div>
        )}

        {/* 4. Contratti (CA): essenziali, solo Chain e CA */}
        <div className="modal-section-clean">
          <div className="modal-clean-title">{labelContracts}</div>
          <div className="modal-ca-clean-list">
            {asset.platforms.ondo && (
              <div className="ca-clean-row">
                <span className="ca-clean-chain">Ethereum</span>
                <code className="ca-clean-address" title={asset.platforms.ondo.address}>
                  {asset.platforms.ondo.address}
                </code>
                <div className="ca-clean-actions">
                  <button
                    type="button"
                    className={`btn-ca-clean-copy ${copiedKey === 'ondo' ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(asset.platforms.ondo!.address, 'ondo')}
                    title={labelCopy}
                  >
                    {copiedKey === 'ondo' ? labelCopied : labelCopy}
                  </button>
                  <a
                    href={`https://etherscan.io/token/${asset.platforms.ondo.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ca-clean-link"
                    title="Etherscan"
                  >
                    ↗
                  </a>
                </div>
              </div>
            )}

            {asset.platforms.xstocks && (
              <div className="ca-clean-row">
                <span className="ca-clean-chain">Solana</span>
                <code className="ca-clean-address" title={asset.platforms.xstocks.address}>
                  {asset.platforms.xstocks.address}
                </code>
                <div className="ca-clean-actions">
                  <button
                    type="button"
                    className={`btn-ca-clean-copy ${copiedKey === 'xstocks' ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(asset.platforms.xstocks!.address, 'xstocks')}
                    title={labelCopy}
                  >
                    {copiedKey === 'xstocks' ? labelCopied : labelCopy}
                  </button>
                  <a
                    href={`https://solscan.io/token/${asset.platforms.xstocks.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ca-clean-link"
                    title="Solscan"
                  >
                    ↗
                  </a>
                </div>
              </div>
            )}

            {asset.platforms.robinhood && (
              <div className="ca-clean-row">
                <span className="ca-clean-chain">Robinhood Chain</span>
                <code className="ca-clean-address" title={asset.platforms.robinhood.address}>
                  {asset.platforms.robinhood.address}
                </code>
                <div className="ca-clean-actions">
                  <button
                    type="button"
                    className={`btn-ca-clean-copy ${copiedKey === 'rh' ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(asset.platforms.robinhood!.address, 'rh')}
                    title={labelCopy}
                  >
                    {copiedKey === 'rh' ? labelCopied : labelCopy}
                  </button>
                  <a
                    href={asset.platforms.robinhood.explorerUrl || `https://robinhoodchain.blockscout.com/token/${asset.platforms.robinhood!.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ca-clean-link"
                    title="Blockscout"
                  >
                    ↗
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5. Descrizione */}
        {asset.description && (
          <div className="modal-section-clean">
            <div className="modal-clean-title">{labelDescription}</div>
            <p className="modal-clean-desc">{asset.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
