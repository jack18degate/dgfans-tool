---
title: "Buying Stocks On-chain through RFQ"
language: en
tags:
  - tokenized-stocks
  - RFQ
  - onchain-finance
  - RWA
created: 2026-08-05
---

# Buying Stocks On-chain through RFQ

A stock token does not always need a large DEX liquidity pool. With **RFQ**, short for **request for quote**, your wallet asks a professional market maker for a price for your specific order.

The price is calculated off-chain, but the trade settles on-chain.

## How does an RFQ trade work?

Suppose you want to spend 1,000 USDC on a stock token:

1. Your wallet tells a market maker which token you want and how much USDC you want to spend.
2. The market maker checks the underlying stock price and returns a short-lived offer, such as: “Pay 1,000 USDC and receive 4.82 tokens.”
3. Your wallet shows the amount you will receive, the spread or fee, and when the quote expires.
4. If you accept, you sign a transaction. Your USDC goes to the market maker and the stock tokens go to your wallet. Both transfers happen together on-chain.

Where do those tokens come from? Usually in one of two ways:

- The market maker already has the tokens and sends them to you. No new shares need to be bought at that moment.
- If more tokens are needed, funds are sent through the issuer. A broker buys the matching shares, new tokens are created, and the market maker can deliver them to the buyer.

Your wallet does not send USDC directly to a stock exchange. The companies behind the token handle the link between your payment, the token and the real shares. 

The quote expires quickly because the underlying stock price can move. If it expires, your wallet must request a new one.

## Why is a liquidity pool not necessary?

The market maker provides liquidity when an order arrives, using tokens it holds or can obtain. An AMM pool can still exist, but RFQ does not depend on one.

If an AMM price differs from an executable RFQ price, traders may buy from the cheaper venue and sell on the more expensive one. This tends to bring the prices closer together, although fees and limited liquidity can leave a small difference.

## When is the best time to trade?

Execution is often best during regular US market hours. The underlying shares are actively trading, so market makers have a clear reference price and can hedge more easily. Spreads are usually tighter, especially for larger orders.

Stock tokens may remain available outside those hours because blockchain markets do not close. However, 24/7 availability does not mean equally good pricing at all times.

When US exchanges are closed, the quote may use prices from an overnight or 24/7 real-share venue, if one is available. Otherwise, it relies more on the token market and the market maker’s estimate. Spreads may be wider, available size may be smaller, and the token price may differ from the stock’s next opening price.

## What should you check before trading?

- **Final amount:** Check how many tokens you will receive, not only the displayed stock price.
- **Spread and fees:** Compare the quote with the underlying stock price when that market is open, and include blockchain fees.
- **Expiration:** Sign before the quote expires; otherwise, request a fresh quote.
- **Trading hours:** For tighter pricing, prefer regular US market hours when possible.
- **Token terms:** Check the issuer, backing, redemption rules and supported countries. A stock token does not always give you legal ownership or voting rights in the underlying company.

In short: the market maker provides the price and liquidity, while the blockchain handles the exchange.

## Sources and further reading

- [Ondo Stocks API overview](https://docs.ondo.finance/api-reference/overview)
- [Ondo: What Are Tokenized Stocks and ETFs?](https://ondo.finance/learn/tokenized-rwas/tokenized-stocks-and-etfs)
- [xStocks: How xStocks Work](https://docs.xstocks.fi/docs/how-xstocks-work)
- [xStocks: xChange — Atomic RFQ](https://docs.xstocks.fi/docs/issuance-and-redemption/atomic-rfq-xchange)
- [xStocks: Market Flow](https://docs.xstocks.fi/docs/issuance-and-redemption/market-flow)
- [xStocks: Frequently Asked Questions](https://docs.xstocks.fi/docs/frequently-asked-questions)
- [Backpack Securities: Trading Hours and Pricing](https://learn.backpack.exchange/articles/backpack-securities-trading-hours-fees)
- [0x: Understanding RFQ](https://help.0x.org/articles/3310442497-understanding-0x-rfq-request-for-quote)
