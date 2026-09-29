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

/** Load official Robinhood assets from bundled JSON (fallback to live API) */
async function loadRobinhood() {
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'robinhood_assets.json');
    const raw = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    if (data.assets && Array.isArray(data.assets) && data.assets.length > 0) {
      return data.assets;
    }
  } catch (err) {
    console.warn('Local robinhood_assets.json read failed, falling back to API:', err.message);
  }

  try {
    const res = await fetch('https://api.robinhood.com/rhj/assets');
    if (res.ok) {
      const data = await res.json();
      return data.assets || [];
    }
  } catch (err) {
    console.error('Failed to fetch Robinhood assets from API:', err);
  }
  return [];
}

/** Merge Ondo, xStocks, and Robinhood into unified format */
export async function fetchAllAssets() {
  const ondoRaw = loadOndo();
  const [xstocksRaw, rhRaw] = await Promise.all([
    fetchXStocks(),
    loadRobinhood()
  ]);
  
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

  // Process Robinhood Official Assets
  for (const r of rhRaw) {
    const ticker = r.tokenSymbol || '';
    if (!ticker) continue;

    const dep = (r.deployments || [])[0] || {};
    const contractAddress = dep.contractAddress || '';
    if (!contractAddress) continue;

    const cleanName = (r.tokenName || ticker).replace(/\s*[•·-]\s*Robinhood\s+Token.*$/i, '').trim();
    const isETF = ETF_TICKERS.has(ticker) || /\betf\b/i.test(r.tokenName);

    const rhPlatform = {
      tokenSymbol: r.tokenSymbol,
      tokenName: r.tokenName || `${ticker} • Robinhood Token`,
      address: contractAddress,
      chain: 'robinhood',
      chainId: dep.chainId || 4663,
      multiplier: r.currentMultiplier || '1.000000000000000000',
      isin: r.isin || '',
      logo: r.logoUrl || '',
      explorerUrl: `https://robinhoodchain.blockscout.com/token/${contractAddress}`,
      status: r.status || 'ASSET_STATUS_ACTIVE',
      tradingCapabilities: r.tradingCapabilities || null,
    };

    if (merged.has(ticker)) {
      const existing = merged.get(ticker);
      existing.platforms.robinhood = rhPlatform;
      if (!existing.isin && r.isin) existing.isin = r.isin;
      if (!existing.logo && r.logoUrl) existing.logo = r.logoUrl;
    } else {
      merged.set(ticker, {
        id: ticker,
        name: cleanName || ticker,
        ticker,
        type: isETF ? 'ETF' : 'Stock',
        sector: '',
        description: `${cleanName} (${ticker}) is an official tokenized stock asset issued by Robinhood Assets (Jersey) Limited on Robinhood Chain with 24/5 continuous trading.`,
        isin: r.isin || '',
        logo: r.logoUrl || '',
        platforms: {
          robinhood: rhPlatform,
        }
      });
    }
  }
  
  const assets = [...merged.values()].sort((a, b) => a.ticker.localeCompare(b.ticker));
  
  const ondoCount = assets.filter(a => a.platforms.ondo).length;
  const xstocksCount = assets.filter(a => a.platforms.xstocks).length;
  const robinhoodCount = assets.filter(a => a.platforms.robinhood).length;
  const crossPlatform = assets.filter(a => {
    const c = (a.platforms.ondo ? 1 : 0) + (a.platforms.xstocks ? 1 : 0) + (a.platforms.robinhood ? 1 : 0);
    return c > 1;
  }).length;
  
  return {
    assets,
    metadata: {
      totalAssets: assets.length,
      ondo: ondoCount,
      xstocks: xstocksCount,
      robinhood: robinhoodCount,
      both: crossPlatform,
      crossPlatform,
      stocks: assets.filter(a => a.type === 'Stock').length,
      etfs: assets.filter(a => a.type === 'ETF').length,
      lastRefresh: new Date().toISOString(),
    }
  };
}
