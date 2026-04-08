export type Locale = 'en' | 'it' | 'es' | 'zh';

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export interface Translations {
  nav: {
    tools: string;
    compoundInterest: string;
    turboRange: string;
    copyright: string;
  };
  compound: {
    title: string;
    subtitle: string;
    parameters: string;
    investedCapital: string;
    expectedAnnualRate: string;
    reinvestFrequency: string;
    feePerReinvest: string;
    totalAnnualCost: string;
    timeHorizon: string;
    years: string;
    year: string;
    perYear: string;
    finalBalance: string;
    afterYears: string;
    netProfit: string;
    totalROI: string;
    totalInterest: string;
    interestGenerated: string;
    totalFees: string;
    reinvestments: string;
    compound: string;
    simple: string;
    advantage: string;
    capitalGrowth: string;
    yearByYear: string;
    balance: string;
    cumulativeInterest: string;
    cumulativeFees: string;
    netGain: string;
    turboTipTitle: string;
    turboTipDesc: string;
    degateCta: string;
    degateDesc: string;
    tryTurboRange: string;
    daily: string;
    weekly: string;
    monthly: string;
    quarterly: string;
    yearly: string;
    compoundInterestLabel: string;
    simpleInterestLabel: string;
    initialCapitalLabel: string;
    yearLabel: string;
    livePools: string;
    poolsDesc: string;
    useThisApr: string;
    poolSelected: string;
    clearPool: string;
    apr24h: string;
    apr7d: string;
    apr30d: string;
    tvlLabel: string;
    loadingPools: string;
    poolsError: string;
    disclaimer: string;
    priceRange: string;
    gasFeeDisclaimer: string;
    chooseAsset: string;
    chooseAssetSubtitle: string;
    chooseAssetDesc: string;
    selectAssetOverlay: string;
  };
  turbo: {
    degatePools: string;
    refresh: string;
    updating: string;
    noPoolFound: string;
    selectPoolPrompt: string;
    selectPoolDesc: string;
    liquidityMap: string;
    currentPrice: string;
    zoom: string;
    loadingLiquidity: string;
    analysisTitle: string;
    analysisDesc: string;
    resistanceDown: string;
    resistanceUp: string;
    highSaturation: string;
    optimalDecompression: string;
    balancedRange: string;
    volumeCoeff: string;
    suggestedStrategy: string;
    biasDown: string;
    biasUp: string;
    biasNeutral: string;
    maxYield: string;
    maxYieldDesc: string;
    balanced: string;
    balancedDesc: string;
    relaxZone: string;
    relaxDesc: string;
    simulator: string;
    whaleTracker: string;
    whaleTitle: string;
    whaleScanPassive: string;
    poolList: string;
    analysis: string;
  };
}

