/**
 * constants.js — Shared constants for the RWA Token Explorer data layer
 *
 * Centralizes every magic string, address, and configuration value
 * so downstream modules never hardcode API URLs or chain-specific details.
 */

// ─── USDC Contract Addresses ────────────────────────────────────────────────
export const USDC_SOLANA  = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const USDC_ETHEREUM = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

// ─── Swap-Quote Amount ($100 USDC, 6 decimals) ─────────────────────────────
export const AMOUNT_USDC_100 = '100000000';
export const SLIPPAGE_BPS    = 300; // 3 %

// ─── Dummy "from" address used for CowSwap read-only quotes ─────────────────
export const COWSWAP_FROM = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

// ─── API Base URLs ──────────────────────────────────────────────────────────
export const XSTOCKS_API      = 'https://api.backed.fi/api/v2/public/assets';
export const COWSWAP_QUOTE_URL = 'https://api.cow.fi/mainnet/api/v1/quote';
export const JUPITER_QUOTE_URL = 'https://api.jup.ag/swap/v1/quote';

// ─── DeGate Link Templates ─────────────────────────────────────────────────
export const DEGATE_ETH_LINK = (addr) =>
  `https://app.degate.com/en/swap/USDC/${addr}?chain=ethereum&utm_source=dgtools`;
export const DEGATE_SOL_LINK = (addr) =>
  `https://app.degate.com/en/swap/USDC/${addr}?chain=solana&utm_source=dgtools`;

// ─── Rate-Limiting Delays (ms) ─────────────────────────────────────────────
export const XSTOCKS_PAGE_DELAY = 200;   // Between paginated xStocks fetches
export const COWSWAP_DELAY      = 600;   // Between CowSwap quote requests
export const JUPITER_DELAY      = 2200;  // Jupiter keyless rate-limit (~0.5 r/s)

// ─── Known ETF Tickers ─────────────────────────────────────────────────────
// Used to classify assets whose underlying ticker matches a US-listed ETF.
export const ETF_TICKERS = new Set([
  // Bond / Fixed Income
  'SGOV', 'JAAA', 'JPST', 'FLBL', 'FAAA', 'BND', 'SHY',
  // Broad Equity
  'VOO', 'VT', 'VUG', 'VXUS', 'VGK', 'VTI', 'SPMO', 'SCHD',
  // Semiconductor
  'SMH', 'SOXX', 'SOXL',
  // Small / Mid Cap
  'IWM', 'IJR', 'FLQM', 'FSML',
  // International / Country
  'IEMG', 'SCHF', 'EWY', 'EWU', 'EWG', 'EWQ', 'FEZ', 'DAX', 'EWT', 'INDA',
  // Sector
  'ITA', 'XLE', 'XOP', 'MOO', 'XLK',
  // Index
  'SPY', 'QQQ', 'TQQQ', 'SQQQ',
  // Commodity
  'SLV', 'GDX', 'GLD', 'COPX', 'PPLT', 'PALL', 'URA', 'NLR',
  // Crypto
  'BITX',
  // Thematic / Other
  'VCX', 'YLDE', 'IQM', 'VIDA', 'USPX', 'FGDL',
]);

// ─── Robinhood Chain Parameters ───────────────────────────────────────────
export const ROBINHOOD_CHAIN_ID = 4663;
export const ROBINHOOD_RPC_URL  = 'https://rpc.mainnet.chain.robinhood.com';
export const ROBINHOOD_EXPLORER_TOKEN = (addr) => `https://robinhoodchain.blockscout.com/token/${addr}`;
export const ROBINHOOD_API_URL  = 'https://api.robinhood.com/rhj/assets';

