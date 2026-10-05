# DeGate · Turbo Range — Quick guide

A concise English reference for Turbo Range, with four menu entries:

1. Where does Turbo Range yield come from?
2. How does your position change with price?
3. How to open a position — six steps: find an asset (looping video), fee tier, price range, amount, review, and creating.
4. Large orders and RFQ — dedicated section with a liquidity flow diagram.

Design principle: explain with visuals and video; use text only to highlight
important points. The two existing English videos are preserved. RFQ has its own numbered section. Legal
background and detailed risk notes remain available in expandable sections.

## Preview and publish

Open `index.html`, or run:

```sh
python3 -m http.server 8086 --bind 127.0.0.1
```

Upload `index.html`, `assets/`, and the `it/` language folder together to publish. No build or backend is
required. The `source/` and `qa/` folders are not required for hosting.

## Videos

- `assets/liquidity-provider-en.mp4`: 22-second fee animation.
- `assets/nvda-usdc-range-en.mp4`: 12-second position animation.

The two animations are silent H.264 MP4, 1920 × 1080, 24 fps. Playback starts automatically, muted and looping.
- `assets/find-nvda.mp4`: supplied 13-second portrait recording (602 × 1280).
  Plays muted and loops when in view, pauses off screen, and supports manual pause
  and enlargement.
The original Italian version is preserved separately.

## Rebuild video assets

Requires Node.js, `sharp`, and FFmpeg on PATH:

```sh
node source/render-videos.cjs fees
node source/render-videos.cjs range
cp qa/liquidity-provider-en-12.8.png assets/liquidity-provider-poster.png
cp qa/nvda-usdc-range-en-0.png assets/nvda-usdc-range-poster.png
```

Use `PREVIEW_ONLY=1` to generate sample frames without encoding.

## Opening-position screenshots

The walkthrough begins with the supplied find nvda.mp4 recording, followed by
the five supplied NVDA screenshots (IMG_0452–IMG_0456).
Select a step, use the previous/next controls, or navigate tabs with arrow keys.
Screenshots can be enlarged. Mobile layouts show six steps in two rows above the video or image.
CSS focus outlines mark the relevant controls; the amount screenshot uses
a green annotation matching the other steps. Each image keeps its
original aspect ratio. The Amount phone status bar is cropped from both the
walkthrough and enlarged view.

The final screenshot is the creating/processing state, not confirmation of a
successful opening. The success screenshot will be added when supplied.
The entry screen is excluded.

## Product overview

The opening section highlights Ondo Finance stocks and ETFs, permissionless
position creation via Ondo RFQ without relying on existing on-chain liquidity,
and $1M+ positions during market hours, using the supplied product messaging.

## Currency convention

The English page uses US dollar symbols ($). Future Italian and French versions
should use euro symbols (€), as requested.

RFQ hours and large-order reference links use https://status.ondo.finance/market.

Legal framework appears only as a small collapsed footer disclosure for Ondo,
with the ADGM register link. It is outside the numbered topics; xStocks and the
Swiss legal illustration are not displayed.

## Language selection / Selezione lingua

The header supports English and Italiano. Browser/device language is used on
first visit; manual selection is remembered. Unsupported languages default to
English. Each package includes both languages with relative links. Upload the
whole folder, including its language subdirectory. Videos autoplay muted and
loop, pause off screen, and retain manual pause controls.