const en: Translations = {
  nav: {
    tools: 'Tools',
    compoundInterest: 'Interest Calculator',
    turboRange: 'Turbo Range',
    copyright: '© 2026 DeGate Tools',
  },
  compound: {
    title: 'Compound Interest Calculator',
    subtitle: 'Calculate compound interest with custom reinvestment frequency and visualize your capital growth over time.',
    parameters: 'Parameters',
    investedCapital: 'Invested Capital',
    expectedAnnualRate: 'Expected Annual Rate',
    reinvestFrequency: 'Reinvestment Frequency',
    feePerReinvest: 'Fee per Reinvestment',
    totalAnnualCost: 'Total annual cost:',
    timeHorizon: 'Time Horizon',
    years: 'years',
    year: 'year',
    perYear: '/year',
    finalBalance: 'Final Balance',
    afterYears: 'after',
    netProfit: 'Net Profit',
    totalROI: 'total ROI',
    totalInterest: 'Total Interest',
    interestGenerated: 'interest generated',
    totalFees: 'Total Fees',
    reinvestments: 'reinvestments',
    compound: 'Compound:',
    simple: 'Simple:',
    advantage: 'Advantage:',
    capitalGrowth: 'Capital Growth',
    yearByYear: 'Year by Year Detail',
    balance: 'Balance',
    cumulativeInterest: 'Cumulative Interest',
    cumulativeFees: 'Cumulative Fees',
    netGain: 'Net Gain',
    turboTipTitle: '💡 Degate Turbo Range',
    turboTipDesc: 'Earn high APYs with a super simple interface, directly from your Web3 wallet!',
    degateCta: 'Earn with Turbo Range',
    degateDesc: 'Degate Turbo Range lets you earn incredible APYs with a super simple interface, directly from your non-custodial Web3 wallet. No complexity, just results.',
    tryTurboRange: 'Try Turbo Range',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly',
    compoundInterestLabel: 'Compound Interest',
    simpleInterestLabel: 'Simple Interest',
    initialCapitalLabel: 'Initial Capital',
    yearLabel: 'Year',
    livePools: 'Live Pool Rates',
    poolsDesc: 'Real-time APR from Raydium and Uniswap pools',
    useThisApr: 'Use this APR',
    poolSelected: 'Using APR from',
    clearPool: 'Clear',
    apr24h: '24h',
    apr7d: '7d',
    apr30d: '30d',
    tvlLabel: 'TVL',
    loadingPools: 'Loading pools...',
    poolsError: 'Unable to load pool data',
    disclaimer: 'APR based on past performance and may vary',
    priceRange: 'Price Range',
    gasFeeDisclaimer: 'Gas fees are dynamic and vary based on the asset and network congestion conditions.',
    chooseAsset: 'Choose your asset',
    chooseAssetSubtitle: 'Pick your asset and see your future growth 🚀',
    chooseAssetDesc: 'Select a pool above to start calculating compound interest.',
    selectAssetOverlay: '👆 Select an asset above to unlock the calculator',
  },
  turbo: {
    degatePools: 'Degate Pools',
    refresh: 'Refresh',
    updating: 'Updating...',
    noPoolFound: 'No pools found.',
    selectPoolPrompt: 'Turbo Range Analysis',
    selectPoolDesc: 'Select a pool from the sidebar to start scanning liquidity distribution and simulate Hyper-Yield.',
    liquidityMap: 'Liquidity Map',
    currentPrice: 'Current Price',
    zoom: 'Zoom',
    loadingLiquidity: 'Calculating liquidity distribution...',
    analysisTitle: '💡 Advanced Optimization Analysis (Hot Zone ±10%)',
    analysisDesc: 'The Analytical Module analyzes the distribution of active ticks and calculates the relative weight of concentrated liquidity. Through the identification of standard deviations and "Saturation" or "Decompression" zones, it provides quantitative metrics on where to place LP ranges to minimize systemic Impermanent Loss or over-extract higher Yield on expected directionality.',
    resistanceDown: 'Passive Resistance Downside (-10%)',
    resistanceUp: 'Passive Resistance Upside (+10%)',
    highSaturation: '🔴 High Saturation',
    optimalDecompression: '🟢 Optimal Decompression',
    balancedRange: '🟡 Balanced Range',
    volumeCoeff: 'Volume Coefficient',
    suggestedStrategy: 'Suggested Strategy (Delta Allocation):',
    biasDown: 'Excessive Lower Asymmetry. The liquid concentration near the downside is structurally saturated, reducing APYs. An asymmetric JIT supply (skewed upward) will isolate upside volume with a drastically favorable share split.',
    biasUp: 'Liquidity Wall Inversion upward. Very strong limit-seller Market Maker competition during pumps. Delta-Neutral action or discounted LP placement (biased < Current Price) is optimal: during sudden drawdowns, trading fee acquisition will operate at 100% capital efficiency across wide price deltas.',
    biasNeutral: 'Gaussian V3 Equilibrium on local pricing. No advantageous deviation detected in this asymmetric range. For superior Alpha, place Tight Symmetric Bands at restricted tolerance (very high out-of-range risk) or cross-reference high-yield isolated fee tiers.',
    maxYield: '🔥 Max Yield',
    maxYieldDesc: 'Ultra-concentrated. Very high fees, very high out-of-range risk.',
    balanced: '⚖️ Balanced',
    balancedDesc: 'Balanced channel to absorb standard volatility over multiple days.',
    relaxZone: '☕ Relax Zone',
    relaxDesc: 'Wide band for passive LPs. Lower APR but zero-stress management.',
    simulator: 'DIL & APR Simulator',
    whaleTracker: 'Whale Tracker',
    whaleTitle: '🐋 Whale Tracker',
    whaleScanPassive: 'Passive 4h scan (Public Network). Refresh disabled.',
    poolList: '📋 Pool List',
    analysis: '📊 Analysis',
  },
};

