"use client";
import React, { useState } from 'react';
import PoolExplorer from './PoolExplorer';
import LiquidityChart from './LiquidityChart';

export default function TurboRangeApp() {
  const [selectedPool, setSelectedPool] = useState(null);
  const [mobileShowChart, setMobileShowChart] = useState(false);

  const handleSelectPool = (pool) => {
    setSelectedPool(pool);
    setMobileShowChart(true); // Su mobile, mostra il chart quando si seleziona una pool
  };

  return (
    <div className="w-full">
      {/* Desktop: side-by-side layout */}
      <div className="hidden lg:flex flex-row w-full rounded-2xl border border-border overflow-hidden bg-background" style={{ minHeight: '600px' }}>
        {/* Sidebar Explorer - fixed height, scrolls internally */}
        <div className="w-1/3 xl:w-1/4 border-r border-border bg-surface" style={{ maxHeight: '85vh' }}>
          <PoolExplorer 
            onSelectPool={handleSelectPool} 
            selectedPoolId={selectedPool?.id} 
          />
        </div>
        
        {/* Main Content - scrolls freely */}
        <div className="w-2/3 xl:w-3/4 bg-[#05060f] overflow-y-auto" style={{ maxHeight: '85vh' }}>
          {selectedPool ? (
            <LiquidityChart pool={selectedPool} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-textMuted p-8 min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mb-4">
                <span className="text-2xl text-primary">⚡</span>
              </div>
              <h2 className="text-xl font-bold text-text mb-2 tracking-tight">Turbo Range Analysis</h2>
              <p className="text-center text-sm max-w-sm">
                Seleziona una pool dalla barra laterale per avviare la scansione radar della liquidità e simulare l'Hyper-Yield.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: stacked layout with view toggle */}
      <div className="lg:hidden flex flex-col w-full rounded-2xl border border-border overflow-hidden bg-background">
        {/* Mobile navigation toggle */}
        {selectedPool && (
          <div className="flex border-b border-border bg-[#0B0B0F]">
            <button
              onClick={() => setMobileShowChart(false)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${!mobileShowChart ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-textMuted'}`}
            >
              📋 Pool List
            </button>
            <button
              onClick={() => setMobileShowChart(true)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${mobileShowChart ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-textMuted'}`}
            >
              📊 Analysis
            </button>
          </div>
        )}

        {/* Pool list (shown by default on mobile, or when toggled) */}
        <div className={selectedPool && mobileShowChart ? 'hidden' : 'block'}>
          <div className="bg-surface" style={{ maxHeight: '70vh', overflow: 'hidden' }}>
            <PoolExplorer 
              onSelectPool={handleSelectPool} 
              selectedPoolId={selectedPool?.id} 
            />
          </div>
        </div>

        {/* Chart & analysis (shown when a pool is selected and toggled) */}
        <div className={!selectedPool || !mobileShowChart ? 'hidden' : 'block'}>
          <div className="bg-[#05060f]">
            {selectedPool && <LiquidityChart pool={selectedPool} />}
          </div>
        </div>
      </div>
    </div>
  );
}
