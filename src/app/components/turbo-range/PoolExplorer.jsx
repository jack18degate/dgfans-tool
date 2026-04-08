"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader2, Filter, SlidersHorizontal, ArrowRight, Zap } from 'lucide-react';

const PoolExplorer = ({ onSelectPool, selectedPoolId }) => {
  const [pools, setPools] = useState([]);
  const [degatePairs, setDegatePairs] = useState([]); // Memorizza le pair ETH/BASE etc.
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Base queries fissate per performance
  const timeframe = '24h';
  const sortMetric = 'liquidity';
  
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
    // 2. Fetch Degate Pairs
    const fetchDegate = async () => {
      try {
        // Usiamo la nostra API Route server-side (/api/degate-pairs) per bypassare CORS
        const res = await axios.get('/api/degate-pairs');
        if (res.data?.data?.items) {
          const rawItems = res.data.data.items;
          const mapPairs = rawItems.map(p => ({
            symbolA: p.token_a?.symbol?.toUpperCase() || '',
            symbolB: p.token_b?.symbol?.toUpperCase() || ''
          }));
          setDegatePairs(mapPairs);
        }
      } catch (err) {
        console.error("Network error fetching Degate:", err);
      }
    };
    fetchDegate();
  }, []);

  const getTimeframeData = (pool) => {
    if (timeframe === '24h') return pool.day;
    if (timeframe === '7d') return pool.week;
    if (timeframe === '30d') return pool.month;
    return pool.day;
  };

  // Funzione di utilità per capire se una Raydium Pool matcha una Degate Pair
  const isDegateMatched = (pool) => {
    // Richiesta: "delle pools di degate, mostra solo le 0.25% fees"
    // Le pool 0.25% su Raydium hanno un tradeFeeRate di 2500
    if (pool.config?.tradeFeeRate !== 2500) return false;

    if (degatePairs.length === 0) return false;
    const a = pool.mintA?.symbol?.toUpperCase();
    const b = pool.mintB?.symbol?.toUpperCase();
    
    return degatePairs.some(dp => 
      // Matched independently or perfectly inverted (e.g. TSLA/USDC vs USDC/TSLA)
      (dp.symbolA === a && dp.symbolB === b) || 
      (dp.symbolA === b && dp.symbolB === a) ||
      // Or just if AT LEAST ONE main token matches (useful per RWA tokenizzati come TSLAx)
      (dp.symbolA !== 'USDC' && dp.symbolA !== 'USDT' && (dp.symbolA === a || dp.symbolA === b)) ||
      (dp.symbolB !== 'USDC' && dp.symbolB !== 'USDT' && (dp.symbolB === a || dp.symbolB === b))
    );
  };

  const filteredPools = pools.filter(pool => {
    // Hard limit Globale: Nascondi a prescindere le pool con TVL sotto i 10,000$
    if (pool.tvl < 10000) return false;

    // Forza bruta: Vogliamo SOLO quelle Degate (0.25%)
    if (!isDegateMatched(pool)) return false;

    return true;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-green-300 bg-clip-text text-transparent flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-400" />
          Degate Pools
        </h2>
        <button 
          onClick={fetchPools}
          disabled={loading}
          className="p-2 border border-border rounded-lg bg-surface hover:bg-[#1a1b23] hover:text-white transition-all text-textMuted disabled:opacity-50"
          title="Aggiorna Dati Liquidità"
        >
           {loading ? '...' : 'Refresh'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 relative">
        {loading && (
          <div className="absolute inset-0 z-10 bg-surface/50 backdrop-blur-sm flex items-center justify-center p-8 gap-2 text-primary">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm font-semibold">Aggiornamento...</span>
          </div>
        )}

        {error ? (
          <div className="p-8 text-center text-red-400 text-sm">{error}</div>
        ) : filteredPools.length === 0 && !loading ? (
          <div className="p-8 text-center text-textMuted text-sm">Nessuna pool trovata.</div>
        ) : (
          <div className="divide-y divide-border">
            {filteredPools.map(pool => {
              const metrics = getTimeframeData(pool);
              const feeFormatted = (pool.config?.tradeFeeRate / 10000).toFixed(2);
              const isDegate = isDegateMatched(pool);
              
              return (
                <div 
                  key={pool.id} 
                  onClick={() => onSelectPool(pool)}
                  className={`p-4 hover:bg-[#20222b] cursor-pointer transition-colors flex items-center justify-between group flex-wrap gap-y-2 ${selectedPoolId === pool.id ? 'bg-[#1a1b23] border-l-2 border-primary' : ''}`}
                >
                  <div className="flex items-center gap-3 w-3/5 overflow-hidden">
                    <div className="flex -space-x-2 flex-shrink-0">
                      {pool.mintA?.logoURI && <img src={pool.mintA.logoURI} alt="tA" className="w-7 h-7 rounded-full border border-border bg-black" />}
                      {pool.mintB?.logoURI && <img src={pool.mintB.logoURI} alt="tB" className="w-7 h-7 rounded-full border border-border bg-black" />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate flex items-center gap-1.5 flex-wrap">
                        {pool.mintA?.symbol}/{pool.mintB?.symbol}
                        <span className="text-[10px] bg-[#0B0B0F] text-textMuted px-1.5 py-0.5 rounded font-mono border border-border shrink-0">{feeFormatted}%</span>
                        {isDegate && (
                          <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded font-medium flex items-center gap-1 shrink-0">
                             <Zap className="w-3 h-3" /> Degate
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-textMuted mt-0.5 whitespace-nowrap">
                        TVL: ${Number(pool.tvl).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right w-[35%] flex-shrink-0">
                    <div className="text-sm font-medium" title={`Volume ${timeframe}`}>
                      ${Number(metrics?.volume || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })} <span className="text-[10px] text-textMuted font-normal align-top">v</span>
                    </div>
                    <div className="text-xs font-semibold text-primary mt-0.5" title={`APR ${timeframe}`}>
                      {metrics?.apr !== undefined && metrics.apr !== null ? `${metrics.apr.toFixed(2)}% APR` : '-'}
                    </div>
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
