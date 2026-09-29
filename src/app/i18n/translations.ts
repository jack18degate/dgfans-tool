export type Locale = 'en' | 'it' | 'es' | 'zh' | 'fr';

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export interface Translations {
  nav: {
    tools: string;
    compoundInterest: string;
    turboRange: string;
    turboRangeGuide: string;
    copyright: string;
    themeLight: string;
    themeDark: string;
    onchainMarkets: string;
    onchainStocks: string;
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
  onchainmarkets: {
    title: string;
    subtitle: string;
    loadingAssets: string;
    searchPlaceholder: string;
    all: string;
    stocks: string;
    etfs: string;
    both: string;
    robinhood: string;
    crossPlatform: string;
    showingAssets: string;
    noAssetsFound: string;
    clearSearch: string;
    details: string;
    description: string;
    swapCheckTitle: string;
    buyOnDegate: string;
    contractAddresses: string;
    copyAddress: string;
    copied: string;
    viewExplorer: string;
    multiplier: string;
    tradingStatus: string;
    tradable: string;
    viewGuide: string;
    network: string;
    robinhoodChainInfo: string;
    multiChainBadge: string;
    buyOnEthereum: string;
    buyOnSolana: string;
    checkingSwap: string;
    swappable: string;
    marketClosed: string;
    noLiquidity: string;
    notTradable: string;
    noRoute: string;
    checkFailed: string;
    totalAssetsBadge: string;
    stocksBadge: string;
    etfsBadge: string;
    crossPlatformBadge: string;
    robinhoodBadge: string;
    popularSearches: string;
    verifiedContractTitle: string;
    verifiedContractDesc: string;
    whichChainTitle: string;
    rhChainFeature: string;
    solChainFeature: string;
    ethChainFeature: string;
    addToWallet: string;
    addNetwork: string;
    shareAsset: string;
    linkCopied: string;
    tokenAdded: string;
    networkAdded: string;
    buyOnDegateEth: string;
    buyOnDegateSol: string;
    buyOnRobinhood: string;
  };
  tools: {
    compoundCalcTitle: string;
    compoundCalcDesc: string;
    turboAnalysisDesc: string;
  };
}

const en: Translations = {
  nav: {
    tools: 'Tools',
    compoundInterest: 'Interest Calculator',
    turboRange: 'Turbo Range',
    turboRangeGuide: 'Turbo Range Guide',
    copyright: '© 2026 DeGate Tools',
    themeLight: 'Light Theme',
    themeDark: 'Dark Theme',
    onchainMarkets: 'On-Chain RWA Markets',
    onchainStocks: 'On-Chain Stocks',
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
  onchainmarkets: {
    title: 'RWA Token Explorer',
    subtitle: 'Explore tokenized real-world assets across Ondo Markets, Robinhood Chain & xStocks',
    loadingAssets: 'Loading assets...',
    searchPlaceholder: 'Search by ticker, name, or ISIN...',
    all: 'All',
    stocks: 'Stocks',
    etfs: 'ETFs',
    both: 'Both',
    robinhood: 'Robinhood',
    crossPlatform: 'Cross-Platform',
    showingAssets: 'Showing {count} of {total} assets',
    noAssetsFound: 'No assets match your filters',
    clearSearch: 'Clear search',
    details: 'Details',
    description: 'Description',
    swapCheckTitle: 'Swap Check ($100 USDC)',
    buyOnDegate: 'Buy on DeGate',
    contractAddresses: 'Contract Addresses',
    copyAddress: 'Copy contract address',
    copied: 'Copied! ✓',
    viewExplorer: 'Explorer',
    multiplier: 'Dividend Multiplier',
    tradingStatus: 'Trading Status',
    tradable: 'Tradable 24/5 + Overnight',
    viewGuide: 'Read On-Chain Stocks Guide',
    network: 'Network',
    robinhoodChainInfo: 'Official stock token issued by Robinhood Assets (Jersey) Limited on Robinhood Chain.',
    multiChainBadge: '{count} Chains',
    buyOnEthereum: '⟠ Buy {ticker} on Ethereum',
    buyOnSolana: '◎ Buy {ticker} on Solana',
    checkingSwap: 'Checking swap...',
    swappable: 'Swappable',
    marketClosed: 'Market Closed',
    noLiquidity: 'No Liquidity',
    notTradable: 'Not Tradable',
    noRoute: 'No Route',
    checkFailed: 'Check Failed',
    totalAssetsBadge: '{count} Total Assets',
    stocksBadge: '{count} Stocks',
    etfsBadge: '{count} ETFs',
    crossPlatformBadge: '{count} Cross-Platform',
    robinhoodBadge: '{count} Robinhood',
    popularSearches: 'Popular searches',
    verifiedContractTitle: 'Official Verified Contract (Anti-Scam 100%)',
    verifiedContractDesc: 'Official token issued by regulated entities (Robinhood Assets / Ondo / Backed). Beware of unofficial or third-party copies.',
    whichChainTitle: 'Which chain to choose?',
    rhChainFeature: 'Robinhood Chain: Micro gas (<$0.01), 24/5 + overnight continuous market, auto-compounding dividends.',
    solChainFeature: 'Solana (xStocks): Sub-second speed, micro fees (<$0.01), instant swap via Jupiter / DeGate.',
    ethChainFeature: 'Ethereum (Ondo): Deepest institutional liquidity and max security for large orders.',
    addToWallet: 'Add to Wallet',
    addNetwork: 'Add Network to Wallet',
    shareAsset: 'Share Asset',
    linkCopied: 'Link Copied! ✓',
    tokenAdded: 'Token Added! ✓',
    networkAdded: 'Network Added! ✓',
    buyOnDegateEth: 'Buy on DeGate (Ethereum) ↗',
    buyOnDegateSol: 'Buy on DeGate (Solana) ↗',
    buyOnRobinhood: 'Buy on DeGate (Robinhood Chain) ↗',
  },
  tools: {
    compoundCalcTitle: 'Compound Interest Calculator',
    compoundCalcDesc: 'Simulate capital growth with real rates from Turbo Range pools',
    turboAnalysisDesc: 'Advanced liquidity analysis and yield simulation',
  },
};

const it: Translations = {
  nav: {
    tools: 'Strumenti',
    compoundInterest: 'Calcolatore Interesse',
    turboRange: 'Turbo Range',
    turboRangeGuide: 'Guida Turbo Range',
    copyright: '© 2026 DeGate Tools',
    themeLight: 'Tema Chiaro',
    themeDark: 'Tema Scuro',
    onchainMarkets: 'Mercati RWA On-Chain',
    onchainStocks: 'Azioni On-Chain',
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
  onchainmarkets: {
    title: 'Esploratore RWA Token',
    subtitle: 'Esplora gli asset reali tokenizzati su Ondo Markets, Robinhood Chain e xStocks',
    loadingAssets: 'Caricamento asset...',
    searchPlaceholder: 'Cerca per ticker, nome, o ISIN...',
    all: 'Tutti',
    stocks: 'Azioni',
    etfs: 'ETF',
    both: 'Entrambi',
    robinhood: 'Robinhood',
    crossPlatform: 'Cross-Platform',
    showingAssets: 'Mostrando {count} di {total} asset',
    noAssetsFound: 'Nessun asset corrisponde ai filtri',
    clearSearch: 'Cancella ricerca',
    details: 'Dettagli',
    description: 'Descrizione',
    swapCheckTitle: 'Verifica Swap ($100 USDC)',
    buyOnDegate: 'Acquista su DeGate',
    contractAddresses: 'Indirizzi Smart Contract',
    copyAddress: 'Copia indirizzo contratto',
    copied: 'Copiato! ✓',
    viewExplorer: 'Explorer',
    multiplier: 'Moltiplicatore Dividendi',
    tradingStatus: 'Stato di Trading',
    tradable: 'Negoziabile 24/5 + Overnight',
    viewGuide: 'Leggi la Guida alle Azioni On-Chain',
    network: 'Rete',
    robinhoodChainInfo: 'Token azionario ufficiale emesso da Robinhood Assets (Jersey) Limited su Robinhood Chain.',
    multiChainBadge: '{count} Chain',
    buyOnEthereum: '⟠ Acquista {ticker} su Ethereum',
    buyOnSolana: '◎ Acquista {ticker} su Solana',
    checkingSwap: 'Verifica swap...',
    swappable: 'Scambiabile',
    marketClosed: 'Mercato Chiuso',
    noLiquidity: 'Nessuna Liquidità',
    notTradable: 'Non Scambiabile',
    noRoute: 'Nessuna Rotta',
    checkFailed: 'Verifica Fallita',
    totalAssetsBadge: '{count} Asset Totali',
    stocksBadge: '{count} Azioni',
    etfsBadge: '{count} ETF',
    crossPlatformBadge: '{count} Cross-Platform',
    robinhoodBadge: '{count} Robinhood',
    popularSearches: 'Ricerche rapide',
    verifiedContractTitle: 'Contratto Ufficiale Verificato (Anti-Scam 100%)',
    verifiedContractDesc: 'Token ufficiale emesso e garantito da entità regolamentate (Robinhood Assets / Ondo / Backed). Diffida da copie o token non ufficiali.',
    whichChainTitle: 'Quale chain scegliere?',
    rhChainFeature: 'Robinhood Chain: Gas micro (<$0.01), mercato 24/5 continuativo anche overnight, dividendi reinvestiti.',
    solChainFeature: 'Solana (xStocks): Velocità sub-second, fee micro (<$0.01), swap istantaneo su Jupiter / DeGate.',
    ethChainFeature: 'Ethereum (Ondo): Massima profondità di liquidità istituzionale e sicurezza per importi elevati.',
    addToWallet: 'Aggiungi al Wallet',
    addNetwork: 'Aggiungi Rete Robinhood',
    shareAsset: 'Condividi Scheda',
    linkCopied: 'Link Copiato! ✓',
    tokenAdded: 'Token Aggiunto! ✓',
    networkAdded: 'Rete Aggiunta! ✓',
    buyOnDegateEth: 'Acquista su DeGate (Ethereum) ↗',
    buyOnDegateSol: 'Acquista su DeGate (Solana) ↗',
    buyOnRobinhood: 'Acquista su DeGate (Robinhood Chain) ↗',
  },
  tools: {
    compoundCalcTitle: 'Calcolatore di Interesse Composto',
    compoundCalcDesc: 'Simula la crescita del capitale con i tassi reali dei pool Turbo Range',
    turboAnalysisDesc: 'Analisi avanzata della liquidità e simulazione rendimenti',
  },
};

const es: Translations = {
  nav: {
    tools: 'Herramientas',
    compoundInterest: 'Calculadora Interés',
    turboRange: 'Turbo Range',
    turboRangeGuide: 'Guía Turbo Range',
    copyright: '© 2026 DeGate Tools',
    themeLight: 'Tema Claro',
    themeDark: 'Tema Oscuro',
    onchainMarkets: 'Mercados RWA On-Chain',
    onchainStocks: 'Acciones On-Chain',
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
  onchainmarkets: {
    title: 'Explorador RWA Token',
    subtitle: 'Explore activos tokenizados del mundo real en Ondo Markets, Robinhood Chain y xStocks',
    loadingAssets: 'Cargando activos...',
    searchPlaceholder: 'Buscar por ticker, nombre o ISIN...',
    all: 'Todos',
    stocks: 'Acciones',
    etfs: 'ETFs',
    both: 'Ambos',
    robinhood: 'Robinhood',
    crossPlatform: 'Cross-Platform',
    showingAssets: 'Mostrando {count} de {total} activos',
    noAssetsFound: 'Ningún activo coincide con los filtros',
    clearSearch: 'Limpiar búsqueda',
    details: 'Detalles',
    description: 'Descripción',
    swapCheckTitle: 'Verificar Swap ($100 USDC)',
    buyOnDegate: 'Comprar en DeGate',
    contractAddresses: 'Direcciones de Contrato',
    copyAddress: 'Copiar dirección del contrato',
    copied: '¡Copiado! ✓',
    viewExplorer: 'Explorador',
    multiplier: 'Multiplicador de Dividendos',
    tradingStatus: 'Estado de Negociación',
    tradable: 'Negociable 24/5 + Overnight',
    viewGuide: 'Leer Guía de Acciones On-Chain',
    network: 'Red',
    robinhoodChainInfo: 'Token bursátil oficial emitido por Robinhood Assets (Jersey) Limited en Robinhood Chain.',
    multiChainBadge: '{count} Cadenas',
    buyOnEthereum: '⟠ Comprar {ticker} en Ethereum',
    buyOnSolana: '◎ Comprar {ticker} en Solana',
    checkingSwap: 'Comprobando swap...',
    swappable: 'Intercambiable',
    marketClosed: 'Mercado Cerrado',
    noLiquidity: 'Sin Liquidez',
    notTradable: 'No Comercializable',
    noRoute: 'Sin Ruta',
    checkFailed: 'Comprobación Fallida',
    totalAssetsBadge: '{count} Activos Totales',
    stocksBadge: '{count} Acciones',
    etfsBadge: '{count} ETFs',
    crossPlatformBadge: '{count} Cross-Platform',
    robinhoodBadge: '{count} Robinhood',
    popularSearches: 'Búsquedas populares',
    verifiedContractTitle: 'Contrato Oficial Verificado (Anti-Scam 100%)',
    verifiedContractDesc: 'Token oficial emitido por entidades reguladas (Robinhood Assets / Ondo / Backed). Desconfíe de copias o tokens no oficiales.',
    whichChainTitle: '¿Qué red elegir?',
    rhChainFeature: 'Robinhood Chain: Gas micro (<$0.01), mercado continuo 24/5 + overnight, dividendos reinvertidos.',
    solChainFeature: 'Solana (xStocks): Velocidad sub-segundo, tarifas micro (<$0.01), swap instantáneo en Jupiter / DeGate.',
    ethChainFeature: 'Ethereum (Ondo): Máxima profundidad de liquidez institucional y seguridad para grandes volúmenes.',
    addToWallet: 'Añadir a Wallet',
    addNetwork: 'Añadir Red Robinhood',
    shareAsset: 'Compartir Ficha',
    linkCopied: '¡Enlace Copiado! ✓',
    tokenAdded: '¡Token Añadido! ✓',
    networkAdded: '¡Red Añadida! ✓',
    buyOnDegateEth: 'Comprar en DeGate (Ethereum) ↗',
    buyOnDegateSol: 'Comprar en DeGate (Solana) ↗',
    buyOnRobinhood: 'Comprar en DeGate (Robinhood Chain) ↗',
  },
  tools: {
    compoundCalcTitle: 'Calculadora de Interés Compuesto',
    compoundCalcDesc: 'Simula el crecimiento del capital con tasas reales de pools Turbo Range',
    turboAnalysisDesc: 'Análisis avanzado de liquidez y simulación de rendimientos',
  },
};

const zh: Translations = {
  nav: {
    tools: '工具',
    compoundInterest: '复利计算器',
    turboRange: 'Turbo Range',
    turboRangeGuide: 'Turbo Range 指南',
    copyright: '© 2026 DeGate Tools',
    themeLight: '浅色模式',
    themeDark: '深色模式',
    onchainMarkets: '链上 RWA 市场',
    onchainStocks: '链上股票',
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
  onchainmarkets: {
    title: '链上 RWA 代币浏览器',
    subtitle: '探索 Ondo Markets、Robinhood Chain 和 xStocks 上的链上真实世界资产 (RWA)',
    loadingAssets: '正在加载资产...',
    searchPlaceholder: '按代币简称、名称或 ISIN 搜索...',
    all: '全部',
    stocks: '股票',
    etfs: 'ETFs',
    both: '跨平台',
    robinhood: 'Robinhood',
    crossPlatform: '跨平台支持',
    showingAssets: '显示 {count} / {total} 个资产',
    noAssetsFound: '没有资产匹配您的筛选条件',
    clearSearch: '清除搜索',
    details: '代币详情',
    description: '资产描述',
    swapCheckTitle: '兑换检测 ($100 USDC)',
    buyOnDegate: '在 DeGate 交易',
    contractAddresses: '合约地址',
    copyAddress: '复制合约地址',
    copied: '已复制! ✓',
    viewExplorer: '区块浏览器',
    multiplier: '股息复利乘数',
    tradingStatus: '交易状态',
    tradable: '支持 24/5 全天候与夜盘交易',
    viewGuide: '查看链上美股指南',
    network: '网络',
    robinhoodChainInfo: '由 Robinhood Assets (Jersey) Limited 在 Robinhood Chain 上发行的官方美股代币。',
    multiChainBadge: '{count} 条链',
    buyOnEthereum: '⟠ 在 Ethereum 购买 {ticker}',
    buyOnSolana: '◎ 在 Solana 购买 {ticker}',
    checkingSwap: '正在检测兑换路径...',
    swappable: '可兑换',
    marketClosed: '休市 (仅限交易时段)',
    noLiquidity: '暂无流动性',
    notTradable: '不可交易',
    noRoute: '无兑换路径',
    checkFailed: '检测失败',
    totalAssetsBadge: '{count} 个总资产',
    stocksBadge: '{count} 个股票',
    etfsBadge: '{count} 个 ETFs',
    crossPlatformBadge: '{count} 个跨平台支持',
    robinhoodBadge: '{count} 个 Robinhood',
    popularSearches: '热门快速搜索',
    verifiedContractTitle: '官方验证合约 (100% 防诈骗)',
    verifiedContractDesc: '由受监管机构 (Robinhood Assets / Ondo / Backed) 官方发行的真实资产代币。请警惕第三方同名仿冒代币。',
    whichChainTitle: '如何选择网络？',
    rhChainFeature: 'Robinhood Chain: 极低 Gas 费 (<$0.01)，24/5 连续全天候与夜盘交易，股息自动复利。',
    solChainFeature: 'Solana (xStocks): 亚秒级确认速度，极低费率 (<$0.01)，可通过 Jupiter / DeGate 快速兑换。',
    ethChainFeature: 'Ethereum (Ondo): 最深厚的机构级流动性，适合大额资金及最高安全性需求。',
    addToWallet: '添加到钱包',
    addNetwork: '添加 Robinhood 网络',
    shareAsset: '分享资产',
    linkCopied: '链接已复制! ✓',
    tokenAdded: '已添加代币! ✓',
    networkAdded: '已添加网络! ✓',
    buyOnDegateEth: '在 DeGate 购买 (Ethereum) ↗',
    buyOnDegateSol: '在 DeGate 购买 (Solana) ↗',
    buyOnRobinhood: '在 DeGate 购买 (Robinhood Chain) ↗',
  },
  tools: {
    compoundCalcTitle: '复利计算器',
    compoundCalcDesc: '用 Turbo Range 池的实时利率模拟资本增长',
    turboAnalysisDesc: '高级流动性分析和收益模拟',
  },
};

const fr: Translations = {
  nav: {
    tools: 'Outils',
    compoundInterest: 'Calculateur d\'intérêts',
    turboRange: 'Turbo Range',
    turboRangeGuide: 'Guide Turbo Range',
    copyright: '© 2026 DeGate Tools',
    themeLight: 'Thème clair',
    themeDark: 'Thème sombre',
    onchainMarkets: 'Marchés RWA On-Chain',
    onchainStocks: 'Actions On-Chain',
  },
  compound: {
    title: 'Calculateur d\'intérêts composés',
    subtitle: 'Calculez les intérêts composés avec une fréquence de réinvestissement personnalisée et visualisez la croissance de votre capital dans le temps.',
    parameters: 'Paramètres',
    investedCapital: 'Capital investi',
    expectedAnnualRate: 'Taux annuel attendu',
    reinvestFrequency: 'Fréquence de réinvestissement',
    feePerReinvest: 'Frais par réinvestissement',
    totalAnnualCost: 'Coût annuel total :',
    timeHorizon: 'Horizon temporel',
    years: 'ans',
    year: 'an',
    perYear: '/an',
    finalBalance: 'Solde final',
    afterYears: 'après',
    netProfit: 'Bénéfice net',
    totalROI: 'ROI total',
    totalInterest: 'Intérêts totaux',
    interestGenerated: 'intérêts générés',
    totalFees: 'Frais totaux',
    reinvestments: 'réinvestissements',
    compound: 'Composé :',
    simple: 'Simple :',
    advantage: 'Avantage :',
    capitalGrowth: 'Croissance du capital',
    yearByYear: 'Détail année par année',
    balance: 'Solde',
    cumulativeInterest: 'Intérêts cumulés',
    cumulativeFees: 'Frais cumulés',
    netGain: 'Gain net',
    turboTipTitle: '💡 Degate Turbo Range',
    turboTipDesc: 'Obtenez des APY élevés avec une interface ultra-simple, directement depuis votre wallet Web3 !',
    degateCta: 'Gagner avec Turbo Range',
    degateDesc: 'Degate Turbo Range vous permet d\'obtenir des APY incroyables avec une interface ultra-simple, directement depuis votre wallet Web3 non-custodial. Aucune complexité, que des résultats.',
    tryTurboRange: 'Essayer Turbo Range',
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
    quarterly: 'Trimestriel',
    yearly: 'Annuel',
    compoundInterestLabel: 'Intérêts composés',
    simpleInterestLabel: 'Intérêts simples',
    initialCapitalLabel: 'Capital initial',
    yearLabel: 'Année',
    livePools: 'Taux des pools en direct',
    poolsDesc: 'APR en temps réel des pools Raydium et Uniswap',
    useThisApr: 'Utiliser cet APR',
    poolSelected: 'APR utilisé de',
    clearPool: 'Effacer',
    apr24h: '24h',
    apr7d: '7j',
    apr30d: '30j',
    tvlLabel: 'TVL',
    loadingPools: 'Chargement des pools...',
    poolsError: 'Impossible de charger les données des pools',
    disclaimer: 'L\'APR est basé sur les performances passées et peut varier',
    priceRange: 'Fourchette de prix',
    gasFeeDisclaimer: 'Les frais de gas sont dynamiques et varient selon l\'actif et les conditions de congestion du réseau.',
    chooseAsset: 'Choisissez votre actif',
    chooseAssetSubtitle: 'Choisissez votre actif et découvrez votre croissance future 🚀',
    chooseAssetDesc: 'Sélectionnez un pool ci-dessus pour commencer à calculer les intérêts composés.',
    selectAssetOverlay: '👆 Sélectionnez un actif ci-dessus pour débloquer le calculateur',
  },
  turbo: {
    degatePools: 'Pools Degate',
    refresh: 'Actualiser',
    updating: 'Mise à jour...',
    noPoolFound: 'Aucun pool trouvé.',
    selectPoolPrompt: 'Analyse Turbo Range',
    selectPoolDesc: 'Sélectionnez un pool dans la barre latérale pour lancer le scan de distribution de liquidité et simuler l\'Hyper-Yield.',
    liquidityMap: 'Carte de liquidité',
    currentPrice: 'Prix actuel',
    zoom: 'Zoom',
    loadingLiquidity: 'Calcul de la distribution de liquidité...',
    analysisTitle: '💡 Analyse avancée d\'optimisation (Hot Zone ±10%)',
    analysisDesc: 'Le Module Analytique analyse la distribution des ticks actifs et calcule le poids relatif de la liquidité concentrée, fournissant des métriques quantitatives sur le placement optimal des fourchettes LP.',
    resistanceDown: 'Résistance passive à la baisse (-10%)',
    resistanceUp: 'Résistance passive à la hausse (+10%)',
    highSaturation: '🔴 Haute saturation',
    optimalDecompression: '🟢 Décompression optimale',
    balancedRange: '🟡 Fourchette équilibrée',
    volumeCoeff: 'Coefficient volumétrique',
    suggestedStrategy: 'Stratégie suggérée (Delta Allocation) :',
    biasDown: 'Asymétrie excessive inférieure. La concentration liquide près du downside est structurellement saturée, réduisant les APY.',
    biasUp: 'Inversion du mur de liquidité vers le haut. Forte concurrence des Market Makers. Action Delta-Neutre ou placement LP à prix réduit est optimal.',
    biasNeutral: 'Équilibre Gaussien V3 sur le pricing local. Aucune déviation avantageuse détectée.',
    maxYield: '🔥 Rendement maximum',
    maxYieldDesc: 'Ultra-concentré. Frais très élevés, risque très élevé de sortie de fourchette.',
    balanced: '⚖️ Équilibré',
    balancedDesc: 'Canal équilibré pour absorber la volatilité standard sur plusieurs jours.',
    relaxZone: '☕ Zone Relax',
    relaxDesc: 'Bande large pour LP passifs. APR contenu mais gestion sans stress.',
    simulator: 'Simulateur DIL et APR',
    whaleTracker: 'Whale Tracker',
    whaleTitle: '🐋 Whale Tracker',
    whaleScanPassive: 'Scan passif 4h (Réseau public). Actualisation désactivée.',
    poolList: '📋 Liste des pools',
    analysis: '📊 Analyse',
  },
  onchainmarkets: {
    title: 'Explorateur de tokens RWA',
    subtitle: 'Explorez les actifs réels tokenisés sur Ondo Markets, Robinhood Chain et xStocks',
    loadingAssets: 'Chargement des actifs...',
    searchPlaceholder: 'Rechercher par ticker, nom ou ISIN...',
    all: 'Tous',
    stocks: 'Actions',
    etfs: 'ETFs',
    both: 'Les deux',
    robinhood: 'Robinhood',
    crossPlatform: 'Cross-Platform',
    showingAssets: 'Affichage de {count} sur {total} actifs',
    noAssetsFound: 'Aucun actif ne correspond aux filtres',
    clearSearch: 'Effacer la recherche',
    details: 'Détails',
    description: 'Description',
    swapCheckTitle: 'Vérification Swap ($100 USDC)',
    buyOnDegate: 'Acheter sur DeGate',
    contractAddresses: 'Adresses de contrat',
    copyAddress: 'Copier l\'adresse du contrat',
    copied: 'Copié ! ✓',
    viewExplorer: 'Explorateur',
    multiplier: 'Multiplicateur de dividendes',
    tradingStatus: 'Statut de négociation',
    tradable: 'Négociable 24/5 + Overnight',
    viewGuide: 'Lire le guide des actions on-chain',
    network: 'Réseau',
    robinhoodChainInfo: 'Token d\'action officiel émis par Robinhood Assets (Jersey) Limited sur Robinhood Chain.',
    multiChainBadge: '{count} Blockchains',
    buyOnEthereum: '⟠ Acheter {ticker} sur Ethereum',
    buyOnSolana: '◎ Acheter {ticker} sur Solana',
    checkingSwap: 'Vérification du swap...',
    swappable: 'Échangeable',
    marketClosed: 'Marché fermé',
    noLiquidity: 'Pas de liquidité',
    notTradable: 'Non négociable',
    noRoute: 'Aucune route',
    checkFailed: 'Vérification échouée',
    totalAssetsBadge: '{count} actifs au total',
    stocksBadge: '{count} actions',
    etfsBadge: '{count} ETFs',
    crossPlatformBadge: '{count} Cross-Platform',
    robinhoodBadge: '{count} Robinhood',
    popularSearches: 'Recherches rapides',
    verifiedContractTitle: 'Contrat Officiel Vérifié (100% Anti-Arnaque)',
    verifiedContractDesc: 'Token officiel émis par des entités régulées (Robinhood Assets / Ondo / Backed). Méfiez-vous des copies non officielles de tiers.',
    whichChainTitle: 'Quelle blockchain choisir ?',
    rhChainFeature: 'Robinhood Chain : Frais micro (<0,01 $), marché continu 24/5 + overnight, dividendes réinvestis.',
    solChainFeature: 'Solana (xStocks) : Vitesse sub-seconde, frais micro (<0,01 $), swap instantané via Jupiter / DeGate.',
    ethChainFeature: 'Ethereum (Ondo) : Liquidité institutionnelle maximale et sécurité maximale pour gros volumes.',
    addToWallet: 'Ajouter au Wallet',
    addNetwork: 'Ajouter le Réseau Robinhood',
    shareAsset: 'Partager la Fiche',
    linkCopied: 'Lien copié ! ✓',
    tokenAdded: 'Token ajouté ! ✓',
    networkAdded: 'Réseau ajouté ! ✓',
    buyOnDegateEth: 'Acheter sur DeGate (Ethereum) ↗',
    buyOnDegateSol: 'Acheter sur DeGate (Solana) ↗',
    buyOnRobinhood: 'Acheter sur DeGate (Robinhood Chain) ↗',
  },
  tools: {
    compoundCalcTitle: 'Calculateur d\'intérêts composés',
    compoundCalcDesc: 'Simulez la croissance du capital avec les taux réels des pools Turbo Range',
    turboAnalysisDesc: 'Analyse avancée de la liquidité et simulation de rendements',
  },
};

export const translations: Record<Locale, Translations> = { en, it, es, fr, zh };
