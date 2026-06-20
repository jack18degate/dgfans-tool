/**
 * fetchAssets.js — Fetches and merges Ondo + xStocks assets into a unified list
 */
import { XSTOCKS_API, XSTOCKS_PAGE_DELAY, ETF_TICKERS } from './constants.js';
import { readFileSync } from 'fs';
import { join } from 'path';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/** Fetch all pages from Backed.fi (xStocks) */
async function fetchXStocks() {
  const assets = [];
  let page = 1;
  
  while (true) {
    const res = await fetch(`${XSTOCKS_API}?page=${page}`);
    if (!res.ok) break;
    const data = await res.json();
    // Backed.fi returns { nodes: [...], page: { currentPage, hasNextPage } }
    const nodes = data.nodes || data;
    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) break;
    assets.push(...nodes);
    if (!data.page?.hasNextPage) break;
    page++;
    await sleep(XSTOCKS_PAGE_DELAY);
  }
  return assets;
}

/** Load Ondo assets from bundled JSON */
function loadOndo() {
  const filePath = join(process.cwd(), 'public', 'data', 'ondo_assets.json');
  const raw = readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  return [...(data.stocks || []), ...(data.etfs || [])];
}

/** Merge Ondo and xStocks into unified format */
export async function fetchAllAssets() {
  const ondoRaw = loadOndo();
  const xstocksRaw = await fetchXStocks();
  
  const merged = new Map(); // key = underlying ticker
  
  // Process Ondo
  for (const o of ondoRaw) {
    const ticker = o.stockTicker || '';
    if (!ticker) continue;
    
    const isETF = (o.type || '').toLowerCase().includes('etf') || ETF_TICKERS.has(ticker);
    
    merged.set(ticker, {
      id: ticker,
      name: o.stockName || o.tokenName || ticker,
      ticker,
      type: isETF ? 'ETF' : 'Stock',
      sector: o.sector || '',
      description: o.description || '',
      isin: o.isin || '',
      logo: o.logoPng || o.logoSvg || '',
      platforms: {
        ondo: {
          tokenSymbol: o.tokenSymbol || '',
          address: o.ethereumAddress || '',
          chain: 'ethereum',
        }
      }
    });
  }
  
  // Process xStocks
  for (const x of xstocksRaw) {
    const ticker = x.underlyingSymbol || x.symbol?.replace(/x$/i, '') || '';
    if (!ticker) continue;
    
    // Find Solana address from deployments
    const solDeploy = (x.deployments || []).find(d => d.network === 'Solana');
    const solAddr = solDeploy?.address || '';
    if (!solAddr) continue;
    
    const isETF = ETF_TICKERS.has(ticker) || (x.type || '').toLowerCase().includes('etf');
    
    if (merged.has(ticker)) {
      // Add xStocks platform to existing asset
      const existing = merged.get(ticker);
      existing.platforms.xstocks = {
        tokenSymbol: x.symbol || `${ticker}x`,
        address: solAddr,
        chain: 'solana',
      };
      // Fill missing fields
      if (!existing.description && x.description) existing.description = x.description;
      if (!existing.isin && x.isin) existing.isin = x.isin;
    } else {
      merged.set(ticker, {
        id: ticker,
        name: x.name || ticker,
        ticker,
        type: isETF ? 'ETF' : 'Stock',
        sector: '',
        description: x.description || '',
        isin: x.isin || x.underlyingIsin || '',
        logo: x.logo || '',
        platforms: {
          xstocks: {
            tokenSymbol: x.symbol || `${ticker}x`,
            address: solAddr,
            chain: 'solana',
          }
        }
      });
    }
  }
  
  const assets = [...merged.values()].sort((a, b) => a.ticker.localeCompare(b.ticker));
  
  const ondoOnly = assets.filter(a => a.platforms.ondo && !a.platforms.xstocks).length;
  const xstocksOnly = assets.filter(a => !a.platforms.ondo && a.platforms.xstocks).length;
  const both = assets.filter(a => a.platforms.ondo && a.platforms.xstocks).length;
  
  return {
    assets,
    metadata: {
      totalAssets: assets.length,
      ondoOnly,
      xstocksOnly,
      both,
      stocks: assets.filter(a => a.type === 'Stock').length,
      etfs: assets.filter(a => a.type === 'ETF').length,
      lastRefresh: new Date().toISOString(),
    }
  };
}
