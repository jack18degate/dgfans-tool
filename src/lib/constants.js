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
  'SGOV', 'JAAA', 'JPST', 'FLBL', 'FAAA',
  // Broad Equity
  'VOO', 'VT', 'VUG', 'VXUS', 'VGK', 'VTI',
  // Semiconductor
  'SMH', 'SOXX', 'SOXL',
  // Small / Mid Cap
  'IWM', 'IJR', 'FLQM', 'FSML',
  // International / Country
  'IEMG', 'SCHF', 'EWY', 'EWU', 'EWG', 'EWQ', 'FEZ', 'DAX',
  // Sector
  'ITA', 'XLE', 'XOP', 'MOO',
  // Index
  'SPY', 'QQQ', 'TQQQ', 'SQQQ',
  // Commodity
  'SLV', 'GDX', 'GLD', 'COPX', 'PPLT', 'PALL', 'URA', 'NLR',
  // Crypto
  'BITX',
  // Thematic / Other
  'VCX', 'YLDE', 'IQM', 'VIDA', 'USAR', 'USPX', 'FGDL',
]);

// ─── Swap Status Enum ───────────────────────────────────────────────────────
export const SwapStatus = {
  SWAPPABLE:     'SWAPPABLE',
  MARKET_CLOSED: 'MARKET_CLOSED',
  NO_LIQUIDITY:  'NO_LIQUIDITY',
  NOT_TRADABLE:  'NOT_TRADABLE',
  NO_ROUTE:      'NO_ROUTE',
  ERROR:         'ERROR',
};
