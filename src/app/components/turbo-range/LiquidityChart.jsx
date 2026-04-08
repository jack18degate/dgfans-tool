"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Loader2, Activity, ShieldAlert, BarChart3, Binary } from 'lucide-react';
import WhaleScanner from './WhaleScanner';
import LpSimulator from './LpSimulator';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const LiquidityChart = ({ pool }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Per focalizzare il grafico, mostriamo una percentuale dei tick attorno al prezzo attuale. Impostato a 100 di base per visione globale.
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Range strategico selezionato dall'utente
  const [activeRangeId, setActiveRangeId] = useState(null);
  const chartRef = useRef(null);
  const activeWhaleRangeRef = useRef(null);
  const [activeFeatureTab, setActiveFeatureTab] = useState('simulator'); // 'simulator' o 'whale'

  useEffect(() => {
    if (!pool || !pool.id) return;
    
    // Reset di stato per evitare "sfasamenti" quando si cambia pool rapidamente
    setData([]);
    setZoomLevel(100);
    setActiveRangeId(null);
    
    const fetchLiquidity = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://api-v3.raydium.io/pools/line/position?id=${pool.id}`);
        if (response.data && response.data.success && response.data.data?.line) {
          // Parse string liquidity to numbers
          const parsedLine = response.data.data.line.map(item => ({
            price: Number(item.price),
            liquidity: Number(item.liquidity) / 1000000, // Dividiamo per il fattore di conversione tipico (1e6) per scalare i valori grezzi
            tick: item.tick
          })).sort((a, b) => a.price - b.price);
          
          setData(parsedLine);
        } else {
          setError('Failed to fetch valid line data');
        }
      } catch (err) {
        console.error("Error fetching line:", err);
        setError('Error catching API data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLiquidity();
  }, [pool]);

  const chartData = useMemo(() => {
    if (!data.length || !pool) return null;

    const currentPrice = pool.price;
    let closestIndex = 0;
    let minDiff = Infinity;
    
    data.forEach((d, i) => {
      const diff = Math.abs(d.price - currentPrice);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    });

    const range = Math.max(10, Math.floor(data.length * (zoomLevel / 100) / 2));
    const startIndex = Math.max(0, closestIndex - range);
    const endIndex = Math.min(data.length - 1, closestIndex + range);
    const visibleData = data.slice(startIndex, endIndex);

    // Assicuriamoci che il grafico includa visivamente almeno il prezzo corrente
    let minPriceVis = visibleData[0]?.price || currentPrice;
    let maxPriceVis = visibleData[visibleData.length - 1]?.price || currentPrice;
    
    // Espandiamo per non far restare la linea sul bordo perfetto
    const pad = Math.max((maxPriceVis - minPriceVis) * 0.05, currentPrice * 0.02);
    const minPrice = Math.min(minPriceVis, currentPrice) - pad;
    const maxPrice = Math.max(maxPriceVis, currentPrice) + pad;
    
    // Insight Calculations: 
    // Calcoliamo la liquidità a -10% e +10%
    let upLiq = 0;
    let downLiq = 0;
    const lowerBound = currentPrice * 0.90;
    const upperBound = currentPrice * 1.10;

    data.forEach(d => {
      if (d.price >= lowerBound && d.price < currentPrice) downLiq += d.liquidity;
      if (d.price > currentPrice && d.price <= upperBound) upLiq += d.liquidity;
    });

    let bias = 0;
    if (downLiq > upLiq * 1.3) bias = 1;
    else if (upLiq > downLiq * 1.3) bias = -1;

    const formatP = (p) => p < 0.0001 ? p.toExponential(3) : p.toFixed(4);
    const calcRange = (spread, shift) => {
      const center = currentPrice * (1 + shift);
      return { min: formatP(Math.max(0, center * (1 - spread))), max: formatP(center * (1 + spread)) };
    };

    const ranges = {
       degen: bias === 1 ? calcRange(0.02, 0.015) : bias === -1 ? calcRange(0.02, -0.015) : calcRange(0.015, 0),
       balanced: bias === 1 ? calcRange(0.06, 0.03) : bias === -1 ? calcRange(0.06, -0.03) : calcRange(0.05, 0),
       relax: bias === 1 ? calcRange(0.20, 0.05) : bias === -1 ? calcRange(0.20, -0.05) : calcRange(0.15, 0)
    };

    return {
      minPrice, 
      maxPrice,
      insight: { upLiq, downLiq, lowerBound, upperBound, bias, ranges },
      datasets: [
        {
          label: 'Liquidity',
          data: visibleData.map(d => ({ x: d.price, y: d.liquidity })),
          fill: true,
          borderColor: '#34D399',
          backgroundColor: 'rgba(52, 211, 153, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          tension: 0.1,
        }
      ],
      visibleData
    };
  }, [data, pool, zoomLevel]);

  // Usiamo un ref per i dati per bypassare il lifecycle di ChartJS
  const chartDataRef = useRef(null);
  useEffect(() => {
     chartDataRef.current = chartData;
  }, [chartData]);
  
  const activeRangeIdRef = useRef(null);
  useEffect(() => {
     activeRangeIdRef.current = activeRangeId;
  }, [activeRangeId]);

  const handleRangeClick = (id) => {
     const newId = id === activeRangeId ? null : id;
     setActiveRangeId(newId);
     activeRangeIdRef.current = newId; // Sync immediato prima del repaint
     setTimeout(() => {
        if (chartRef.current) chartRef.current.update();
     }, 0);
  };

  const handleWhaleHover = (range) => {
     activeWhaleRangeRef.current = range;
     if (chartRef.current) chartRef.current.update();
  };

  const currentPricePlugin = useMemo(() => ({
    id: 'currentPriceLine',
    afterDraw: (chart) => {
      if (!pool || !chartData) return;
      const currentPrice = pool.price;
      const xAxis = chart.scales.x;
      const yAxis = chart.scales.y;

      const pixelX = xAxis.getPixelForValue(currentPrice);

      // Disegna solo se la coordinata calcolata ricade nella finestra
      if (pixelX !== undefined && pixelX >= chart.chartArea.left && pixelX <= chart.chartArea.right) {
         const ctx = chart.ctx;
         ctx.save();
         
         // -10% a +10% Shaded Zone Background
         const leftZonePx = Math.max(xAxis.getPixelForValue(chartData.insight.lowerBound), chart.chartArea.left);
         const rightZonePx = Math.min(xAxis.getPixelForValue(chartData.insight.upperBound), chart.chartArea.right);
         if (rightZonePx > leftZonePx) {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.05)'; // Reddish transparent insight core
            ctx.fillRect(leftZonePx, chart.chartArea.top, rightZonePx - leftZonePx, chart.chartArea.bottom - chart.chartArea.top);
            
            ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
            ctx.font = 'bold 9px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('HOT ZONE ±10%', leftZonePx + 4, chart.chartArea.top + 10);
         }

         const activeId = activeRangeIdRef.current;
         const currentChartData = chartDataRef.current;
         
         // Target LP Range Background (Fascio Verde)
         if (activeId && currentChartData && currentChartData.insight) {
            const activeRange = currentChartData.insight.ranges[activeId];
            if (activeRange) {
               const minPx = Math.max(xAxis.getPixelForValue(Number(activeRange.min)), chart.chartArea.left);
               const maxPx = Math.min(xAxis.getPixelForValue(Number(activeRange.max)), chart.chartArea.right);
               if (maxPx > minPx) {
                  ctx.fillStyle = 'rgba(52, 211, 153, 0.15)'; // Verde trasparente
                  ctx.fillRect(minPx, chart.chartArea.top, maxPx - minPx, chart.chartArea.bottom - chart.chartArea.top);
                  
                  // Bordi del fascio
                  ctx.strokeStyle = 'rgba(52, 211, 153, 0.8)';
                  ctx.lineWidth = 1.5;
                  ctx.beginPath();
                  ctx.moveTo(minPx, chart.chartArea.top);
                  ctx.lineTo(minPx, chart.chartArea.bottom);
                  ctx.moveTo(maxPx, chart.chartArea.top);
                  ctx.lineTo(maxPx, chart.chartArea.bottom);
                  ctx.stroke();

                  ctx.fillStyle = 'rgba(52, 211, 153, 1)';
                  ctx.font = 'bold 10px sans-serif';
                  ctx.textAlign = 'center';
                  ctx.fillText('🎯 TARGET LP', minPx + (maxPx - minPx) / 2, chart.chartArea.top + 28);
               }
            }
         }

         // Whale Spy Mode Background (Fascio Viola)
         const whaleRange = activeWhaleRangeRef.current;
         if (whaleRange) {
            const minPx = Math.max(xAxis.getPixelForValue(Number(whaleRange.min)), chart.chartArea.left);
            const maxPx = Math.min(xAxis.getPixelForValue(Number(whaleRange.max)), chart.chartArea.right);
            if (maxPx > minPx) {
               ctx.fillStyle = 'rgba(168, 85, 247, 0.15)'; // Viola trasparente
               ctx.fillRect(minPx, chart.chartArea.top, maxPx - minPx, chart.chartArea.bottom - chart.chartArea.top);
               
               // Bordi del fascio Whale
               ctx.strokeStyle = 'rgba(168, 85, 247, 0.8)';
               ctx.lineWidth = 1.5;
               ctx.beginPath();
               ctx.moveTo(minPx, chart.chartArea.top);
               ctx.lineTo(minPx, chart.chartArea.bottom);
               ctx.moveTo(maxPx, chart.chartArea.top);
               ctx.lineTo(maxPx, chart.chartArea.bottom);
               ctx.stroke();

               ctx.fillStyle = 'rgba(168, 85, 247, 1)';
               ctx.font = 'bold 10px sans-serif';
               ctx.textAlign = 'center';
               ctx.fillText('👀 WHALE SPY', minPx + (maxPx - minPx) / 2, chart.chartArea.top + 45);
            }
         }

         // -----------------------------------------
         // V3 OVERLAYS: VOLATILITY & VPVR HEATMAP
         // -----------------------------------------
         
         // 1. Bande di Volatilità Storica (Safety Guardrails +/- 5%)
         const volLowerPx = xAxis.getPixelForValue(pool.price * 0.95);
         const volUpperPx = xAxis.getPixelForValue(pool.price * 1.05);
         
         ctx.save();
         ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)'; // Giallo
         ctx.lineWidth = 1;
         ctx.setLineDash([4, 4]);

         // Banda Inferiore (-5%)
         if (volLowerPx >= chart.chartArea.left && volLowerPx <= chart.chartArea.right) {
            ctx.beginPath();
            ctx.moveTo(volLowerPx, chart.chartArea.bottom);
            ctx.lineTo(volLowerPx, chart.chartArea.top);
            ctx.stroke();
         }
         // Banda Superiore (+5%)
         if (volUpperPx >= chart.chartArea.left && volUpperPx <= chart.chartArea.right) {
            ctx.beginPath();
            ctx.moveTo(volUpperPx, chart.chartArea.bottom);
            ctx.lineTo(volUpperPx, chart.chartArea.top);
            ctx.stroke();
         }
         ctx.restore();

         // 2. VPVR Proxy (Zone di concentrazione Y-Axis Proxy)
         // Creeremo un indicatore visivo "sfumato" sul bordo sinistro
         // che simula i blocchi di trading volume (heat map laterale orizzontale)
         ctx.save();
         const dataPoints = chart.data.datasets[0].data;
         const maxTickY = Math.max(...dataPoints.map(d => d.y));
         
         dataPoints.forEach(point => {
            if (!point.y || point.y < maxTickY * 0.05) return; // ignora noise
            
            const pointPxX = xAxis.getPixelForValue(point.x);
            // Salta i punti fuori canvas
            if (pointPxX < chart.chartArea.left || pointPxX > chart.chartArea.right) return;
            
            // Intensità relativa del blocco di volume proxy
            const intensity = point.y / maxTickY; 
            const histHeight = intensity * 120; // max length in px laterali
            // Disegnamo barre orizzontali dal fondo
            ctx.fillStyle = `rgba(249, 115, 22, ${intensity * 0.3})`; // Arancio heatmap
            ctx.fillRect(pointPxX - 1, chart.chartArea.bottom - histHeight, 3, histHeight);
         });
         ctx.restore();

         // Prezzo Current Line & Tracer Base
         ctx.beginPath();
         ctx.setLineDash([5, 5]);
         ctx.moveTo(pixelX, chart.chartArea.top);
         ctx.lineTo(pixelX, chart.chartArea.bottom);
         ctx.lineWidth = 2;
         ctx.strokeStyle = '#EF4444'; 
         ctx.stroke();

         ctx.fillStyle = '#EF4444';
         ctx.font = 'bold 10px sans-serif';
         ctx.textAlign = 'center';
         
         let textX = pixelX;
         if (textX < chart.chartArea.left + 40) textX = chart.chartArea.left + 40;
         if (textX > chart.chartArea.right - 40) textX = chart.chartArea.right - 40;
         
         ctx.fillText('Current Price', textX, chart.chartArea.top + 15);
         ctx.restore();
      }
    }
  }), [pool]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#181920',
        titleColor: '#34D399',
        bodyColor: '#E2E8F0',
        borderColor: '#282A36',
        borderWidth: 1,
        callbacks: {
          title: (items) => `Price: ${items[0].raw.x}`,
          label: (item) => `Liquidity: ${Number(item.raw.y).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        min: chartData ? chartData.minPrice : undefined,
        max: chartData ? chartData.maxPrice : undefined,
        grid: {
          color: '#282A36',
          drawBorder: false,
        },
        ticks: { 
          color: '#94A3B8', 
          maxTicksLimit: 10,
          callback: function(value) {
            return value < 0.001 ? value.toExponential(2) : value.toFixed(4);
          }
        }
      },
      y: {
        grid: {
          color: '#282A36',
          drawBorder: false,
        },
        ticks: { 
          color: '#94A3B8',
          callback: (value) => 
            value >= 1e9 ? (value / 1e9).toFixed(2) + 'B' : 
            value >= 1e6 ? (value / 1e6).toFixed(2) + 'M' : 
            value >= 1e3 ? (value / 1e3).toFixed(2) + 'K' : 
            value
        }
      }
    }
  };

  if (!pool) return (
    <div className="bg-surface rounded-xl border border-border flex items-center justify-center p-8 h-full text-textMuted">
      Seleziona una CLMM Pool dal pannello per analizzare le inefficienze di mercato
    </div>
  );

  return (
    <div style={{ background: 'rgba(12, 14, 26, 0.72)', backdropFilter: 'blur(24px) saturate(160%)', WebkitBackdropFilter: 'blur(24px) saturate(160%)', border: '1px solid rgba(255, 255, 255, 0.06)', borderTop: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }} className="flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-primary">{pool.mintA?.symbol}/{pool.mintB?.symbol}</span>
            <span className="text-text">Liquidity Map</span>
          </h2>
          <p className="text-sm text-textMuted mt-1">Current Price: ${pool.price?.toFixed(4)}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-sm text-textMuted whitespace-nowrap">Zoom:</label>
          <input 
            type="range" 
            min="2" max="100" 
            value={zoomLevel} 
            onChange={(e) => setZoomLevel(Number(e.target.value))}
            className="w-24 md:w-32 accent-primary" 
          />
        </div>
      </div>

      <div className="relative" style={{ height: '400px' }}>
        {loading && (
           <div className="absolute inset-0 bg-surface/80 flex flex-col items-center justify-center z-10 gap-3">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
             <p className="text-textMuted">Calcolo distribuzione liquidità in corso...</p>
           </div>
        )}
        
        {error && !loading && (
           <div className="absolute inset-0 flex items-center justify-center z-10 text-red-400">
             {error}
           </div>
        )}

        {chartData && (
          <div className="absolute inset-0">
            <Line ref={chartRef} key={pool.id} data={chartData} options={chartOptions} plugins={[currentPricePlugin]} />
          </div>
        )}
      </div>

      {chartData && chartData.insight && !loading && !error && (
        <div style={{ background: 'rgba(12, 14, 26, 0.85)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 'var(--radius-md)', padding: '1rem' }} className="mt-6 flex flex-col gap-3">
           <h3 className="text-sm font-bold text-primary flex items-center gap-2">
             💡 Analisi Avanzata Ottimizzazione (Hot Zone ±10%)
           </h3>
           <div className="text-xs text-textMuted leading-relaxed text-justify">
             Il Modulo Analitico analizza la distribuzione di tick attivi e calcola il peso relativo della liquidità concentrata. 
             Attraverso l'identificazione di deviazioni standard e zone di "Saturazione" o "Decompressione", fornisce metriche quantitative su dove posizionare le fasce di fornitura (LP) per minimizzare l'Impermanent Loss sistemico o sovra-estrarre Yield percentualmente maggiore su direzionalità attesa, aggirando le "Traction Walls" competitive.
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="bg-surface border border-border p-3 rounded-md">
                 <div className="text-xs text-textMuted uppercase font-semibold">Resistenza Passiva al Ribasso (-10%)</div>
                 <div className="text-lg font-bold mt-1 text-red-400">
                    {chartData.insight.downLiq > chartData.insight.upLiq * 1.5 ? '🔴 Alta Saturazione' : chartData.insight.downLiq < chartData.insight.upLiq * 0.6 ? '🟢 Decompressione Ottimale' : '🟡 Range Bilanciato'}
                 </div>
                 <div className="text-xs mt-1 opacity-70">Coefficiente Volumetrico: {chartData.insight.downLiq.toLocaleString('en-US', {maximumFractionDigits:0})}</div>
              </div>
              <div className="bg-surface border border-border p-3 rounded-md">
                 <div className="text-xs text-textMuted uppercase font-semibold">Resistenza Passiva al Rialzo (+10%)</div>
                 <div className="text-lg font-bold mt-1 text-green-400">
                    {chartData.insight.upLiq > chartData.insight.downLiq * 1.5 ? '🔴 Alta Saturazione' : chartData.insight.upLiq < chartData.insight.downLiq * 0.6 ? '🟢 Decompressione Ottimale' : '🟡 Range Bilanciato'}
                 </div>
                 <div className="text-xs mt-1 opacity-70">Coefficiente Volumetrico: {chartData.insight.upLiq.toLocaleString('en-US', {maximumFractionDigits:0})}</div>
              </div>
           </div>

           <div className="mt-2 text-xs font-medium px-3 py-2 bg-[#1a1b23] text-text border border-border rounded">
             <span className="font-bold text-primary">Strategia Suggerita (Delta Allocation): </span> 
             {chartData.insight.bias === 1
                ? "Asimmetria Eccessiva Inferiore. La concentrazione liquida a ridosso del downside è strutturalmente satura, riducendo le APY. Una fornitura JIT asimmetrica (sbilanciata al rialzo) isolerà il volume in salita con un frazionamento della share drasticamente a tuo favore." 
                : chartData.insight.bias === -1
                ? "Inversione del Muro di Liquidità verso l'alto. Fortissima competizione di Market Maker limit-seller in fase di pump. Ottima l'azione Delta-Neutra o il piazzamento di LP a sconto (sbilanciato < Current Price): in fase di drawdown improvviso l'acquisizione delle trading fee opererà col 100% dell'efficienza capitale su ampi delta price."
                : "Equilibrio Gaussiano V3 sul pricing locale. Nessuna deviazione vantaggiosa rilevata in questo range asimmetrico. Per un Alpha superiore, posizionare Bande Strette simmetriche a tolleranza ristretta (ad altissimo rischio di out-of-range) o effettuare il cross-reference su fee tiers ad alto rendimento isolato."}
           </div>

           <div className="mt-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div 
                 onClick={() => handleRangeClick('degen')}
                 className={`bg-[#1a1b23] border ${activeRangeId === 'degen' ? 'border-primary ring-1 ring-primary/50 shadow-[0_0_15px_rgba(52,211,153,0.15)] bg-primary/5' : 'border-red-500/30 hover:border-primary/80'} p-2.5 rounded-md flex flex-col items-center text-center cursor-pointer transition-all duration-200 group`}
              >
                 <div className={`text-[10px] uppercase font-bold tracking-wider mb-1 transition-colors ${activeRangeId === 'degen' ? 'text-primary' : 'text-red-400 group-hover:text-primary'}`}>🔥 Massima Resa</div>
                 <div className="text-[10px] text-textMuted leading-tight mb-2 pointer-events-none">Ultra-concentrato. Altissime Fee, altissimo rischio Out-of-Range.</div>
                 <div className={`text-xs font-mono px-2 py-1 rounded w-full border border-border pointer-events-none transition-colors ${activeRangeId === 'degen' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-[#0B0B0F] text-text'}`}>
                    {chartData.insight.ranges.degen.min} - {chartData.insight.ranges.degen.max}
                 </div>
              </div>

              <div 
                 onClick={() => handleRangeClick('balanced')}
                 className={`bg-[#1a1b23] border ${activeRangeId === 'balanced' ? 'border-primary ring-1 ring-primary/50 shadow-[0_0_15px_rgba(52,211,153,0.15)] bg-primary/5' : 'border-yellow-500/30 hover:border-primary/80'} p-2.5 rounded-md flex flex-col items-center text-center cursor-pointer transition-all duration-200 group`}
              >
                 <div className={`text-[10px] uppercase font-bold tracking-wider mb-1 transition-colors ${activeRangeId === 'balanced' ? 'text-primary' : 'text-yellow-400 group-hover:text-primary'}`}>⚖️ Media (Balanced)</div>
                 <div className="text-[10px] text-textMuted leading-tight mb-2 pointer-events-none">Canale bilanciato per assorbire volatilità standard in più giorni.</div>
                 <div className={`text-xs font-mono px-2 py-1 rounded w-full border border-border pointer-events-none transition-colors ${activeRangeId === 'balanced' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-[#0B0B0F] text-text'}`}>
                    {chartData.insight.ranges.balanced.min} - {chartData.insight.ranges.balanced.max}
                 </div>
              </div>

              <div 
                 onClick={() => handleRangeClick('relax')}
                 className={`bg-[#1a1b23] border ${activeRangeId === 'relax' ? 'border-primary ring-1 ring-primary/50 shadow-[0_0_15px_rgba(52,211,153,0.15)] bg-primary/5' : 'border-blue-500/30 hover:border-primary/80'} p-2.5 rounded-md flex flex-col items-center text-center cursor-pointer transition-all duration-200 group`}
              >
                 <div className={`text-[10px] uppercase font-bold tracking-wider mb-1 transition-colors ${activeRangeId === 'relax' ? 'text-primary' : 'text-blue-400 group-hover:text-primary'}`}>☕ Relax Zone</div>
                 <div className="text-[10px] text-textMuted leading-tight mb-2 pointer-events-none">Banda larga per LP passivi. APR contenuto ma gestione zero-stress.</div>
                 <div className={`text-xs font-mono px-2 py-1 rounded w-full border border-border pointer-events-none transition-colors ${activeRangeId === 'relax' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-[#0B0B0F] text-text'}`}>
                    {chartData.insight.ranges.relax.min} - {chartData.insight.ranges.relax.max}
                 </div>
              </div>
           </div>
        </div>
      )}
      
      {/* V3 Institutional Tools (TABS) */}
      {!loading && !error && pool && (
         <div className="mt-8">
            <div className="flex items-center gap-2 border-b border-border mb-4 px-2">
               <button
                  onClick={() => setActiveFeatureTab('simulator')}
                  className={`pb-2.5 px-3 flex items-center gap-1.5 text-sm font-semibold border-b-2 transition-colors ${activeFeatureTab === 'simulator' ? 'border-primary text-primary' : 'border-transparent text-textMuted hover:text-white'}`}
               >
                  <Activity className="w-4 h-4" /> DIL & APR Simulator
               </button>
               <button
                  onClick={() => setActiveFeatureTab('whale')}
                  className={`pb-2.5 px-3 flex items-center gap-1.5 text-sm font-semibold border-b-2 transition-colors ${activeFeatureTab === 'whale' ? 'border-purple-400 text-purple-400' : 'border-transparent text-textMuted hover:text-white'}`}
               >
                  <Binary className="w-4 h-4" /> Whale Tracker
               </button>
            </div>

            <div className={activeFeatureTab === 'simulator' ? 'block' : 'hidden'}>
               <LpSimulator 
                  pool={pool} 
                  activeRange={
                     activeRangeId === 'degen' ? { min: pool.price * 0.95, max: pool.price * 1.05 } :
                     activeRangeId === 'balanced' ? { min: pool.price * 0.85, max: pool.price * 1.15 } :
                     activeRangeId === 'relax' ? { min: pool.price * 0.70, max: pool.price * 1.30 } : null
                  } 
               />
            </div>

            <div className={activeFeatureTab === 'whale' ? 'block' : 'hidden'}>
               <WhaleScanner pool={pool} onWhaleHover={handleWhaleHover} />
            </div>
         </div>
      )}
    </div>
  );
};

export default LiquidityChart;
