"use client";
import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Loader2, RefreshCw, Eye, ExternalLink } from 'lucide-react';

const RPC_PUBLIC = 'https://solana-rpc.publicnode.com';
const FALLBACK_CHAIN = [RPC_PUBLIC];

const CLMM_PROGRAM = new PublicKey('CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK');

// Storage persistente sicura per gestire i BigInt
const loadCache = () => {
   try {
      const saved = localStorage.getItem('whaleScanCacheV1');
      if (saved) {
         return JSON.parse(saved, (k, v) => {
            if (typeof v === 'string' && v.endsWith('n') && !isNaN(v.slice(0, -1))) {
               return BigInt(v.slice(0, -1));
            }
            return v;
         });
      }
   } catch (e) {
      console.warn("Lettura cache fallita", e);
   }
   return {};
};

const saveCache = (cache) => {
   try {
      localStorage.setItem('whaleScanCacheV1', JSON.stringify(cache, (k, v) => 
         typeof v === 'bigint' ? v.toString() + 'n' : v
      ));
   } catch (e) {
      console.warn("Scrittura cache fallita", e);
   }
};

// Inizializzazione cache globale dal LocalStorage
const whaleCache = loadCache();

const WhaleScanner = ({ pool, onWhaleHover }) => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastScan, setLastScan] = useState(null);
  const [activeSpy, setActiveSpy] = useState(null);

  useEffect(() => {
    if (!pool || !pool.id) return;
    
    // Passivo: Controlla se la cache è più vecchia di 4 Ore
    let shouldScan = true;
    if (whaleCache[pool.id]) {
       setPositions(whaleCache[pool.id].positions);
       setLastScan(whaleCache[pool.id].lastScan);
       setError(null);
       
       // check age (ms) -> 4 hours = 4 * 60 * 60 * 1000
       const ageMs = Date.now() - (whaleCache[pool.id].timestampMillis || 0);
       if (ageMs < 4 * 60 * 60 * 1000 && whaleCache[pool.id].timestampMillis) {
          shouldScan = false;
       }
    } else {
       setPositions([]);
       setLastScan(null);
    }
    setActiveSpy(null);
    
    if (shouldScan) {
       scanWhales();
    }

    // Interval Timer: Esegui aggiornamento passivo ogni 4 Ore se resta in pagina
    const interval = setInterval(() => {
       scanWhales();
    }, 4 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [pool?.id]);

  const formatAddress = (addr) => addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : 'Unknown';

  const calculatePrice = (tick) => {
    if (!pool.mintA || !pool.mintB) return 0;
    const decA = pool.mintA.decimals || 0;
    const decB = pool.mintB.decimals || 0;
    const rawPrice = Math.pow(1.0001, tick) * Math.pow(10, decA - decB);
    return rawPrice;
  };

  const scanWhales = async () => {
    if (!pool || !pool.id) return;
    setLoading(true);
    setError(null);
    setPositions([]);
    
    try {
      const getAccounts = async (rpcUrl) => {
        const conn = new Connection(rpcUrl);
        return await conn.getProgramAccounts(CLMM_PROGRAM, {
          filters: [
            { dataSize: 281 },
            { memcmp: { offset: 41, bytes: pool.id } }
          ]
        });
      };

      let accs = null;
      let lastErr = null;
      
      // Ordine rotazionale casuale ad ogni scan per non tartassare lo stesso RPC
      const shuffledChain = [...FALLBACK_CHAIN].sort(() => Math.random() - 0.5);

      for (const rpcUrl of shuffledChain) {
         try {
            accs = await getAccounts(rpcUrl);
            break; // Success! Esci dal loop di fallback
         } catch (err) {
            console.warn(`RPC Fallito (${rpcUrl.split('/')[2]}): attesa di 1000ms e tento il prossimo...`);
            lastErr = err;
            // Delay per evitare che il blocco per flood IP si ripercuota sugli altri
            await new Promise(r => setTimeout(r, 1000)); 
         }
      }

      if (!accs) {
         throw lastErr || new Error("Tutti i nodi RPC sono falliti");
      }

      if (accs.length === 0) {
        setError("Nessuna posizione trovata on-chain per questa pool.");
        setLoading(false);
        return;
      }

      // 2. Decode Data and Map
      let parsed = accs.map(a => {
        const data = a.account.data;
        const nftMint = new PublicKey(data.subarray(9, 41)).toBase58();
        const tickLower = data.readInt32LE(73);
        const tickUpper = data.readInt32LE(77);
        
        // Read 128-bit unsigned integer (Liquidity)
        const lower64 = BigInt(data.readBigUInt64LE(81));
        const upper64 = BigInt(data.readBigUInt64LE(89));
        const liquidity = (upper64 << 64n) + lower64;
        
        return {
          pubkey: a.pubkey.toBase58(),
          nftMint,
          tickLower,
          tickUpper,
          liquidity,
          priceLower: calculatePrice(tickLower),
          priceUpper: calculatePrice(tickUpper),
          owner: null // Will fetch for top X
        };
      });

      // Rimuoviamo posizioni vuote e ordiniamo per liquidity
      parsed = parsed.filter(p => p.liquidity > 0n);
      parsed.sort((a, b) => (a.liquidity < b.liquidity ? 1 : -1));

      // Prendiamo solo i Top 15 per evitare troppe chiamate DAS API
      const topPositions = parsed.slice(0, 15);
      
      // Calcoliamo la \% approssimativa rispetto al totale scansionato
      const totalLiq = parsed.reduce((sum, p) => sum + p.liquidity, 0n);

      // Nessuna DAS API attiva (RPC Pubblico)
      // Disabilitato resolveOwners per proteggere le chiavi.
      topPositions.forEach(p => p.owner = "Modalità Passiva Pubblica");

      // Formattazione finale per UI
      const finalData = topPositions.map((p, i) => {
         const sharePercent = totalLiq > 0n ? Number((p.liquidity * 10000n) / totalLiq) / 100 : 0;
         const estimatedUsd = pool.tvl * (sharePercent / 100);
         return {
            ...p,
            rank: i + 1,
            sharePercent,
            estimatedUsd
         };
      });

      const timestamp = new Date().toLocaleTimeString();
      setPositions(finalData);
      setLastScan(timestamp);
      
      // Salviamo in cache locale (Memoria + LocalStorage)
      whaleCache[pool.id] = { positions: finalData, lastScan: timestamp, timestampMillis: Date.now() };
      saveCache(whaleCache);

    } catch (err) {
      console.error(err);
      setError("Errore durante l'estrazione RPC. Il nodo potrebbe aver rigettato la query per limiti di carico.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSpy = (p) => {
     if (activeSpy === p.pubkey) {
        setActiveSpy(null);
        if (onWhaleHover) onWhaleHover(null);
     } else {
        setActiveSpy(p.pubkey);
        if (onWhaleHover) onWhaleHover({ min: p.priceLower, max: p.priceUpper });
     }
  };

  if (!pool || pool.isExternal) return null;

  return (
    <div className="bg-[#0B0B0F] border border-border rounded-lg p-4 flex flex-col mt-6">
      <div className="flex flex-col mb-4 border-b border-border pb-3">
         <h3 className="text-[15px] font-bold text-primary flex items-center gap-2">
            🐋 Whale Tracker <span className="text-xs font-normal text-textMuted">(Top LPs On-Chain)</span>
         </h3>
         <p className="text-xs text-textMuted mt-0.5">Scansione passiva 4h (Rete Pubblica). Refresh disabilitato.</p>
      </div>

      {loading && positions.length === 0 && (
         <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-sm font-medium text-textMuted">Compilazione della mappa posizioni...</span>
         </div>
      )}

      {error && !loading && (
         <div className="py-4 text-center text-sm text-red-400 font-medium">{error}</div>
      )}

      {positions.length > 0 && !loading && (
         <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-textMuted border-collapse">
               <thead>
                  <tr className="uppercase border-b border-border text-[10px]">
                     <th className="py-2 pl-2 w-8">Rank</th>
                     <th className="py-2">Owner Wallet</th>
                     <th className="py-2">Range Allocazione ($)</th>
                     <th className="py-2 text-right">Dimensione / Quota</th>
                     <th className="py-2 pr-2 text-center w-16">Spy</th>
                  </tr>
               </thead>
               <tbody>
                  {positions.map((p) => (
                     <tr key={p.pubkey} className="border-b border-[#1a1b23] hover:bg-[#15161c] transition-colors group">
                        <td className="py-3 pl-2 font-bold text-text">#{p.rank}</td>
                        <td className="py-3">
                           <a href={`https://solscan.io/account/${p.owner || p.nftMint}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors text-text/90 font-mono">
                              {p.owner ? formatAddress(p.owner) : <span className="italic opacity-50">Risoluzione...</span>}
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                           </a>
                           <div className="text-[9px] opacity-40 font-mono mt-0.5">NFT: {formatAddress(p.nftMint)}</div>
                        </td>
                        <td className="py-3 text-white font-mono">
                           ${p.priceLower.toFixed(4)} <span className="text-textMuted mx-1">→</span> ${p.priceUpper.toFixed(4)}
                        </td>
                        <td className="py-3 text-right">
                           <div className="font-bold text-white tracking-tight">
                             ${p.estimatedUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                           </div>
                           <div className="font-mono text-[9px] text-primary">{p.sharePercent}% del fondo</div>
                           <div className="w-full bg-[#1a1b23] rounded-full h-1 mt-1 overflow-hidden flex justify-end">
                              <div className="bg-primary h-1 rounded-full" style={{ width: `${Math.min(100, Math.max(1, p.sharePercent))}%` }}></div>
                           </div>
                        </td>
                        <td className="py-3 pr-2 text-center">
                           <button 
                              onClick={() => toggleSpy(p)}
                              className={`w-7 h-7 flex items-center justify-center rounded-md border transition-colors mx-auto ${activeSpy === p.pubkey ? 'border-purple-400 bg-purple-500/30 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300'}`}
                              title={activeSpy === p.pubkey ? "Disabilita Spy" : "Evidenzia su grafico"}
                           >
                              <Eye className="w-3.5 h-3.5" />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            
            <div className="text-[10px] text-textMuted/60 text-right mt-3">
               Ultimo aggiornamento sincrono: {lastScan}
            </div>
         </div>
      )}
      
      {!loading && !error && positions.length === 0 && (
          <div className="py-6 text-center text-sm text-textMuted/50 border border-dashed border-border/50 rounded-lg">
             Pronto alla scansione topologica. Clicca su "Avvia Scansione" per interrogare il nodo RPC.
          </div>
      )}
    </div>
  );
};

export default WhaleScanner;
