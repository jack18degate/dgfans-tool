'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { TrendingUp, DollarSign, Percent, RefreshCw, Calculator, Info, ChevronDown, Rocket, ExternalLink, Zap, X, Minus, Plus } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { useI18n } from '../i18n';
import styles from './page.module.css';

type Frequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

const FREQ_META: { value: Frequency; emoji: string; periods: number }[] = [
  { value: 'daily',     emoji: '📅', periods: 365 },
  { value: 'weekly',    emoji: '📆', periods: 52 },
  { value: 'monthly',   emoji: '🗓️', periods: 12 },
  { value: 'quarterly', emoji: '📊', periods: 4 },
  { value: 'yearly',    emoji: '🔄', periods: 1 },
];

interface YearData {
  year: number;
  balance: number;
  interest: number;
  fees: number;
  netGain: number;
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

function formatNumber(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CompoundInterestPage() {
  const { t } = useI18n();
  const [capital, setCapital] = useState(1000);
  const [capitalDisplay, setCapitalDisplay] = useState('1000');
  const [annualRate, setAnnualRate] = useState(10);
  const [annualRateDisplay, setAnnualRateDisplay] = useState('10');
  const [frequency, setFrequency] = useState<Frequency>('monthly');

  const [years, setYears] = useState(5);
  const [showFreqDropdown, setShowFreqDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Pool selector state ──
  interface PoolData {
    symbol: string; name: string; emoji: string; poolId: string;
    pair: string; tvl: number; feeRate: number; defaultRange: number;
    chain: string;
    apr: { day: number; week: number; month: number };
    volume: { day: number; week: number; month: number };
    currentPrice: string; poolAddress: string;
    logoA: string; logoB: string;
    change24h: string;
  }
  const [pools, setPools] = useState<PoolData[]>([]);
  const [poolsLoading, setPoolsLoading] = useState(true);
  const [poolsError, setPoolsError] = useState(false);
  const [selectedPool, setSelectedPool] = useState<PoolData | null>(null);
  const [priceRange, setPriceRange] = useState<5 | 10 | 20>(10);
  const [aprTimeframe, setAprTimeframe] = useState<'day' | 'week' | 'month'>('week');

  const getScaledApr = useCallback((pool: PoolData, range: number, timeframe: 'day' | 'week' | 'month' = aprTimeframe) => {
    const baseApr = pool.apr[timeframe];
    const defaultRange = pool.defaultRange || 0.1;
    const rangeDecimal = range / 100;
    const scale = defaultRange / rangeDecimal;
    return baseApr * scale;
  }, [aprTimeframe]);

  // Fetch pools on mount — with 15min client-side cache
  useEffect(() => {
    const CACHE_KEY = 'degate_pool_data';
    const CACHE_TTL = 15 * 60 * 1000;

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { pools: cachedPools, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL && cachedPools?.length > 0) {
          setPools(cachedPools);
          setPoolsLoading(false);
          return;
        }
      }
    } catch { /* ignore parse errors */ }

    fetch('/api/raydium-pools')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.pools) {
          setPools(data.pools);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
              pools: data.pools,
              timestamp: Date.now(),
            }));
          } catch { /* ignore quota errors */ }
        } else {
          setPoolsError(true);
        }
      })
      .catch(() => setPoolsError(true))
      .finally(() => setPoolsLoading(false));
  }, []);

  const applyPoolApr = useCallback((pool: PoolData) => {
    setSelectedPool(pool);
    const scaledApr = getScaledApr(pool, priceRange, aprTimeframe);
    const newRate = Math.round(scaledApr * 100) / 100;
    setAnnualRate(newRate);
    setAnnualRateDisplay(String(newRate));
    setFrequency('daily');
  }, [priceRange, aprTimeframe, getScaledApr]);

  useEffect(() => {
    if (selectedPool) {
      const scaledApr = getScaledApr(selectedPool, priceRange, aprTimeframe);
      const newRate = Math.round(scaledApr * 100) / 100;
      setAnnualRate(newRate);
      setAnnualRateDisplay(String(newRate));
    }
  }, [priceRange, aprTimeframe, selectedPool, getScaledApr]);

  const clearPool = useCallback(() => {
    setSelectedPool(null);
  }, []);

  const frequencies = useMemo(() => FREQ_META.map(f => ({
    ...f,
    label: t.compound[f.value],
  })), [t]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowFreqDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedFreq = frequencies.find(f => f.value === frequency)!;

  const { yearlyData, finalBalance, totalInterest, netProfit, simpleBalance } = useMemo(() => {
    const periodsPerYear = selectedFreq.periods;
    const ratePerPeriod = annualRate / 100 / periodsPerYear;
    const yearly: YearData[] = [];
    let balance = capital;
    let cumulativeInterest = 0;
    let simpleBalanceCalc = capital;

    for (let y = 1; y <= years; y++) {
      let yearInterest = 0;

      for (let p = 0; p < periodsPerYear; p++) {
        const interest = balance * ratePerPeriod;
        balance += interest;
        yearInterest += interest;
      }

      cumulativeInterest += yearInterest;
      simpleBalanceCalc = capital * (1 + (annualRate / 100) * y);

      yearly.push({
        year: y,
        balance,
        interest: cumulativeInterest,
        fees: 0,
        netGain: balance - capital,
      });
    }

    return {
      yearlyData: yearly,
      finalBalance: balance,
      totalInterest: cumulativeInterest,
      netProfit: balance - capital,
      simpleBalance: simpleBalanceCalc,
    };
  }, [capital, annualRate, frequency, years, selectedFreq.periods]);

  const chartOption = useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(12, 14, 26, 0.9)',
      borderColor: 'rgba(255,255,255,0.1)',
      textStyle: { color: '#edf0f7', fontFamily: 'Outfit', fontSize: 13 },
      formatter: (params: any) => {
        const year = params[0].name;
        let html = `<div style="font-weight:700;margin-bottom:6px">${t.compound.yearLabel} ${year}</div>`;
        params.forEach((p: any) => {
          html += `<div style="display:flex;align-items:center;gap:6px;margin:3px 0">
            <span style="width:8px;height:8px;border-radius:50%;background:${p.color};display:inline-block"></span>
            <span>${p.seriesName}: <strong>$${formatNumber(p.value)}</strong></span>
          </div>`;
        });
        return html;
      }
    },
    legend: {
      data: [t.compound.compoundInterestLabel, t.compound.simpleInterestLabel, t.compound.initialCapitalLabel],
      bottom: 0,
      textStyle: { color: '#6b7a99', fontFamily: 'Outfit', fontSize: 12 },
      icon: 'roundRect',
      itemWidth: 14,
      itemHeight: 8,
      itemGap: 20,
    },
    grid: { top: 20, right: 20, bottom: 50, left: 20, containLabel: true },
    xAxis: {
      type: 'category',
      data: yearlyData.map(d => d.year.toString()),
      axisLabel: { color: '#6b7a99', fontFamily: 'Outfit', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#6b7a99',
        fontFamily: 'Outfit',
        fontSize: 11,
        formatter: (v: number) => formatCurrency(v),
      },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        name: t.compound.compoundInterestLabel,
        type: 'line',
        data: yearlyData.map(d => parseFloat(d.balance.toFixed(2))),
        smooth: true,
        lineStyle: { width: 3, color: '#22C55E' },
        itemStyle: { color: '#22C55E' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(20, 241, 149, 0.2)' },
              { offset: 1, color: 'rgba(20, 241, 149, 0)' },
            ],
          },
        },
        symbol: 'circle',
        symbolSize: 6,
      },
      {
        name: t.compound.simpleInterestLabel,
        type: 'line',
        data: yearlyData.map((_, i) => parseFloat((capital * (1 + (annualRate / 100) * (i + 1))).toFixed(2))),
        smooth: true,
        lineStyle: { width: 2, color: '#6366f1', type: 'dashed' },
        itemStyle: { color: '#6366f1' },
        symbol: 'none',
      },
      {
        name: t.compound.initialCapitalLabel,
        type: 'line',
        data: yearlyData.map(() => capital),
        lineStyle: { width: 1, color: 'rgba(255,255,255,0.15)', type: 'dotted' },
        itemStyle: { color: 'rgba(255,255,255,0.15)' },
        symbol: 'none',
      },
    ],
  }), [yearlyData, capital, annualRate, t]);

  return (
    <main className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <img src="/degate-logo.png" alt="DeGate" className={styles.headerLogo} />
        <h1 className={styles.title}>
          <span className={styles.titleGradient}>{t.compound.title}</span>
        </h1>
        <p className={styles.subtitle}>
          {t.compound.subtitle}
        </p>
      </div>

      <div className={styles.layout}>
        {/* ── Pool Suggestions ── */}
        <div className={styles.poolSection} style={{ gridColumn: '1 / -1' }}>
          <div className={styles.poolSectionHeader}>
            <Zap size={16} />
            <span>{t.compound.livePools}</span>
          </div>

          <div className={styles.poolContent}>
            <div className={styles.chooseAssetHero}>
              <p className={styles.chooseAssetLabel}>
                {t.compound.chooseAsset}
              </p>
              <p className={styles.chooseAssetSubtitle}>
                {t.compound.chooseAssetSubtitle}
              </p>
            </div>
            <p className={styles.poolDesc}>{t.compound.poolsDesc}</p>

            {/* Price Range Tabs */}
            <div className={styles.poolControls}>
              <div className={styles.poolTabs}>
                <span className={styles.poolTabLabel}>{t.compound.priceRange}:</span>
                {([5, 10, 20] as const).map(r => (
                  <button
                    key={r}
                    className={`${styles.poolTab} ${priceRange === r ? styles.poolTabActive : ''}`}
                    onClick={() => setPriceRange(r)}
                  >
                    ±{r}%
                  </button>
                ))}
              </div>
              <div className={styles.poolTabs}>
                <span className={styles.poolTabLabel}>APR:</span>
                {(['day', 'week', 'month'] as const).map(tf => (
                  <button
                    key={tf}
                    className={`${styles.poolTab} ${aprTimeframe === tf ? styles.poolTabActive : ''}`}
                    onClick={() => setAprTimeframe(tf)}
                  >
                    {t.compound[tf === 'day' ? 'apr24h' : tf === 'week' ? 'apr7d' : 'apr30d']}
                  </button>
                ))}
              </div>
            </div>

            {/* Pool Cards */}
            {poolsLoading ? (
              <div className={styles.poolGrid}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={styles.poolSkeleton}>
                    <div className={styles.skeletonLine} style={{ width: '60%' }} />
                    <div className={styles.skeletonLine} style={{ width: '40%' }} />
                    <div className={styles.skeletonLine} style={{ width: '80%' }} />
                  </div>
                ))}
              </div>
            ) : poolsError ? (
              <div className={styles.poolError}>
                <Info size={16} />
                {t.compound.poolsError}
              </div>
            ) : (
              <div className={styles.poolScrollWrapper}>
                <div className={styles.poolScrollTrack}>
                  {pools.map(pool => {
                    const poolApr = getScaledApr(pool, priceRange);
                    const isActive = selectedPool?.poolId === pool.poolId;
                    const changeNum = parseFloat(pool.change24h || '0');
                    const isPositive = changeNum >= 0;
                    return (
                      <button
                        key={pool.poolId}
                        className={`${styles.poolCard} ${isActive ? styles.poolCardActive : ''}`}
                        onClick={() => applyPoolApr(pool)}
                      >
                        <div className={styles.poolCardHeader}>
                          {pool.logoA ? (
                            <img src={pool.logoA} alt={pool.name} className={styles.poolIcon} />
                          ) : (
                            <span className={styles.poolEmoji}>{pool.emoji}</span>
                          )}
                          <span className={styles.poolName}>{pool.name}</span>
                          {isActive && <span className={styles.poolActiveDot} />}
                        </div>
                        <div className={styles.poolApr}>
                          {poolApr.toFixed(1)}%
                        </div>
                        <div className={styles.poolPriceRow}>
                          <span className={styles.poolPrice}>${pool.currentPrice}</span>
                          <span className={`${styles.poolChange} ${isPositive ? styles.poolChangeUp : styles.poolChangeDown}`}>
                            {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}{changeNum.toFixed(2)}%
                          </span>
                        </div>
                        <div className={styles.poolMeta}>
                          <span>{pool.pair}</span>
                          <span className={styles.poolChain}>
                            {pool.chain === 'solana' ? '◎' : pool.chain === 'base' ? '🔵' : '⟠'}
                            {pool.chain === 'solana' ? 'SOL' : pool.chain === 'base' ? 'BASE' : 'ETH'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <p className={styles.poolDisclaimer}>
              <Info size={12} />
              {t.compound.disclaimer}
            </p>
          </div>
        </div>

        {/* ── Calculator (always visible) ── */}
        <div className={styles.calculatorWrapper} style={{ gridColumn: '1 / -1', display: 'contents' }}>

        {/* ── Left: Inputs ── */}
        <div className={styles.inputPanel}>
          {/* Pool Badge */}
          {selectedPool && (
            <div className={styles.poolBadge}>
              <Zap size={12} />
              <span>{t.compound.poolSelected} <strong>{selectedPool.name}</strong> — ±{priceRange}%</span>
              <button className={styles.poolBadgeClear} onClick={clearPool}>
                <X size={12} />
              </button>
            </div>
          )}
          <h2 className={styles.panelTitle}>
            <Calculator size={18} />
            {t.compound.parameters}
          </h2>

          {/* Capital */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <DollarSign size={14} />
              {t.compound.investedCapital}
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputPrefix}>$</span>
              <input
                type="number"
                className={styles.input}
                value={capitalDisplay}
                onChange={(e) => {
                  setCapitalDisplay(e.target.value);
                  const num = Number(e.target.value);
                  if (!isNaN(num) && e.target.value !== '') setCapital(num);
                }}
                onBlur={() => {
                  const clamped = Math.max(100, Math.min(50000, capital));
                  setCapital(clamped);
                  setCapitalDisplay(String(clamped));
                }}
                min={100}
                max={50000}
                step={100}
              />
            </div>
            <div className={styles.sliderRow}>
              <button className={styles.sliderArrow} onClick={() => { setCapital(c => { const v = Math.max(100, c - 100); setCapitalDisplay(String(v)); return v; }); }}><Minus size={14} /></button>
              <input
                type="range"
                className={styles.slider}
                min={100}
                max={50000}
                step={100}
                value={capital}
                onChange={(e) => { const v = Number(e.target.value); setCapital(v); setCapitalDisplay(String(v)); }}
              />
              <button className={styles.sliderArrow} onClick={() => { setCapital(c => { const v = Math.min(50000, c + 100); setCapitalDisplay(String(v)); return v; }); }}><Plus size={14} /></button>
            </div>
            <div className={styles.sliderLabels}>
              <span>$100</span>
              <span>$50K</span>
            </div>
          </div>

          {/* Annual Rate */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <Percent size={14} />
              {t.compound.expectedAnnualRate}
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="number"
                className={styles.input}
                value={annualRateDisplay}
                onChange={(e) => {
                  setAnnualRateDisplay(e.target.value);
                  const num = Number(e.target.value);
                  if (!isNaN(num) && e.target.value !== '') setAnnualRate(num);
                }}
                onBlur={() => {
                  const clamped = Math.max(5, Math.min(300, annualRate));
                  setAnnualRate(clamped);
                  setAnnualRateDisplay(String(clamped));
                }}
                min={5}
                max={300}
                step={0.1}
              />
              <span className={styles.inputSuffix}>%</span>
            </div>
            <div className={styles.sliderRow}>
              <button className={styles.sliderArrow} onClick={() => { setAnnualRate(r => { const v = Math.max(5, +(r - 0.5).toFixed(1)); setAnnualRateDisplay(String(v)); return v; }); }}><Minus size={14} /></button>
              <input
                type="range"
                className={styles.slider}
                min={5}
                max={300}
                step={0.5}
                value={annualRate}
                onChange={(e) => { const v = Number(e.target.value); setAnnualRate(v); setAnnualRateDisplay(String(v)); }}
              />
              <button className={styles.sliderArrow} onClick={() => { setAnnualRate(r => { const v = Math.min(300, +(r + 0.5).toFixed(1)); setAnnualRateDisplay(String(v)); return v; }); }}><Plus size={14} /></button>
            </div>
            <div className={styles.sliderLabels}>
              <span>5%</span>
              <span>300%</span>
            </div>
          </div>

          {/* Frequency Dropdown */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <RefreshCw size={14} />
              {t.compound.reinvestFrequency}
            </label>
            <div className={styles.dropdownWrapper} ref={dropdownRef}>
              <button
                className={styles.dropdownBtn}
                onClick={() => setShowFreqDropdown(prev => !prev)}
              >
                <span className={styles.dropdownEmoji}>{selectedFreq.emoji}</span>
                <span>{selectedFreq.label}</span>
                <span className={styles.dropdownPeriods}>{selectedFreq.periods}x{t.compound.perYear}</span>
                <ChevronDown
                  size={16}
                  className={styles.dropdownChevron}
                  style={{ transform: showFreqDropdown ? 'rotate(180deg)' : 'rotate(0)' }}
                />
              </button>
              {showFreqDropdown && (
                <div className={styles.dropdownMenu}>
                  {frequencies.map(f => (
                    <button
                      key={f.value}
                      className={`${styles.dropdownItem} ${f.value === frequency ? styles.dropdownItemActive : ''}`}
                      onClick={() => { setFrequency(f.value); setShowFreqDropdown(false); }}
                    >
                      <span>{f.emoji}</span>
                      <span className={styles.dropdownItemLabel}>{f.label}</span>
                      <span className={styles.dropdownItemPeriods}>{f.periods}x{t.compound.perYear}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Years */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <TrendingUp size={14} />
              {t.compound.timeHorizon}
            </label>
            <div className={styles.yearsSelector}>
              <span className={styles.yearsBig}>{years}</span>
              <span className={styles.yearsLabel}>{years === 1 ? t.compound.year : t.compound.years}</span>
            </div>
            <div className={styles.sliderRow}>
              <button className={styles.sliderArrow} onClick={() => setYears(y => Math.max(1, y - 1))}><Minus size={14} /></button>
              <input
                type="range"
                className={styles.slider}
                min={1}
                max={20}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
              <button className={styles.sliderArrow} onClick={() => setYears(y => Math.min(20, y + 1))}><Plus size={14} /></button>
            </div>
            <div className={styles.sliderLabels}>
              <span>1 {t.compound.year}</span>
              <span>20 {t.compound.years}</span>
            </div>
          </div>

          {/* Turbo Range Tip */}
          <a
            href="https://app.degate.com/?utm_source=calculator?s=jack18"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.turboTip}
          >
            <div className={styles.turboTipIcon}>
              <Rocket size={16} />
            </div>
            <div className={styles.turboTipText}>
              <span className={styles.turboTipTitle}>{t.compound.turboTipTitle}</span>
              <span className={styles.turboTipDesc}>{t.compound.turboTipDesc}</span>
            </div>
            <ExternalLink size={14} className={styles.turboTipArrow} />
          </a>
        </div>

        {/* ── Right: Results ── */}
        <div className={styles.resultsPanel}>
          <div className={styles.resultsGrid}>
            <div className={`${styles.resultCard} ${styles.resultCardPrimary}`}>
              <span className={styles.resultLabel}>{t.compound.finalBalance}</span>
              <span className={styles.resultValue} style={{ color: '#22C55E' }}>
                ${formatNumber(finalBalance)}
              </span>
              <span className={styles.resultSub}>{t.compound.afterYears} {years} {years === 1 ? t.compound.year : t.compound.years}</span>
            </div>
            <div className={styles.resultCard}>
              <span className={styles.resultLabel}>{t.compound.netProfit}</span>
              <span className={styles.resultValue} style={{ color: '#34d399' }}>
                +${formatNumber(netProfit)}
              </span>
              <span className={styles.resultSub}>
                {capital > 0 ? `+${((netProfit / capital) * 100).toFixed(1)}%` : '0%'} {t.compound.totalROI}
              </span>
            </div>
            <div className={styles.resultCard}>
              <span className={styles.resultLabel}>{t.compound.totalInterest}</span>
              <span className={styles.resultValue} style={{ color: '#60a5fa' }}>
                ${formatNumber(totalInterest)}
              </span>
              <span className={styles.resultSub}>{t.compound.interestGenerated}</span>
            </div>

          </div>

          {/* Comparison */}
          <div className={styles.comparisonBar}>
            <div className={styles.comparisonItem}>
              <span className={styles.comparisonDot} style={{ background: '#22C55E' }} />
              <span>{t.compound.compound} <strong>${formatNumber(finalBalance)}</strong></span>
            </div>
            <div className={styles.comparisonItem}>
              <span className={styles.comparisonDot} style={{ background: '#6366f1' }} />
              <span>{t.compound.simple} <strong>${formatNumber(simpleBalance)}</strong></span>
            </div>
            <div className={styles.comparisonItem}>
              <span className={styles.comparisonDot} style={{ background: '#fbbf24' }} />
              <span>{t.compound.advantage} <strong style={{ color: '#22C55E' }}>+${formatNumber(finalBalance - simpleBalance)}</strong></span>
            </div>
          </div>

          {/* Chart */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              <TrendingUp size={16} />
              {t.compound.capitalGrowth}
            </h3>
            <div className={styles.chartContainer}>
              <ReactECharts
                option={chartOption}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'svg' }}
              />
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableCard}>
            <h3 className={styles.chartTitle}>
              <Calculator size={16} />
              {t.compound.yearByYear}
            </h3>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t.compound.yearLabel}</th>
                    <th>{t.compound.balance}</th>
                    <th>{t.compound.cumulativeInterest}</th>
                    <th>{t.compound.netGain}</th>
                  </tr>
                </thead>
                <tbody>
                  {yearlyData.map(row => (
                    <tr key={row.year}>
                      <td className={styles.tableYear}>{row.year}</td>
                      <td className={styles.tableBalance}>${formatNumber(row.balance)}</td>
                      <td style={{ color: '#60a5fa' }}>${formatNumber(row.interest)}</td>
                      <td style={{ color: '#34d399' }}>+${formatNumber(row.netGain)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Degate CTA */}
          <div className={styles.degateBanner}>
            <div className={styles.degateGlow} />
            <div className={styles.degateContent}>
              <div className={styles.degateIconBox}>
                <Rocket size={28} />
              </div>
              <div className={styles.degateText}>
                <h3 className={styles.degateTitle}>
                  {t.compound.degateCta.split('Turbo Range')[0]}
                  <span className={styles.degateHighlight}>Turbo Range</span>
                  {t.compound.degateCta.split('Turbo Range').slice(1).join('Turbo Range')}
                </h3>
                <p className={styles.degateDesc}>
                  {t.compound.degateDesc}
                </p>
              </div>
              <a
                href="https://app.degate.com/?utm_source=calculator?s=jack18"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.degateBtn}
              >
                <Rocket size={16} />
                {t.compound.tryTurboRange}
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </main>
  );
}
