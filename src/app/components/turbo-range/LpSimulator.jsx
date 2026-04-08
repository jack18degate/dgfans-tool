"use client";
import React, { useState, useMemo } from 'react';
import { Calculator, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

const LpSimulator = ({ pool, activeRange }) => {
  const [capital, setCapital] = useState(1000);

  // Calcoli Matematici Avanzati (CLMM V3)
  const stats = useMemo(() => {
    if (!pool || !activeRange) return null;

    const pSpot = pool.price;
    const pLower = activeRange.min;
    const pUpper = activeRange.max;

    // Se fuori range o errato
    if (pSpot <= pLower || pSpot >= pUpper) return null;

    // 1. Multiplier (Capital Efficiency)
    // Formula standard UniV3/Raydium per il boost della concentrazione
    const r = pUpper / pLower;
    // Evitiamo divisioni per zero o range infiniti
    const amplifier = (r > 1) ? (1 / (1 - Math.sqrt(1 / r))) : 1;
    // Cap al massimo 200x per questioni di UI (teoricamente può essere infinito)
    const cappedAmplifier = Math.min(amplifier, 200);

    // 2. Stimatore di Fees Giornaliere
    // Assumiamo che base APR % sia senza concentrazione (o mitigato). 
    // Lo moltiplichiamo per l'efficienza proporzionata.
    const baseApr = pool.day?.apr || 15; // fallback al 15% annuale
    const concentratedApr = baseApr * (cappedAmplifier / 10); // /10 come fattore di attenuazione per TVL ratio
    
    const dailyFeePct = concentratedApr / 365;
    const dailyFeeUsd = capital * (dailyFeePct / 100);

    // 3. Matrice Impermanent Loss (DIL)
    // Selezioniamo 4 scenari di shift del prezzo
    const shifts = [-10, -5, 5, 10];
    
    const ilMatrix = shifts.map(shift => {
      const pNew = pSpot * (1 + shift / 100);
      let value = 0;
      let ilPercent = 0;

      // Se esce dal range al ribasso (Tieni solo il Token Risk -> Crollo di valore)
      if (pNew <= pLower) {
         value = capital * Math.sqrt(pNew / pSpot);
         ilPercent = (value - capital) / capital * 100;
      } 
      // Se esce dal range al rialzo (Tieni tutto in Stablecoin -> Perdi il pump, ma il valore in $ è salvo)
      else if (pNew >= pUpper) {
         value = capital * Math.sqrt(pUpper / pSpot);
         ilPercent = (value - (capital * (1+shift/100)/2 + capital/2)) / capital * 100; 
      } 
      // Se resta nel range (Equazione standard IL moltiplicata per la leva)
      else {
         const k = pNew / pSpot;
         const stdIL = (2 * Math.sqrt(k)) / (1 + k) - 1;
         ilPercent = stdIL * 100 * (cappedAmplifier / 5);
         value = capital * (1 + ilPercent / 100);
      }

      return {
        shift,
        newPrice: pNew,
        value,
        ilPercent,
        pnl7: value - capital + (dailyFeeUsd * 7),
        pnl30: value - capital + (dailyFeeUsd * 30),
        pnl90: value - capital + (dailyFeeUsd * 90)
      };
    });

    return {
      amplifier: cappedAmplifier,
      concentratedApr,
      dailyFeeUsd,
      ilMatrix
    };
  }, [pool, activeRange, capital]);

  if (!pool) return null;

  return (
    <div className="bg-[#0B0B0F] border border-border rounded-lg p-4 mt-6">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
        <div>
           <h3 className="text-[15px] font-bold text-primary flex items-center gap-2">
             <Calculator className="w-4 h-4" /> Capital & Yield Simulator
           </h3>
           <p className="text-xs text-textMuted mt-0.5">Analisi Previsionale su protocollo V3 Concentrato</p>
        </div>
      </div>

      {!activeRange ? (
         <div className="py-6 text-center text-sm text-textMuted/50 border border-dashed border-border/50 rounded-lg">
            Seleziona una strategia ("Massima Resa", "Media", etc.) per avviare il simulatore di efficienza.
         </div>
      ) : stats ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* Pannello Input & Yield */}
           <div className="lg:col-span-1 space-y-4">
              <div>
                 <label className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-1.5 block">Dollari da Allocare</label>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <input 
                       type="number"
                       value={capital}
                       onChange={(e) => setCapital(Number(e.target.value) || 0)}
                       className="bg-[#1a1b23] border border-border text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-9 p-2.5 font-mono"
                    />
                 </div>
              </div>

              <div className="bg-[#15161c] rounded-lg p-3 border border-border/50">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-textMuted">Multiplier (Efficienza Leva)</span>
                    <span className="text-xs font-bold text-white">{stats.amplifier.toFixed(2)}x</span>
                 </div>
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-textMuted">Stima APR Range</span>
                    <span className="text-xs font-bold text-primary">{stats.concentratedApr.toFixed(1)}%</span>
                 </div>
                 <div className="flex justify-between items-center pt-2 mt-2 border-t border-border/50">
                    <span className="text-sm font-semibold text-white">Daily Fees (Stima)</span>
                    <span className="text-sm font-bold text-green-400">+${stats.dailyFeeUsd.toFixed(2)}</span>
                 </div>
              </div>
           </div>

           {/* Matrice IL (Impermanent Loss) */}
           <div className="lg:col-span-2">
              <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                 <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" /> Profilo di Rischio Impermanent Loss (Matrice)
              </h4>
              <div className="overflow-x-auto">
                 <table className="w-full text-left text-xs bg-[#15161c] rounded-lg overflow-hidden border border-border/50">
                    <thead>
                       <tr className="bg-[#1a1b23] border-b border-border text-textMuted">
                          <th className="p-2.5">Shift Prezzo</th>
                          <th className="p-2.5">Riserva (Asset + IL)</th>
                          <th className="p-2.5 text-right"><span className="hidden sm:inline">PnL </span>(7gg)</th>
                          <th className="p-2.5 text-right"><span className="hidden sm:inline">PnL </span>(30gg)</th>
                          <th className="p-2.5 text-right flex items-center justify-end gap-1"><TrendingUp className="w-3 h-3"/> (90gg)</th>
                       </tr>
                    </thead>
                    <tbody>
                       {stats.ilMatrix.map((scen, i) => {
                          const l7 = scen.pnl7 < 0;
                          const l30 = scen.pnl30 < 0;
                          const l90 = scen.pnl90 < 0;
                          return (
                             <tr key={i} className="border-b border-[#1a1b23] last:border-0 hover:bg-[#1a1b23]/50">
                                <td className={`p-2.5 font-bold ${scen.shift < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                   {scen.shift > 0 ? '+' : ''}{scen.shift}%
                                   <div className="text-[10px] text-textMuted font-mono font-normal">@ ${scen.newPrice.toFixed(4)}</div>
                                </td>
                                <td className="p-2.5 text-white">
                                   <div className="flex flex-col gap-0.5">
                                      <span className="font-mono text-xs">${scen.value.toFixed(1)}</span>
                                      <span className={`text-[9px] w-fit px-1.5 py-0.5 rounded ${scen.ilPercent < -2 ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                         IL: {scen.ilPercent.toFixed(2)}%
                                      </span>
                                   </div>
                                </td>
                                <td className={`p-2.5 text-right font-bold ${l7 ? 'text-red-500' : 'text-primary'}`}>
                                   {l7 ? '' : '+'}${scen.pnl7.toFixed(1)}
                                </td>
                                <td className={`p-2.5 text-right font-bold ${l30 ? 'text-red-500' : 'text-primary'}`}>
                                   {l30 ? '' : '+'}${scen.pnl30.toFixed(1)}
                                </td>
                                <td className={`p-2.5 text-right font-bold ${l90 ? 'text-red-500' : 'text-primary'}`}>
                                   {l90 ? '' : '+'}${scen.pnl90.toFixed(0)}
                                </td>
                             </tr>
                          )
                       })}
                    </tbody>
                 </table>
                 <p className="text-[10px] text-textMuted/60 mt-2 text-right">
                    *Il PnL Netto (Profit and Loss) calcola i Dollari generati dalle Fees del Vault sommati alla perdita del Capitale Originale (IL) sullo shift.
                 </p>
              </div>
           </div>

        </div>
      ) : (
         <div className="py-6 text-center text-sm text-yellow-500/50 border border-dashed border-yellow-500/20 bg-yellow-500/5 rounded-lg">
            Attenzione: Il prezzo attuale è fuori dal tuo Range. Rialloca la strategia prima di calcolare i profitti.
         </div>
      )}
    </div>
  );
};

export default LpSimulator;
