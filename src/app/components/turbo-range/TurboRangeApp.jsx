"use client";
import React, { useState } from 'react';
import PoolExplorer from './PoolExplorer';
import LiquidityChart from './LiquidityChart';
import { useI18n } from '../../i18n';

export default function TurboRangeApp() {
  const [selectedPool, setSelectedPool] = useState(null);
  const [mobileShowChart, setMobileShowChart] = useState(false);
  const { t } = useI18n();

  const handleSelectPool = (pool) => {
    setSelectedPool(pool);
    setMobileShowChart(true);
  };

  const glassCard = {
    background: 'rgba(12, 14, 26, 0.72)',
    backdropFilter: 'blur(24px) saturate(160%)',
    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderTop: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: 'var(--radius-lg)',
  };

  return (
    <>
      <style>{`
        .turbo-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 1.5rem;
          width: 100%;
        }
        .turbo-sidebar {
          max-height: 82vh;
          position: sticky;
          top: 1.5rem;
          align-self: start;
          overflow: hidden;
        }
        .turbo-main { min-width: 0; }
        .turbo-mobile-toggle { display: none; }
        .turbo-mobile-pools { display: none; }
        .turbo-mobile-chart { display: none; }

        @media (max-width: 1023px) {
          .turbo-layout { display: none !important; }
          .turbo-mobile-toggle { display: flex; }
          .turbo-mobile-pools { display: block; }
          .turbo-mobile-chart { display: block; }
        }
      `}</style>

      {/* ═══ Desktop Layout ═══ */}
      <div className="turbo-layout">
        <div className="turbo-sidebar" style={{ ...glassCard, overflow: 'hidden' }}>
          <PoolExplorer 
            onSelectPool={handleSelectPool} 
            selectedPoolId={selectedPool?.id} 
          />
        </div>
        
        <div className="turbo-main">
          {selectedPool ? (
            <LiquidityChart pool={selectedPool} />
          ) : (
            <div style={{ ...glassCard, padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(6,214,160,0.1), rgba(59,130,246,0.08))', border: '1px solid rgba(6,214,160,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>⚡</span>
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Turbo Range Analysis</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: 400, lineHeight: 1.5 }}>
                Seleziona una pool dalla barra laterale per avviare la scansione radar della liquidità e simulare l'Hyper-Yield.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Mobile Layout ═══ */}
      {selectedPool && (
        <div className="turbo-mobile-toggle" style={{
          background: 'rgba(12, 14, 26, 0.72)', backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 'var(--radius-md)',
          overflow: 'hidden', marginBottom: '1rem',
        }}>
          <button onClick={() => setMobileShowChart(false)} style={{
            flex: 1, padding: '0.75rem', fontSize: '0.85rem', fontWeight: 700,
            background: !mobileShowChart ? 'rgba(6,214,160,0.08)' : 'transparent',
            color: !mobileShowChart ? '#06d6a0' : 'var(--text-secondary)',
            border: 'none', borderBottom: !mobileShowChart ? '2px solid #06d6a0' : '2px solid transparent',
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>📋 Pool List</button>
          <button onClick={() => setMobileShowChart(true)} style={{
            flex: 1, padding: '0.75rem', fontSize: '0.85rem', fontWeight: 700,
            background: mobileShowChart ? 'rgba(6,214,160,0.08)' : 'transparent',
            color: mobileShowChart ? '#06d6a0' : 'var(--text-secondary)',
            border: 'none', borderBottom: mobileShowChart ? '2px solid #06d6a0' : '2px solid transparent',
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>📊 Analysis</button>
        </div>
      )}

      <div className="turbo-mobile-pools" style={{ display: (selectedPool && mobileShowChart) ? 'none' : undefined }}>
        <div style={{ ...glassCard, overflow: 'hidden', maxHeight: '70vh' }}>
          <PoolExplorer 
            onSelectPool={handleSelectPool} 
            selectedPoolId={selectedPool?.id} 
          />
        </div>
      </div>

      <div className="turbo-mobile-chart" style={{ display: (!selectedPool || !mobileShowChart) ? 'none' : undefined }}>
        {selectedPool && <LiquidityChart pool={selectedPool} />}
      </div>
    </>
  );
}
