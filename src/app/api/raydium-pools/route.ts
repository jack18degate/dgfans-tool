import { NextResponse } from 'next/server';

// ── DeGate Turbo Range API ──
const DEGATE_PRODUCTS_URL =
  'https://v1-mainnet-backend.degate.com/order-book-api/turbo-range/products';
const DEGATE_BACKTEST_URL =
  'https://v1-mainnet-backend.degate.com/order-book-api/turbo-range/apy-backtest';

export const revalidate = 900; // cache 15 minutes

// Emoji map based on asset name (fallback for display)
const EMOJI_MAP: Record<string, string> = {
  gold: '🪙',
  bitcoin: '₿',
  slvon: '🥈',
  silver: '🥈',
  tesla: '🚗',
  microstrategy: '📊',
  circle: '🔵',
  's&p 500': '📈',
  nvidia: '💚',
  google: '🔍',
  'nasdaq 100': '💹',
  amazon: '📦',
  apple: '🍎',
  meta: '👓',
};

// Custom display order
const PRIORITY: Record<string, number> = {
  bitcoin: 0,
  gold: 1,
  silver: 2,
  slvon: 2,
  circle: 3,
  microstrategy: 4,
  tesla: 5,
  's&p 500': 6,
  nvidia: 7,
  'nasdaq 100': 8,
  google: 9,
  amazon: 10,
  apple: 11,
  meta: 12,
};

interface PoolResult {
  symbol: string;
  name: string;
  emoji: string;
  poolId: string;
  poolType: string;
  pair: string;
  tvl: number;
  feeRate: number;
  defaultRange: number;
  chain: string;
  apr: { day: number; week: number; month: number };
  volume: { day: number; week: number; month: number };
  logoA: string;
  logoB: string;
  currentPrice: string;
  poolAddress: string;
  change24h: string;
}

/**
 * Fetch APR for different timeframes (24h, 7d, 30d) from DeGate's backtest endpoint.
 */
async function fetchBacktestApr(
  poolAddress: string,
  currentPrice: number,
  pricePercentageMax: number
): Promise<{ day: number; week: number; month: number } | null> {
  try {
    const priceLower = currentPrice * (1 - pricePercentageMax);
    const priceUpper = currentPrice * (1 + pricePercentageMax);

    const res = await fetch(DEGATE_BACKTEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pool: poolAddress,
        current_price: currentPrice,
        price_lower: priceLower,
        price_upper: priceUpper,
      }),
    });

    if (!res.ok) return null;

    const json = await res.json();
    const data = json?.data;

    if (!data) return null;

    return {
      day: Math.round((data.apy_24h ?? 0) * 100) / 100,
      week: Math.round((data.apy_7d ?? 0) * 100) / 100,
      month: Math.round((data.apy_30d ?? 0) * 100) / 100,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const res = await fetch(DEGATE_PRODUCTS_URL, {
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      throw new Error(`DeGate API returned ${res.status}`);
    }

    const json = await res.json();
    const items = json?.data?.items;

    if (!items || !Array.isArray(items)) {
      throw new Error('Invalid DeGate API response structure');
    }

    // Fetch backtest APR for all pools in parallel
    const backtestResults = await Promise.allSettled(
      items.map((item: any) =>
        fetchBacktestApr(
          item.pool_address || '',
          parseFloat(item.current_price || '0'),
          item.price_percentage_max || 0.1
        )
      )
    );

    const pools: PoolResult[] = items.map((item: any, index: number) => {
      const nameLower = item.name?.toLowerCase() || '';
      const emoji = EMOJI_MAP[nameLower] || '💰';
      const weekApr = item.week_apr ?? item.week_fee_apr ?? 0;

      const backtestResult = backtestResults[index];
      const backtestApr =
        backtestResult.status === 'fulfilled' && backtestResult.value
          ? backtestResult.value
          : {
              day: Math.round(weekApr * 100) / 100,
              week: Math.round(weekApr * 100) / 100,
              month: Math.round(weekApr * 100) / 100,
            };

      return {
        symbol: item.token_a?.symbol || item.name,
        name: item.name,
        emoji,
        poolId: item.pool_address || item.id,
        poolType: item.chain_name === 'SOLANA' ? 'Raydium CLMM' : 'Uniswap V3',
        pair: `${item.token_a?.symbol || '?'} / ${item.token_b?.symbol || 'USDC'}`,
        tvl: item.tvl || 0,
        feeRate: item.fee_percentage || 0,
        defaultRange: item.price_percentage_max || 0.1,
        chain: (item.chain_name || 'solana').toLowerCase(),
        apr: backtestApr,
        volume: { day: 0, week: 0, month: 0 },
        logoA: item.token_a?.icon || '',
        logoB: item.token_b?.icon || '',
        currentPrice: item.current_price || '0',
        poolAddress: item.pool_address || '',
        change24h: item['24h_changes'] || '0',
      };
    });

    // Sort by priority
    pools.sort((a, b) => {
      const aPri = PRIORITY[a.name.toLowerCase()] ?? 999;
      const bPri = PRIORITY[b.name.toLowerCase()] ?? 999;
      return aPri - bPri;
    });

    return NextResponse.json({
      success: true,
      pools,
      updatedAt: json?.data?.cache_time || Date.now(),
    });
  } catch (error) {
    console.error('DeGate Pools API error:', error);
    return NextResponse.json(
      { success: false, pools: [], error: 'Failed to fetch pool data from DeGate' },
      { status: 500 }
    );
  }
}
