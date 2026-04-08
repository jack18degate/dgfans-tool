"use client";
import React, { useState } from 'react';
import PoolExplorer from './PoolExplorer';
import LiquidityChart from './LiquidityChart';

export default function TurboRangeApp() {
  const [selectedPool, setSelectedPool] = useState(null);
  const [mobileShowChart, setMobileShowChart] = useState(false);

  const handleSelectPool = (pool) => {
    setSelectedPool(pool);
    setMobileShowChart(true);
  };

  return (
    <>
      {/* Desktop: side-by-side, flush with the page */}
      <div className="hidden lg:grid gap-6 w-full" style={{ gridTemplateColumns: '320px 1fr' }}>
        {/* Sidebar Explorer — glassmorphic card */}
        <div style={{
          background: 'rgba(12, 14, 26, 0.72)',
          backdropFilter: 'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          maxHeight: '82vh',
          position: 'sticky',
          top: '1.5rem',
          alignSelf: 'start',
        }}>
          <PoolExplorer 
            onSelectPool={handleSelectPool} 
            selectedPoolId={selectedPool?.id} 
          />
        </div>
        
        {/* Main Content — flows naturally */}
        <div style={{ minWidth: 0 }}>
          {selectedPool ? (
            <LiquidityChart pool={selectedPool} />
          ) : (
            <div style={{
              background: 'rgba(12, 14, 26, 0.72)',
              backdropFilter: 'blur(24px) saturate(160%)',
              WebkitBackdropFilter: 'blur(24px) saturate(160%)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-lg)',
              padding: '4rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              textAlign: 'center',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(6,214,160,0.1), rgba(59,130,246,0.08))',
                border: '1px solid rgba(6,214,160,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <span style={{ fontSize: '1.5rem' }}>⚡</span>
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Turbo Range Analysis
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: 400, lineHeight: 1.5 }}>
                Seleziona una pool dalla barra laterale per avviare la scansione radar della liquidità e simulare l'Hyper-Yield.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: stacked with toggle */}
      <div className="lg:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Mobile navigation toggle */}
        {selectedPool && (
          <div style={{
            display: 'flex',
            background: 'rgba(12, 14, 26, 0.72)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
          }}>
            <button
              onClick={() => setMobileShowChart(false)}
              style={{
                flex: 1, padding: '0.75rem', fontSize: '0.85rem', fontWeight: 700,
                background: !mobileShowChart ? 'rgba(6,214,160,0.08)' : 'transparent',
                color: !mobileShowChart ? '#06d6a0' : 'var(--text-secondary)',
                border: 'none', borderBottom: !mobileShowChart ? '2px solid #06d6a0' : '2px solid transparent',
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}
            >
              📋 Pool List
            </button>
            <button
              onClick={() => setMobileShowChart(true)}
              style={{
                flex: 1, padding: '0.75rem', fontSize: '0.85rem', fontWeight: 700,
                background: mobileShowChart ? 'rgba(6,214,160,0.08)' : 'transparent',
                color: mobileShowChart ? '#06d6a0' : 'var(--text-secondary)',
                border: 'none', borderBottom: mobileShowChart ? '2px solid #06d6a0' : '2px solid transparent',
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}
            >
              📊 Analysis
            </button>
          </div>
        )}

        {/* Pool list */}
        <div style={{ display: selectedPool && mobileShowChart ? 'none' : 'block' }}>
          <div style={{
            background: 'rgba(12, 14, 26, 0.72)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            maxHeight: '70vh',
          }}>
            <PoolExplorer 
              onSelectPool={handleSelectPool} 
              selectedPoolId={selectedPool?.id} 
            />
          </div>
        </div>

        {/* Chart & analysis */}
        <div style={{ display: !selectedPool || !mobileShowChart ? 'none' : 'block' }}>
          {selectedPool && <LiquidityChart pool={selectedPool} />}
        </div>
      </div>
    </>
  );
}
