import { NextRequest, NextResponse } from 'next/server';
import { checkSwap } from '@/lib/swapCheck';
import { XSTOCKS_API } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const chain = searchParams.get('chain');
  const symbol = searchParams.get('symbol');

  if (!address || !chain || !symbol) {
    return NextResponse.json({ error: 'Missing address, chain, or symbol' }, { status: 400 });
  }

  // Run swap check
  const swapResult = (await checkSwap(address, chain, symbol)) as any;

  // Try to fetch price
  let priceUsd: number | null = null;

  if (chain === 'solana') {
    // xStocks: use the token symbol (e.g. AAPLx) for the price endpoint
    try {
      const priceRes = await fetch(`${XSTOCKS_API}/${symbol}/price-data`, {
        signal: AbortSignal.timeout(5000),
      });
      if (priceRes.ok) {
        const priceData = await priceRes.json();
        // Response format: { quote: { close, open, high, low, ... } } or { quote: null }
        priceUsd = priceData?.quote?.close ?? null;
      }
    } catch { /* price fetch is best-effort */ }
  } else if (chain === 'ethereum' && swapResult.swappable && swapResult.buyAmount) {
    // Ondo/CowSwap: derive price from quote (buyAmount is in token decimals, usually 18)
    // $100 USDC / buyAmount(18 decimals) = price per token
    try {
      const buyAmtNum = Number(swapResult.buyAmount);
      if (buyAmtNum > 0) {
        const derived = (100 / (buyAmtNum / 1e18)).toFixed(2);
        priceUsd = Number(derived);
      }
    } catch { /* best effort */ }
  }

  return NextResponse.json({
    ...swapResult,
    priceUsd,
    symbol,
    chain,
    checkedAt: new Date().toISOString(),
  });
}
