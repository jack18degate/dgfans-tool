---
title: "Buying Stocks On-chain through RFQ"
language: it
tags:
  - tokenized-stocks
  - RFQ
  - onchain-finance
  - RWA
created: 2026-08-05
---

# Acquistare azioni on-chain tramite RFQ

Un token azionario non ha sempre bisogno di una grande pool di liquidità su un DEX. Con l’**RFQ**, abbreviazione di **request for quote** (richiesta di quotazione), il tuo wallet chiede a un market maker professionale un prezzo per il tuo ordine specifico.

Il prezzo viene calcolato off-chain, ma la transazione viene regolata on-chain.

## Come funziona una transazione RFQ?

Supponiamo che tu voglia spendere 1.000 USDC per un token azionario:

1. Il tuo wallet comunica a un market maker quale token desideri e quanti USDC vuoi spendere.
2. Il market maker controlla il prezzo dell’azione sottostante e restituisce un’offerta di breve durata, ad esempio: “Paga 1.000 USDC e ricevi 4,82 token”.
3. Il tuo wallet mostra l’importo che riceverai, lo spread o la commissione e la scadenza della quotazione.
4. Se accetti, firmi una transazione. I tuoi USDC vanno al market maker e i token azionari arrivano nel tuo wallet. Entrambi i trasferimenti avvengono insieme on-chain.

Da dove provengono questi token? Di solito, in uno di questi due modi:

- Il market maker possiede già i token e te li invia. In quel momento non è necessario acquistare nuove azioni.
- Se servono altri token, i fondi vengono inviati tramite l’emittente. Un broker acquista le azioni corrispondenti, vengono creati nuovi token e il market maker può consegnarli all’acquirente.

Il tuo wallet non invia gli USDC direttamente a una borsa valori. Le società che gestiscono il token si occupano del collegamento tra il tuo pagamento, il token e le azioni reali. 

La quotazione scade rapidamente perché il prezzo dell’azione sottostante può cambiare. Se scade, il tuo wallet deve richiederne una nuova.

## Perché non è necessaria una pool di liquidità?

Il market maker fornisce liquidità quando arriva un ordine, utilizzando i token che possiede o che può ottenere. Una pool AMM può comunque esistere, ma l’RFQ non dipende da essa.

Se il prezzo di un AMM differisce da un prezzo RFQ effettivamente eseguibile, i trader possono acquistare sulla piattaforma meno cara e vendere su quella più costosa. Questo tende ad avvicinare i prezzi, anche se le commissioni e una liquidità limitata possono lasciare una piccola differenza.

## Qual è il momento migliore per fare trading?

L’esecuzione è spesso migliore durante il normale orario di mercato negli Stati Uniti. Le azioni sottostanti vengono negoziate attivamente, quindi i market maker dispongono di un prezzo di riferimento chiaro e possono coprirsi più facilmente. Gli spread sono generalmente più ridotti, soprattutto per gli ordini più grandi.

I token azionari possono rimanere disponibili al di fuori di questi orari, perché i mercati blockchain non chiudono. Tuttavia, una disponibilità 24 ore su 24, 7 giorni su 7, non significa che i prezzi siano ugualmente convenienti in ogni momento.

Quando le borse statunitensi sono chiuse, la quotazione può utilizzare i prezzi di una piattaforma overnight o attiva 24 ore su 24, 7 giorni su 7, sulla quale vengono negoziate azioni reali, se disponibile. In caso contrario, dipende maggiormente dal mercato del token e dalla stima del market maker. Gli spread possono essere più ampi, la quantità disponibile può essere inferiore e il prezzo del token può differire dal prezzo di apertura successivo dell’azione.

## Cosa dovresti controllare prima di fare trading?

- **Importo finale:** controlla quanti token riceverai, non soltanto il prezzo dell’azione visualizzato.
- **Spread e commissioni:** confronta la quotazione con il prezzo dell’azione sottostante quando quel mercato è aperto e includi le commissioni della blockchain.
- **Scadenza:** firma prima che la quotazione scada; in caso contrario, richiedine una aggiornata.
- **Orari di negoziazione:** per ottenere prezzi più convenienti, quando possibile preferisci il normale orario di mercato negli Stati Uniti.
- **Condizioni del token:** controlla l’emittente, le attività a garanzia, le regole di rimborso e i Paesi supportati. Un token azionario non ti conferisce sempre la proprietà legale o il diritto di voto nella società sottostante.

In breve: il market maker fornisce il prezzo e la liquidità, mentre la blockchain gestisce lo scambio.

## Fonti e ulteriori letture

- [Ondo Stocks: panoramica dell’API](https://docs.ondo.finance/api-reference/overview)
- [Ondo: cosa sono le azioni e gli ETF tokenizzati?](https://ondo.finance/learn/tokenized-rwas/tokenized-stocks-and-etfs)
- [xStocks: come funzionano gli xStocks](https://docs.xstocks.fi/docs/how-xstocks-work)
- [xStocks: xChange — RFQ atomico](https://docs.xstocks.fi/docs/issuance-and-redemption/atomic-rfq-xchange)
- [xStocks: Market Flow](https://docs.xstocks.fi/docs/issuance-and-redemption/market-flow)
- [xStocks: domande frequenti](https://docs.xstocks.fi/docs/frequently-asked-questions)
- [Backpack Securities: orari di negoziazione e prezzi](https://learn.backpack.exchange/articles/backpack-securities-trading-hours-fees)
- [0x: comprendere l’RFQ](https://help.0x.org/articles/3310442497-understanding-0x-rfq-request-for-quote)
