"use client";
import React, { useState } from 'react';
import PoolExplorer from './PoolExplorer';
import LiquidityChart from './LiquidityChart';

export default function TurboRangeApp() {
  const [selectedPool, setSelectedPool] = useState(null);

  // Layout DGFans style with Tailwind
  return (
    <div className="flex flex-col lg:flex-row h-[90vh] bg-background w-full rounded-2xl overflow-hidden border border-border mt-8">
      {/* Sidebar Explorer */}
      <div className="w-full lg:w-1/3 xl:w-1/4 border-r border-border bg-surface">
        <PoolExplorer 
          onSelectPool={setSelectedPool} 
          selectedPoolId={selectedPool?.id} 
        />
      </div>
      
      {/* Main Chart Area */}
      <div className="w-full lg:w-2/3 xl:w-3/4 bg-[#05060f]">
        {selectedPool ? (
          <LiquidityChart pool={selectedPool} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-textMuted p-8">
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
  );
}