const it: Translations = {
  nav: {
    tools: 'Strumenti',
    compoundInterest: 'Calcolatore Interesse',
    turboRange: 'Turbo Range',
    copyright: '© 2026 DeGate Tools',
  },
  compound: {
    title: 'Calcolatore di Interesse Composto',
    subtitle: 'Calcola l\'interesse composto con frequenza di reinvestimento personalizzata e visualizza la crescita del tuo capitale nel tempo.',
    parameters: 'Parametri',
    investedCapital: 'Capitale Investito',
    expectedAnnualRate: 'Interesse Annuo Previsto',
    reinvestFrequency: 'Frequenza Reinvestimento',
    feePerReinvest: 'Fee per Reinvestimento',
    totalAnnualCost: 'Costo totale annuo:',
    timeHorizon: 'Orizzonte Temporale',
    years: 'anni',
    year: 'anno',
    perYear: '/anno',
    finalBalance: 'Saldo Finale',
    afterYears: 'dopo',
    netProfit: 'Profitto Netto',
    totalROI: 'ROI totale',
    totalInterest: 'Interessi Totali',
    interestGenerated: 'interessi generati',
    totalFees: 'Fees Totali',
    reinvestments: 'reinvestimenti',
    compound: 'Composto:',
    simple: 'Semplice:',
    advantage: 'Vantaggio:',
    capitalGrowth: 'Crescita del Capitale',
    yearByYear: 'Dettaglio Anno per Anno',
    balance: 'Saldo',
    cumulativeInterest: 'Interessi Cumulativi',
    cumulativeFees: 'Fees Cumulative',
    netGain: 'Guadagno Netto',
    turboTipTitle: '💡 Turbo Range di Degate',
    turboTipDesc: 'Ottieni APY elevati con un\'interfaccia super semplice, direttamente dal tuo wallet Web3!',
    degateCta: 'Guadagna con Turbo Range',
    degateDesc: 'Degate Turbo Range ti permette di ottenere APY incredibili con un\'interfaccia super semplice, direttamente dal tuo wallet Web3 non-custodial. Nessuna complessit\u00e0, solo risultati.',
    tryTurboRange: 'Prova Turbo Range',
    daily: 'Giornaliero',
    weekly: 'Settimanale',
    monthly: 'Mensile',
    quarterly: 'Trimestrale',
    yearly: 'Annuale',
    compoundInterestLabel: 'Interesse Composto',
    simpleInterestLabel: 'Interesse Semplice',
    initialCapitalLabel: 'Capitale Iniziale',
    yearLabel: 'Anno',
    livePools: 'Tassi Pool Live',
    poolsDesc: 'APR in tempo reale da pool Raydium e Uniswap',
    useThisApr: 'Usa questo APR',
    poolSelected: 'Usando APR da',
    clearPool: 'Rimuovi',
    apr24h: '24h',
    apr7d: '7g',
    apr30d: '30g',
    tvlLabel: 'TVL',
    loadingPools: 'Caricamento pool...',
    poolsError: 'Impossibile caricare dati pool',
    disclaimer: "L'APR si basa su performance passate e può variare",
    priceRange: 'Range Prezzo',
    gasFeeDisclaimer: 'Le gas fee sono dinamiche e variabili in base all\'asset e alle condizioni di congestione della rete.',
    chooseAsset: 'Scegli il tuo asset',
    chooseAssetSubtitle: 'Seleziona il tuo asset e scopri la tua crescita futura 🚀',
    chooseAssetDesc: 'Seleziona una pool qui sopra per iniziare a calcolare l\'interesse composto.',
    selectAssetOverlay: '👆 Seleziona un asset qui sopra per sbloccare il calcolatore',
  },
  turbo: {
    degatePools: 'Pool Degate',
    refresh: 'Aggiorna',
    updating: 'Aggiornamento...',
    noPoolFound: 'Nessuna pool trovata.',
    selectPoolPrompt: 'Turbo Range Analysis',
    selectPoolDesc: 'Seleziona una pool dalla barra laterale per avviare la scansione radar della liquidità e simulare l\'Hyper-Yield.',
    liquidityMap: 'Mappa Liquidità',
    currentPrice: 'Prezzo Attuale',
    zoom: 'Zoom',
    loadingLiquidity: 'Calcolo distribuzione liquidità in corso...',
    analysisTitle: '💡 Analisi Avanzata Ottimizzazione (Hot Zone ±10%)',
    analysisDesc: 'Il Modulo Analitico analizza la distribuzione di tick attivi e calcola il peso relativo della liquidità concentrata. Attraverso l\'identificazione di deviazioni standard e zone di "Saturazione" o "Decompressione", fornisce metriche quantitative su dove posizionare le fasce di fornitura (LP) per minimizzare l\'Impermanent Loss sistemico o sovra-estrarre Yield percentualmente maggiore su direzionalità attesa.',
    resistanceDown: 'Resistenza Passiva al Ribasso (-10%)',
    resistanceUp: 'Resistenza Passiva al Rialzo (+10%)',
    highSaturation: '🔴 Alta Saturazione',
    optimalDecompression: '🟢 Decompressione Ottimale',
    balancedRange: '🟡 Range Bilanciato',
    volumeCoeff: 'Coefficiente Volumetrico',
    suggestedStrategy: 'Strategia Suggerita (Delta Allocation):',
    biasDown: 'Asimmetria Eccessiva Inferiore. La concentrazione liquida a ridosso del downside è strutturalmente satura, riducendo le APY. Una fornitura JIT asimmetrica (sbilanciata al rialzo) isolerà il volume in salita con un frazionamento della share drasticamente a tuo favore.',
    biasUp: 'Inversione del Muro di Liquidità verso l\'alto. Fortissima competizione di Market Maker limit-seller in fase di pump. Ottima l\'azione Delta-Neutra o il piazzamento di LP a sconto (sbilanciato < Current Price): in fase di drawdown improvviso l\'acquisizione delle trading fee opererà col 100% dell\'efficienza capitale su ampi delta price.',
    biasNeutral: 'Equilibrio Gaussiano V3 sul pricing locale. Nessuna deviazione vantaggiosa rilevata in questo range asimmetrico. Per un Alpha superiore, posizionare Bande Strette simmetriche a tolleranza ristretta (ad altissimo rischio di out-of-range) o effettuare il cross-reference su fee tiers ad alto rendimento isolato.',
    maxYield: '🔥 Massima Resa',
    maxYieldDesc: 'Ultra-concentrato. Altissime Fee, altissimo rischio Out-of-Range.',
    balanced: '⚖️ Media (Balanced)',
    balancedDesc: 'Canale bilanciato per assorbire volatilità standard in più giorni.',
    relaxZone: '☕ Relax Zone',
    relaxDesc: 'Banda larga per LP passivi. APR contenuto ma gestione zero-stress.',
    simulator: 'DIL & APR Simulatore',
    whaleTracker: 'Whale Tracker',
    whaleTitle: '🐋 Whale Tracker',
    whaleScanPassive: 'Scansione passiva 4h (Rete Pubblica). Refresh disabilitato.',
    poolList: '📋 Lista Pool',
    analysis: '📊 Analisi',
  },
};

