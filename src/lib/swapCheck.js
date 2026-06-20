/**
 * swapCheck.js — On-demand swap simulation via CowSwap (ETH) and Jupiter (SOL)
 */
import {
  USDC_SOLANA, USDC_ETHEREUM, AMOUNT_USDC_100, SLIPPAGE_BPS,
  COWSWAP_FROM, COWSWAP_QUOTE_URL, JUPITER_QUOTE_URL,
  SwapStatus
} from './constants.js';

/** Check swap on Ethereum via CowSwap */
async function checkCowSwap(tokenAddress, symbol) {
  try {
    const res = await fetch(COWSWAP_QUOTE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sellToken: USDC_ETHEREUM,
        buyToken: tokenAddress,
        sellAmountBeforeFee: AMOUNT_USDC_100,
        kind: 'sell',
        from: COWSWAP_FROM,
      }),
    });
    
    const data = await res.json();
    
    if (res.ok && data.quote) {
      return {
        swappable: true,
        status: SwapStatus.SWAPPABLE,
        details: `Buy amount: ${data.quote.buyAmount}`,
        buyAmount: data.quote.buyAmount,
      };
    }
    
    const errorType = data.errorType || '';
    const desc = data.description || '';
    
    if (errorType === 'TradingOutsideAllowedWindow' || desc.includes('not available for trading')) {
      return { swappable: false, status: SwapStatus.MARKET_CLOSED, details: 'Market closed (trading hours only)' };
    }
    if (errorType === 'NoLiquidity' || desc.includes('no route found')) {
      return { swappable: false, status: SwapStatus.NO_LIQUIDITY, details: 'No liquidity available' };
    }
    
    return { swappable: false, status: SwapStatus.ERROR, details: `${errorType}: ${desc.substring(0, 100)}` };
  } catch (e) {
    return { swappable: false, status: SwapStatus.ERROR, details: e.message };
  }
}

/** Check swap on Solana via Jupiter */
async function checkJupiter(tokenMint, symbol) {
  try {
    const url = `${JUPITER_QUOTE_URL}?inputMint=${USDC_SOLANA}&outputMint=${tokenMint}&amount=${AMOUNT_USDC_100}&slippageBps=${SLIPPAGE_BPS}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (res.ok && data.outAmount) {
      const priceImpact = parseFloat(data.priceImpactPct || '0');
      return {
        swappable: true,
        status: SwapStatus.SWAPPABLE,
        details: `Output: ${data.outAmount} | Impact: ${priceImpact.toFixed(4)}%`,
        outAmount: data.outAmount,
        priceImpactPct: priceImpact,
      };
    }
    
    const errMsg = data.error || data.errorCode || '';
    if (errMsg.includes('not tradable')) {
      return { swappable: false, status: SwapStatus.NOT_TRADABLE, details: 'Token not tradable on Jupiter' };
    }
    
    return { swappable: false, status: SwapStatus.NO_LIQUIDITY, details: errMsg || 'No route found' };
  } catch (e) {
    return { swappable: false, status: SwapStatus.ERROR, details: e.message };
  }
}

/** Main entry: check swap by chain */
export async function checkSwap(address, chain, symbol) {
  if (chain === 'ethereum') return checkCowSwap(address, symbol);
  if (chain === 'solana') return checkJupiter(address, symbol);
  return { swappable: false, status: SwapStatus.ERROR, details: `Unknown chain: ${chain}` };
}
