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
  const [walletFeedback, setWalletFeedback] = useState<string | null>(null);
  const [showNetworkInfo, setShowNetworkInfo] = useState(false);
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

  const shareAssetCard = () => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/onchainmarkets?ticker=${asset.ticker}`;
    copyToClipboard(shareUrl, 'share');
  };

  const addTokenToMetaMask = async (address: string, symbol: string, decimals: number = 18, image?: string) => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const wasAdded = await (window as any).ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address,
              symbol,
              decimals,
              image: image || asset.logo,
            },
          },
        });
        if (wasAdded) {
          setWalletFeedback(ocm.tokenAdded || 'Token Aggiunto! ✓');
          setTimeout(() => setWalletFeedback(null), 3000);
        }
      } catch (err) {
        console.error('MetaMask watchAsset error:', err);
      }
    } else {
      setShowNetworkInfo(true);
    }
  };

  const addRobinhoodChainToMetaMask = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x1237', // 4663 in hex
              chainName: 'Robinhood Chain',
              nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://rpc.mainnet.chain.robinhood.com'],
              blockExplorerUrls: ['https://robinhoodchain.blockscout.com'],
            },
          ],
        });
        setWalletFeedback(ocm.networkAdded || 'Rete Aggiunta! ✓');
        setTimeout(() => setWalletFeedback(null), 3000);
      } catch (err) {
        console.error('MetaMask addEthereumChain error:', err);
      }
    } else {
      setShowNetworkInfo(true);
    }
  };

  const degateLink = (address: string, chain: string) =>
    `https://app.degate.com/en/swap/USDC/${address}?chain=${chain}&utm_source=dgfans`;

  const showLogo = asset.logo && !logoError;

  const labelDetails = ocm.details || 'Details';
  const labelDescription = ocm.description || 'Description';
  const labelContractAddresses = ocm.contractAddresses || 'Supported Networks & Contracts';
  const labelBuyOnEthereum = ocm.buyOnEthereum?.replace('{ticker}', asset.ticker) || `⟠ Trade ${asset.ticker} on Ethereum`;
  const labelBuyOnSolana = ocm.buyOnSolana?.replace('{ticker}', asset.ticker) || `◎ Trade ${asset.ticker} on Solana`;
  const labelCopied = ocm.copied || 'Copied! ✓';
  const labelCopy = ocm.copyAddress || 'Copy';
  const labelExplorer = ocm.viewExplorer || 'Explorer ↗';
  const labelAddToWallet = ocm.addToWallet || 'Add to Wallet';
  const labelAddNetwork = ocm.addNetwork || 'Add Robinhood Network';
  const labelShare = ocm.shareAsset || 'Share Asset';

  const platformCount = (asset.platforms.ondo ? 1 : 0) +
    (asset.platforms.xstocks ? 1 : 0) +
    (asset.platforms.robinhood ? 1 : 0);

  const rhPlatform = asset.platforms.robinhood;
  const isRobinhoodOnly = rhPlatform && !asset.platforms.ondo && !asset.platforms.xstocks;
  const rhMultiplier = rhPlatform?.multiplier;
  const hasDividendGrowth = rhMultiplier && parseFloat(rhMultiplier) > 1.000001;

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="modal-content">
        {/* Mobile Drag Handle */}
        <div className="modal-drag-handle" />

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
              {(asset.platforms.xstocks || asset.platforms.ondo) && (
                <span className="badge badge-degate-card">
                  ⚡ DeGate App
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Global Share & Wallet Feedback Row */}
        <div className="modal-quick-actions-row">
          <button
            type="button"
            className={`btn-share-card ${copiedKey === 'share' ? 'copied' : ''}`}
            onClick={shareAssetCard}
            title="Copy link to share this stock with clients"
          >
            {copiedKey === 'share' ? ocm.linkCopied || 'Link Copiato! ✓' : `🔗 ${labelShare}`}
          </button>
          {walletFeedback && (
            <span className="wallet-feedback-badge">{walletFeedback}</span>
          )}
        </div>

        {/* ⚡ HERO: ACQUISTO DIRETTO SU DEGATE APP */}
        <div className="degate-primary-buy-box">
          <div className="degate-primary-header">
            <div className="degate-brand-title">
              <span className="degate-badge-pulse">⚡</span>
              <div>
                <h3 className="degate-heading">
                  {ocm.buyDirectDegateApp || 'Acquista Subito su DeGate App'}
                </h3>
                <p className="degate-subheading">
                  {ocm.buyDirectDegateSubtitle || 'Scambia direttamente su DeGate App senza KYC e con custodia Web3'}
                </p>
              </div>
            </div>
            <span className="degate-app-badge">📱 Mobile &amp; Web App</span>
          </div>

          <div className="degate-primary-buttons">
            {/* Solana Buy Button (Recommended: Fast & Low Gas) */}
            {asset.platforms.xstocks && (
              <a
                href={degateLink(asset.platforms.xstocks.address, 'solana')}
                target="_blank"
                rel="noopener noreferrer"
                className="degate-hero-btn degate-hero-sol"
                id="degate-direct-buy-solana"
              >
                <div className="degate-hero-btn-left">
                  <span className="degate-hero-icon">⚡</span>
                  <div className="degate-hero-labels">
                    <span className="degate-hero-title">
                      {ocm.buyOnDegateSolana?.replace('{ticker}', asset.ticker) || `Acquista ${asset.ticker} su DeGate App (Solana)`}
                    </span>
                    <span className="degate-hero-subtitle">
                      ◎ Solana • Gas &lt;$0.01 • Esecuzione Immediata (Consigliato)
                    </span>
                  </div>
                </div>
                <span className="degate-hero-arrow">↗</span>
              </a>
            )}

            {/* Ethereum Buy Button */}
            {asset.platforms.ondo && (
              <a
                href={degateLink(asset.platforms.ondo.address, 'ethereum')}
                target="_blank"
                rel="noopener noreferrer"
                className="degate-hero-btn degate-hero-eth"
                id="degate-direct-buy-ethereum"
              >
                <div className="degate-hero-btn-left">
                  <span className="degate-hero-icon">⟠</span>
                  <div className="degate-hero-labels">
                    <span className="degate-hero-title">
                      {ocm.buyOnDegateEthereum?.replace('{ticker}', asset.ticker) || `Acquista ${asset.ticker} su DeGate App (Ethereum)`}
                    </span>
                    <span className="degate-hero-subtitle">
                      Ethereum Mainnet • Massima Liquidità Istituzionale
                    </span>
                  </div>
                </div>
                <span className="degate-hero-arrow">↗</span>
              </a>
            )}

            {/* If Robinhood-only */}
            {isRobinhoodOnly && (
              <div className="degate-rh-only-box">
                <p className="degate-rh-only-note">
                  ℹ️ {ocm.robinhoodTradeNote || 'Token nativo Robinhood Chain L2. Apri DeGate App per esplorare o scambiare token equivalenti.'}
                </p>
                <a
                  href="https://app.degate.com/?utm_source=dgfans"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="degate-hero-btn degate-hero-general"
                >
                  <div className="degate-hero-btn-left">
                    <span className="degate-hero-icon">⚡</span>
                    <div className="degate-hero-labels">
                      <span className="degate-hero-title">
                        {ocm.openDegateApp || 'Apri DeGate App ↗'}
                      </span>
                      <span className="degate-hero-subtitle">
                        Order Book DEX &amp; Grid Trading Senza KYC
                      </span>
                    </div>
                  </div>
                  <span className="degate-hero-arrow">↗</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Anti-Scam Official Verification Notice */}
        <div className="modal-verification-banner">
          <div className="verification-icon">🛡️</div>
          <div className="verification-text">
            <strong>{ocm.verifiedContractTitle || 'Contratto Ufficiale Verificato (Anti-Scam 100%)'}</strong>
            <p>
              {ocm.verifiedContractDesc ||
                'Asset ufficiale con collaterale 1:1 emesso da entità regolamentate (Robinhood Assets / Ondo / Backed). Diffida da copie non ufficiali.'}
            </p>
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

        {/* Multi-Chain Comparison Helper */}
        {platformCount > 1 && (
          <div className="modal-which-chain-box">
            <div className="which-chain-title">
              💡 {ocm.whichChainTitle || 'Quale chain scegliere?'}
            </div>
            <ul className="which-chain-list">
              {rhPlatform && (
                <li>
                  <strong className="rh-brand-text">Robinhood Chain:</strong>{' '}
                  {ocm.rhChainFeature || 'Gas micro (<$0.01), mercato 24/5 continuo + overnight, dividendi reinvestiti.'}
                </li>
              )}
              {asset.platforms.xstocks && (
                <li>
                  <strong className="xstocks-brand-text">Solana (xStocks):</strong>{' '}
                  {ocm.solChainFeature || 'Velocità sub-second, fee micro (<$0.01), swap istantaneo su Jupiter / DeGate.'}
                </li>
              )}
              {asset.platforms.ondo && (
                <li>
                  <strong className="ondo-brand-text">Ethereum (Ondo):</strong>{' '}
                  {ocm.ethChainFeature || 'Massima profondità di liquidità istituzionale e sicurezza per importi elevati.'}
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Multi-Chain Deployments & Verified Contracts */}
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

                {/* Web3 Add to Wallet Buttons */}
                <div className="web3-wallet-actions">
                  <button
                    type="button"
                    className="btn-web3-action"
                    onClick={() => addTokenToMetaMask(rhPlatform.address, rhPlatform.tokenSymbol, 18, rhPlatform.logo)}
                    title="Aggiungi token a MetaMask o Rabby"
                  >
                    🦊 {labelAddToWallet}
                  </button>
                  <button
                    type="button"
                    className="btn-web3-action btn-web3-secondary"
                    onClick={addRobinhoodChainToMetaMask}
                    title="Aggiungi la rete Robinhood Chain al wallet con 1 clic"
                  >
                    🌐 {labelAddNetwork}
                  </button>
                </div>

                {/* Cross-Platform DeGate Hint if asset also exists on Solana or Ethereum */}
                {(asset.platforms.xstocks || asset.platforms.ondo) && (
                  <div className="platform-degate-cross-hint">
                    <span className="cross-hint-title">⚡ Acquisto Diretto su DeGate App:</span>
                    <div className="cross-hint-buttons">
                      {asset.platforms.xstocks && (
                        <a
                          href={degateLink(asset.platforms.xstocks.address, 'solana')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-card-degate-chip btn-card-degate-sol"
                        >
                          ⚡ Versione Solana (Gas &lt;$0.01) ↗
                        </a>
                      )}
                      {asset.platforms.ondo && (
                        <a
                          href={degateLink(asset.platforms.ondo.address, 'ethereum')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-card-degate-chip btn-card-degate-eth"
                        >
                          ⟠ Versione Ethereum Mainnet ↗
                        </a>
                      )}
                    </div>
                  </div>
                )}

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
                    <a
                      href={degateLink(asset.platforms.ondo.address, 'ethereum')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-card-degate-buy btn-card-degate-eth"
                      title="Acquista subito su DeGate App (Ethereum)"
                    >
                      ⚡ Compra su DeGate ↗
                    </a>
                  </div>
                </div>

                {/* Web3 Add Token */}
                <div className="web3-wallet-actions">
                  <button
                    type="button"
                    className="btn-web3-action"
                    onClick={() => addTokenToMetaMask(asset.platforms.ondo!.address, asset.platforms.ondo!.tokenSymbol, 18, asset.logo)}
                    title="Aggiungi token a MetaMask"
                  >
                    🦊 {labelAddToWallet}
                  </button>
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
                    <a
                      href={degateLink(asset.platforms.xstocks.address, 'solana')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-card-degate-buy btn-card-degate-sol"
                      title="Acquista subito su DeGate App (Solana)"
                    >
                      ⚡ Compra su DeGate ↗
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

        {/* Manual Network Parameters Box if requested or wallet not found */}
        {showNetworkInfo && (
          <div className="manual-network-box">
            <div className="manual-network-header">
              <strong>Parametri Manuali Robinhood Chain (RPC):</strong>
              <button
                type="button"
                className="btn-close-sub"
                onClick={() => setShowNetworkInfo(false)}
              >
                ✕
              </button>
            </div>
            <div className="manual-network-grid">
              <div>Network: <code>Robinhood Chain</code></div>
              <div>RPC URL: <code>https://rpc.mainnet.chain.robinhood.com</code></div>
              <div>Chain ID: <code>4663</code></div>
              <div>Symbol: <code>ETH</code></div>
              <div>Explorer: <code>https://robinhoodchain.blockscout.com</code></div>
            </div>
          </div>
        )}

        {/* Description */}
        {asset.description && (
          <div className="modal-section">
            <div className="modal-section-title">{labelDescription}</div>
            <p className="modal-description">
              {asset.description.length > 320
                ? asset.description.slice(0, 320) + '...'
                : asset.description}
            </p>
          </div>
        )}

        {/* DeGate Trading Buttons */}
        {(asset.platforms.ondo || asset.platforms.xstocks) && (
          <div className="modal-section">
            <div className="modal-section-title">{ocm.buyOnDegate || 'Trade on DeGate DEX'}</div>
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