const es: Translations = {
  nav: {
    tools: 'Herramientas',
    compoundInterest: 'Calculadora Interés',
    turboRange: 'Turbo Range',
    copyright: '© 2026 DeGate Tools',
  },
  compound: {
    title: 'Calculadora de Interés Compuesto',
    subtitle: 'Calcula el interés compuesto con frecuencia de reinversión personalizada y visualiza el crecimiento de tu capital a lo largo del tiempo.',
    parameters: 'Parámetros',
    investedCapital: 'Capital Invertido',
    expectedAnnualRate: 'Tasa Anual Esperada',
    reinvestFrequency: 'Frecuencia de Reinversión',
    feePerReinvest: 'Comisión por Reinversión',
    totalAnnualCost: 'Costo total anual:',
    timeHorizon: 'Horizonte Temporal',
    years: 'años',
    year: 'año',
    perYear: '/año',
    finalBalance: 'Saldo Final',
    afterYears: 'después de',
    netProfit: 'Beneficio Neto',
    totalROI: 'ROI total',
    totalInterest: 'Intereses Totales',
    interestGenerated: 'intereses generados',
    totalFees: 'Comisiones Totales',
    reinvestments: 'reinversiones',
    compound: 'Compuesto:',
    simple: 'Simple:',
    advantage: 'Ventaja:',
    capitalGrowth: 'Crecimiento del Capital',
    yearByYear: 'Detalle Año por Año',
    balance: 'Saldo',
    cumulativeInterest: 'Intereses Acumulados',
    cumulativeFees: 'Comisiones Acumuladas',
    netGain: 'Ganancia Neta',
    turboTipTitle: '💡 Degate Turbo Range',
    turboTipDesc: '¡Obtén APYs altos con una interfaz super simple, directamente desde tu wallet Web3!',
    degateCta: 'Gana con Turbo Range',
    degateDesc: 'Degate Turbo Range te permite ganar APYs increíbles con una interfaz super simple, directamente desde tu wallet Web3 no custodial. Sin complejidad, solo resultados.',
    tryTurboRange: 'Probar Turbo Range',
    daily: 'Diario',
    weekly: 'Semanal',
    monthly: 'Mensual',
    quarterly: 'Trimestral',
    yearly: 'Anual',
    compoundInterestLabel: 'Interés Compuesto',
    simpleInterestLabel: 'Interés Simple',
    initialCapitalLabel: 'Capital Inicial',
    yearLabel: 'Año',
    livePools: 'Tasas de Pool en Vivo',
    poolsDesc: 'APR en tiempo real de pools Raydium y Uniswap',
    useThisApr: 'Usar este APR',
    poolSelected: 'Usando APR de',
    clearPool: 'Quitar',
    apr24h: '24h',
    apr7d: '7d',
    apr30d: '30d',
    tvlLabel: 'TVL',
    loadingPools: 'Cargando pools...',
    poolsError: 'No se pueden cargar datos de pool',
    disclaimer: 'APR basado en rendimiento pasado y puede variar',
    priceRange: 'Rango de Precio',
    gasFeeDisclaimer: 'Las comisiones de gas son dinámicas y varían según el activo y las condiciones de congestión de la red.',
    chooseAsset: 'Elige tu activo',
    chooseAssetSubtitle: 'Elige tu activo y descubre tu crecimiento futuro 🚀',
    chooseAssetDesc: 'Selecciona un pool arriba para comenzar a calcular el interés compuesto.',
    selectAssetOverlay: '👆 Selecciona un activo arriba para desbloquear la calculadora',
  },
  turbo: {
    degatePools: 'Pools Degate',
    refresh: 'Actualizar',
    updating: 'Actualizando...',
    noPoolFound: 'No se encontraron pools.',
    selectPoolPrompt: 'Turbo Range Analysis',
    selectPoolDesc: 'Selecciona un pool de la barra lateral para iniciar el escaneo de distribución de liquidez y simular el Hyper-Yield.',
    liquidityMap: 'Mapa de Liquidez',
    currentPrice: 'Precio Actual',
    zoom: 'Zoom',
    loadingLiquidity: 'Calculando distribución de liquidez...',
    analysisTitle: '💡 Análisis Avanzado de Optimización (Hot Zone ±10%)',
    analysisDesc: 'El Módulo Analítico analiza la distribución de ticks activos y calcula el peso relativo de la liquidez concentrada, proporcionando métricas cuantitativas sobre dónde posicionar los rangos LP.',
    resistanceDown: 'Resistencia Pasiva a la Baja (-10%)',
    resistanceUp: 'Resistencia Pasiva al Alza (+10%)',
    highSaturation: '🔴 Alta Saturación',
    optimalDecompression: '🟢 Descompresión Óptima',
    balancedRange: '🟡 Rango Equilibrado',
    volumeCoeff: 'Coeficiente Volumétrico',
    suggestedStrategy: 'Estrategia Sugerida (Delta Allocation):',
    biasDown: 'Asimetría Excesiva Inferior. La concentración líquida cerca del downside está estructuralmente saturada, reduciendo los APY.',
    biasUp: 'Inversión del Muro de Liquidez hacia arriba. Fuerte competencia de Market Makers. Acción Delta-Neutra o colocación de LP con descuento es óptima.',
    biasNeutral: 'Equilibrio Gaussiano V3 en el pricing local. Ninguna desviación ventajosa detectada.',
    maxYield: '🔥 Máximo Rendimiento',
    maxYieldDesc: 'Ultra-concentrado. Muy altas fees, muy alto riesgo de out-of-range.',
    balanced: '⚖️ Equilibrado',
    balancedDesc: 'Canal equilibrado para absorber volatilidad estándar en varios días.',
    relaxZone: '☕ Zona Relax',
    relaxDesc: 'Banda amplia para LPs pasivos. APR contenido pero gestión sin estrés.',
    simulator: 'Simulador DIL y APR',
    whaleTracker: 'Whale Tracker',
    whaleTitle: '🐋 Whale Tracker',
    whaleScanPassive: 'Escaneo pasivo 4h (Red Pública). Actualización deshabilitada.',
    poolList: '📋 Lista de Pools',
    analysis: '📊 Análisis',
  },
};