// ─── Search Synonyms and Company Aliases ───────────────────────────────────
// Maps colloquial company names, product names, and founder names to stock tickers
export const ASSET_ALIASES = {
  'google': ['GOOGL', 'GOOG'],
  'alphabet': ['GOOGL', 'GOOG'],
  'facebook': ['META'],
  'meta': ['META'],
  'instagram': ['META'],
  'spacex': ['SPCX'],
  'space x': ['SPCX'],
  'starlink': ['SPCX'],
  'elon': ['TSLA', 'SPCX'],
  'musk': ['TSLA', 'SPCX'],
  'tesla': ['TSLA'],
  'apple': ['AAPL'],
  'iphone': ['AAPL'],
  'nvidia': ['NVDA'],
  'microsoft': ['MSFT'],
  'windows': ['MSFT'],
  'chatgpt': ['MSFT'],
  'openai': ['MSFT'],
  'amazon': ['AMZN'],
  'netflix': ['NFLX'],
  'reddit': ['RDDT'],
  'oro': ['GLD', 'IAU'],
  'gold': ['GLD', 'IAU'],
  'argento': ['SLV'],
  'silver': ['SLV'],
  'sp500': ['SPY', 'VOO', 'SPMO'],
  's&p': ['SPY', 'VOO', 'SPMO'],
  's&p 500': ['SPY', 'VOO', 'SPMO'],
  'nasdaq': ['QQQ', 'TQQQ'],
  'microstrategy': ['MSTR'],
  'saylor': ['MSTR'],
  'strategy': ['MSTR'],
  'coinbase': ['COIN'],
  'ozempic': ['NVO'],
  'novo': ['NVO'],
  'novo nordisk': ['NVO'],
  'lilly': ['LLY'],
  'eli lilly': ['LLY'],
  'dwave': ['QBTS'],
  'd-wave': ['QBTS'],
  'quantum': ['QBTS'],
  'firefly': ['FLY'],
  'buffett': ['BRK.B'],
  'berkshire': ['BRK.B'],
  'treasury': ['SGOV', 'BND', 'SHY'],
  'titoli di stato': ['SGOV', 'BND', 'SHY'],
  'obbligazioni': ['SGOV', 'BND', 'SHY'],
  'bonds': ['SGOV', 'BND', 'SHY'],
  'ferrari': ['RACE'],
  'palantir': ['PLTR'],
  'taiwan': ['TSM', 'EWT'],
  'tsmc': ['TSM', 'EWT'],
  'asml': ['ASML'],
  'broadcom': ['AVGO'],
  'supermicro': ['SMCI'],
  'super micro': ['SMCI'],
  'dell': ['DELL'],
  'uber': ['UBER'],
  'airbnb': ['ABNB'],
  'disney': ['DIS'],
  'boeing': ['BA'],
  'jpmorgan': ['JPM'],
  'jp morgan': ['JPM'],
  'visa': ['V'],
  'mastercard': ['MA'],
  'coca cola': ['KO'],
  'pepsi': ['PEP'],
  'walmart': ['WMT'],
  'costco': ['COST'],
  'rare earth': ['USAR'],
};

export const TOP_FAMOUS_TICKERS = [
  'NVDA',  // Nvidia
  'AAPL',  // Apple
  'TSLA',  // Tesla
  'MSFT',  // Microsoft
  'AMZN',  // Amazon
  'GOOGL', // Alphabet (Google)
  'META',  // Meta
  'SPY',   // S&P 500 ETF
  'QQQ',   // Nasdaq 100 ETF
  'SPCX',  // SpaceX (Pre-IPO)
  'MSTR',  // MicroStrategy
  'COIN',  // Coinbase
  'AMD',   // AMD
  'PLTR',  // Palantir
  'GLD',   // Oro (SPDR Gold Shares)
  'RDDT',  // Reddit
  'NFLX',  // Netflix
  'VOO',   // Vanguard S&P 500
  'DIS',   // Disney
  'BABA',  // Alibaba
  'ARM',   // ARM Holdings
];

// ─── Swap Status Enum ───────────────────────────────────────────────────────
export const SwapStatus = {
  SWAPPABLE:     'SWAPPABLE',
  MARKET_CLOSED: 'MARKET_CLOSED',
  NO_LIQUIDITY:  'NO_LIQUIDITY',
  NOT_TRADABLE:  'NOT_TRADABLE',
  NO_ROUTE:      'NO_ROUTE',
  ERROR:         'ERROR',
};
