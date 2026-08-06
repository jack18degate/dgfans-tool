"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader2, Filter, SlidersHorizontal, ArrowRight, Zap } from 'lucide-react';
import { useI18n } from '../../i18n';

const PoolExplorer = ({ onSelectPool, selectedPoolId }) => {
  const [pools, setPools] = useState([]);
  const [degatePairs, setDegatePairs] = useState([]);
  const [degateDirectPools, setDegateDirectPools] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useI18n();
  const timeframe = '24h';
  
  const getApiSortField = () => 'liquidity';

  // 1. Fetch Raydium Pools
  const fetchPools = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://api-v3.raydium.io/pools/info/list', {
        params: { poolType: 'concentrated', poolSortField: getApiSortField(), sortType: 'desc', pageSize: 100, page: 1 }
      });
      if (response.data?.success && response.data?.data) {
        setPools(response.data.data.data);
      } else {
        setError('Invalid data received from Raydium API');
      }
    } catch (err) {
      console.error("Error fetching Raydium:", err);
      setError('Failed to fetch pools. The API might be rate-limiting.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, []);

  useEffect(() => {
    // 2. Fetch Degate Pairs + build direct pools for non-Raydium chains
    const fetchDegate = async () => {
      try {
        const res = await axios.get('/api/degate-pairs');
        if (res.data?.data?.items) {
          const rawItems = res.data.data.items;
          const mapPairs = rawItems.map(p => ({
            symbolA: p.token_a?.symbol?.toUpperCase() || '',
            symbolB: p.token_b?.symbol?.toUpperCase() || '',
            feeRate: p.swap_pool_fee
          }));
          setDegatePairs(mapPairs);

          // Build direct pool entries for non-SOLANA chains (BASE, ETHEREUM)
          // These don't appear in Raydium, so we render them directly from DeGate data
          const directPools = rawItems
            .filter(p => p.chain_name !== 'SOLANA')
            .map(p => ({
              id: `degate-${p.id}`,
              isDirect: true,
              name: p.name,
              chain: p.chain_name,
              poolAddress: p.pool_address,
              poolUrl: p.pool_url,
              feeRate: p.swap_pool_fee,
              weekApr: p.week_apr,
              price: p.current_price,
              change24h: p['24h_changes'],
              protocolTvl: p.protocol_tvl,
              tokenA: {
                symbol: p.token_a?.symbol,
                logoURI: p.token_a?.icon,
              },
              tokenB: {
                symbol: p.token_b?.symbol,
                logoURI: p.token_b?.icon,
              },
              // Build a Raydium-compatible shape for LiquidityChart
              mintA: { symbol: p.token_a?.symbol, logoURI: p.token_a?.icon },
              mintB: { symbol: p.token_b?.symbol, logoURI: p.token_b?.icon },
              tvl: p.protocol_tvl || 0,
              config: { tradeFeeRate: Math.round(p.swap_pool_fee * 10000) },
              day: { volume: 0, apr: p.week_apr || 0 },
            }));
          setDegateDirectPools(directPools);
        }
      } catch (err) {
        console.error("Network error fetching Degate:", err);
      }
    };
    fetchDegate();
  }, []);

  const getTimeframeData = (pool) => {
    if (pool.isDirect) return { volume: 0, apr: pool.weekApr || 0 };
    if (timeframe === '24h') return pool.day;
    if (timeframe === '7d') return pool.week;
    if (timeframe === '30d') return pool.month;
    return pool.day;
  };

  // Match any DeGate pair (no fee restriction)
  const isDegateMatched = (pool) => {
    if (degatePairs.length === 0) return false;
    const a = pool.mintA?.symbol?.toUpperCase();
    const b = pool.mintB?.symbol?.toUpperCase();
    
    return degatePairs.some(dp => 
      (dp.symbolA === a && dp.symbolB === b) || 
      (dp.symbolA === b && dp.symbolB === a) ||
      (dp.symbolA !== 'USDC' && dp.symbolA !== 'USDT' && (dp.symbolA === a || dp.symbolA === b)) ||
      (dp.symbolB !== 'USDC' && dp.symbolB !== 'USDT' && (dp.symbolB === a || dp.symbolB === b))
    );
  };

  // For Raydium pools, find the matching DeGate fee tier
  const getDegatePoolFee = (pool) => {
    const a = pool.mintA?.symbol?.toUpperCase();
    const b = pool.mintB?.symbol?.toUpperCase();
    const match = degatePairs.find(dp =>
      (dp.symbolA === a && dp.symbolB === b) ||
      (dp.symbolA === b && dp.symbolB === a) ||
      (dp.symbolA !== 'USDC' && dp.symbolA !== 'USDT' && (dp.symbolA === a || dp.symbolA === b)) ||
      (dp.symbolB !== 'USDC' && dp.symbolB !== 'USDT' && (dp.symbolB === a || dp.symbolB === b))
    );
    return match ? match.feeRate : null;
  };

  // Filter Raydium pools that match a DeGate pair AND have the same fee tier
  const matchedRaydiumPools = pools.filter(pool => {
    if (pool.tvl < 10000) return false;
    if (!isDegateMatched(pool)) return false;
    
    // Only show the Raydium pool whose fee tier matches the DeGate pool
    const degateFee = getDegatePoolFee(pool);
    if (degateFee !== null) {
      const raydiumFee = pool.config?.tradeFeeRate / 10000;
      if (Math.abs(raydiumFee - degateFee) > 0.001) return false;
    }
    
    return true;
  });

  // Combine: DeGate-direct pools (BASE/ETH) first, then matched Raydium pools
  const allPools = [...degateDirectPools, ...matchedRaydiumPools];

  const chainBadge = (pool) => {
    if (pool.isDirect) {
      const colors = pool.chain === 'BASE' 
        ? { bg: 'rgba(0,82,255,0.15)', color: '#4d8eff', border: 'rgba(0,82,255,0.25)' }
        : { bg: 'rgba(98,126,234,0.15)', color: '#8b9ff5', border: 'rgba(98,126,234,0.25)' };
      return (
        <span style={{ fontSize: '9px', background: colors.bg, color: colors.color, border: `1px solid ${colors.border}`, padding: '1px 5px', borderRadius: '4px', fontWeight: 700, flexShrink: 0 }}>
          {pool.chain}
        </span>
      );
    }
    return (
      <span style={{ fontSize: '9px', background: 'rgba(153,69,255,0.12)', color: '#b388ff', border: '1px solid rgba(153,69,255,0.2)', padding: '1px 5px', borderRadius: '4px', fontWeight: 700, flexShrink: 0 }}>
        SOLANA
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-green-300 bg-clip-text text-transparent flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-400" />
          {t.turbo.degatePools}
        </h2>
        <button 
          onClick={fetchPools}
          disabled={loading}
          className="p-2 border border-border rounded-lg bg-surface hover:bg-surface-hover hover:text-text transition-all text-textMuted disabled:opacity-50"
          title="Aggiorna Dati Liquidità"
        >
           {loading ? t.turbo.updating?.substring(0,3) || '...' : t.turbo.refresh}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 relative">
        {loading && (
          <div className="absolute inset-0 z-10 bg-surface/50 backdrop-blur-sm flex items-center justify-center p-8 gap-2 text-primary">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm font-semibold">{t.turbo.updating}</span>
          </div>
        )}

        {error ? (
          <div className="p-8 text-center text-red-400 text-sm">{error}</div>
        ) : allPools.length === 0 && !loading ? (
          <div className="p-8 text-center text-textMuted text-sm">{t.turbo.noPoolFound}</div>
        ) : (
          <div className="divide-y divide-border">
            {allPools.map(pool => {
              const metrics = getTimeframeData(pool);
              const feeFormatted = pool.isDirect 
                ? (pool.feeRate * 100).toFixed(2)
                : (pool.config?.tradeFeeRate / 10000).toFixed(2);
              
              return (
                <div 
                  key={pool.id} 
                  onClick={() => onSelectPool(pool)}
                  className={`p-4 hover:bg-surface-hover cursor-pointer transition-colors flex items-center justify-between group flex-wrap gap-y-2 ${selectedPoolId === pool.id ? 'bg-surface-hover border-l-2 border-primary' : ''}`}
                >
                  <div className="flex items-center gap-3 w-3/5 overflow-hidden">
                    <div className="flex -space-x-2 flex-shrink-0">
                      {(pool.mintA?.logoURI || pool.tokenA?.logoURI) && <img src={pool.mintA?.logoURI || pool.tokenA?.logoURI} alt="tA" className="w-7 h-7 rounded-full border border-border bg-black" />}
                      {(pool.mintB?.logoURI || pool.tokenB?.logoURI) && <img src={pool.mintB?.logoURI || pool.tokenB?.logoURI} alt="tB" className="w-7 h-7 rounded-full border border-border bg-black" />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate flex items-center gap-1.5 flex-wrap">
                        {pool.mintA?.symbol}/{pool.mintB?.symbol}
                        <span className="text-[10px] bg-background text-textMuted px-1.5 py-0.5 rounded font-mono border border-border shrink-0">{feeFormatted}%</span>
                        <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded font-medium flex items-center gap-1 shrink-0">
                           <Zap className="w-3 h-3" /> Degate
                        </span>
                        {chainBadge(pool)}
                      </div>
                      <div className="text-xs text-textMuted mt-0.5 whitespace-nowrap">
                        TVL: ${Number(pool.isDirect ? pool.protocolTvl : pool.tvl).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right w-[35%] flex-shrink-0">
                    {pool.isDirect ? (
                      <>
                        <div className="text-sm font-medium" title="Price">
                          ${Number(pool.price || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs font-semibold text-primary mt-0.5" title="Weekly APR">
                          {pool.weekApr ? `${pool.weekApr.toFixed(2)}% APR` : '-'}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-medium" title={`Volume ${timeframe}`}>
                          ${Number(metrics?.volume || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })} <span className="text-[10px] text-textMuted font-normal align-top">v</span>
                        </div>
                        <div className="text-xs font-semibold text-primary mt-0.5" title={`APR ${timeframe}`}>
                          {metrics?.apr !== undefined && metrics.apr !== null ? `${metrics.apr.toFixed(2)}% APR` : '-'}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PoolExplorer;