const zh: Translations = {
  nav: {
    tools: '工具',
    compoundInterest: '复利计算器',
    turboRange: 'Turbo Range',
    copyright: '© 2026 DeGate Tools',
  },
  compound: {
    title: '复利计算器',
    subtitle: '使用自定义再投资频率计算复利，可视化您的资本随时间增长的趋势。',
    parameters: '参数设置',
    investedCapital: '投资本金',
    expectedAnnualRate: '预期年利率',
    reinvestFrequency: '再投资频率',
    feePerReinvest: '每次再投资手续费',
    totalAnnualCost: '年度总成本：',
    timeHorizon: '投资期限',
    years: '年',
    year: '年',
    perYear: '/年',
    finalBalance: '最终余额',
    afterYears: '经过',
    netProfit: '净收益',
    totalROI: '总投资回报率',
    totalInterest: '总利息',
    interestGenerated: '产生的利息',
    totalFees: '总手续费',
    reinvestments: '次再投资',
    compound: '复利：',
    simple: '单利：',
    advantage: '优势：',
    capitalGrowth: '资本增长',
    yearByYear: '逐年明细',
    balance: '余额',
    cumulativeInterest: '累计利息',
    cumulativeFees: '累计手续费',
    netGain: '净收益',
    turboTipTitle: '💡 Degate Turbo Range',
    turboTipDesc: '通过超简单的界面获得高APY，直接从您的Web3钱包操作！',
    degateCta: '用Turbo Range赚取收益',
    degateDesc: 'Degate Turbo Range让您通过超简单的界面获得令人难以置信的APY，直接从您的非托管Web3钱包操作。无复杂性，只有结果。',
    tryTurboRange: '试用Turbo Range',
    daily: '每日',
    weekly: '每周',
    monthly: '每月',
    quarterly: '每季度',
    yearly: '每年',
    compoundInterestLabel: '复利',
    simpleInterestLabel: '单利',
    initialCapitalLabel: '初始本金',
    yearLabel: '年份',
    livePools: '实时池收益',
    poolsDesc: '来自Raydium和Uniswap池的实时APR',
    useThisApr: '使用此APR',
    poolSelected: '正在使用来自',
    clearPool: '清除',
    apr24h: '24小时',
    apr7d: '7天',
    apr30d: '30天',
    tvlLabel: 'TVL',
    loadingPools: '加载池数据...',
    poolsError: '无法加载池数据',
    disclaimer: 'APR基于过往表现，可能会变化',
    priceRange: '价格范围',
    gasFeeDisclaimer: 'Gas费用是动态的，根据资产和网络拥堵状况而变化。',
    chooseAsset: '选择你的资产',
    chooseAssetSubtitle: '选择你的资产，预见你的未来增长 🚀',
    chooseAssetDesc: '选择上方的池开始计算复利。',
    selectAssetOverlay: '👆 选择上方的资产以解锁计算器',
  },
  turbo: {
    degatePools: 'Degate 池',
    refresh: '刷新',
    updating: '更新中...',
    noPoolFound: '未找到池。',
    selectPoolPrompt: 'Turbo Range 分析',
    selectPoolDesc: '从侧边栏选择一个池，开始扫描流动性分布并模拟超级收益。',
    liquidityMap: '流动性图谱',
    currentPrice: '当前价格',
    zoom: '缩放',
    loadingLiquidity: '正在计算流动性分布...',
    analysisTitle: '💡 高级优化分析 (热区 ±10%)',
    analysisDesc: '分析模块分析活跃刻度的分布，计算集中流动性的相对权重，提供量化指标以优化LP范围配置。',
    resistanceDown: '下行被动阻力 (-10%)',
    resistanceUp: '上行被动阻力 (+10%)',
    highSaturation: '🔴 高饱和',
    optimalDecompression: '🟢 最佳减压',
    balancedRange: '🟡 平衡范围',
    volumeCoeff: '成交量系数',
    suggestedStrategy: '建议策略 (Delta 配置):',
    biasDown: '过度下行不对称。下行附近的流动性集中结构性饱和，降低了APY。',
    biasUp: '流动性壁垒向上反转。做市商在上涨期间竞争激烈。Delta中性操作或折扣LP配置是最优的。',
    biasNeutral: '本地定价的高斯V3均衡。未检测到有利偏差。',
    maxYield: '🔥 最高收益',
    maxYieldDesc: '超集中。极高费用，极高出范围风险。',
    balanced: '⚖️ 均衡',
    balancedDesc: '均衡通道，可在多天内吸收标准波动。',
    relaxZone: '☕ 轻松区',
    relaxDesc: '被动LP宽带。APR较低但零压力管理。',
    simulator: 'DIL和APR模拟器',
    whaleTracker: '巨鲸追踪器',
    whaleTitle: '🐋 巨鲸追踪器',
    whaleScanPassive: '被动4小时扫描（公共网络）。刷新已禁用。',
    poolList: '📋 池列表',
    analysis: '📊 分析',
  },
};

export const translations: Record<Locale, Translations> = { en, it, es, zh };
