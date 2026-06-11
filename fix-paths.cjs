const fs = require('fs');

// Emoji to styled HTML replacements
const emojiReplacements = [
  // Scenario card emojis → colored CSS circles with symbols
  [/(<span class="scenario-emoji">)➡️(<\/span>)/g, '$1<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:var(--blue-soft);border:1px solid var(--blue-border);font-size:0.85rem;color:var(--blue)">→</span>$2'],
  [/(<span class="scenario-emoji">)📈(<\/span>)/g, '$1<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:rgba(80,228,162,0.1);border:1px solid rgba(80,228,162,0.2);font-size:0.85rem;color:var(--green)">↑</span>$2'],
  [/(<span class="scenario-emoji">)📉(<\/span>)/g, '$1<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:rgba(222,77,119,0.1);border:1px solid rgba(222,77,119,0.2);font-size:0.85rem;color:var(--red)">↓</span>$2'],
  [/(<span class="scenario-emoji">)📊(<\/span>)/g, '$1<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:var(--blue-soft);border:1px solid var(--blue-border);font-size:0.85rem;color:var(--blue)">≡</span>$2'],
  [/(<span class="scenario-emoji">)⚖️(<\/span>)/g, '$1<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.2);font-size:0.85rem;color:var(--gold)">⇌</span>$2'],
  [/(<span class="scenario-emoji">)🔄(<\/span>)/g, '$1<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:var(--blue-soft);border:1px solid var(--blue-border);font-size:0.85rem;color:var(--blue)">↻</span>$2'],
  [/(<span class="scenario-emoji">)🌐(<\/span>)/g, '$1<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:rgba(0,193,255,0.1);border:1px solid rgba(0,193,255,0.2);font-size:0.85rem;color:var(--cyan)">◉</span>$2'],

  // Table emojis
  [/📈 /g, '<span style="color:var(--green);font-weight:600">↑ </span>'],
  [/📉 /g, '<span style="color:var(--red);font-weight:600">↓ </span>'],
  [/➡️ /g, '<span style="color:var(--blue);font-weight:600">→ </span>'],

  // Strategy section header emojis
  [/🟢 /g, '<span style="color:var(--green)">● </span>'],
  [/🔴 /g, '<span style="color:var(--red)">● </span>'],
  [/⚖️ /g, '<span style="color:var(--gold)">⇌ </span>'],

  // Footer list emojis
  [/📧 /g, '<span style="opacity:0.6">✉ </span>'],
  [/📊 /g, '<span style="opacity:0.6">▥ </span>'],
  [/🚀 /g, '<span style="color:var(--blue)">⬆ </span>'],
  [/📱 /g, '<span style="opacity:0.6">▪ </span>'],
  [/🌐 /g, '<span style="opacity:0.6">◎ </span>'],

  // Script status text emojis → simple text indicators
  [/📊 In range/g, '● In range'],
  [/📊 Nel range/g, '● Nel range'],
  [/🔴 Out of range/g, '● Out of range'],
  [/🔴 Fuori range/g, '● Fuori range'],
  [/🟢 Out of range/g, '● Out of range'],
  [/🟢 Fuori range/g, '● Fuori range'],
];

// Light theme CSS to inject
const lightThemeCSS = `
        /* LIGHT THEME */
        body.light-theme {
            background: #f8fafc; color: #334155;
        }
        body.light-theme { --text-h: #0f172a; --text-p: #475569; --text-muted: #94a3b8;
            --border: rgba(15,23,42,0.08); --card-bg: rgba(15,23,42,0.025);
            --blue-soft: rgba(0,128,255,0.08); --blue-border: rgba(0,128,255,0.15);
        }
        body.light-theme .doc-badge { background: rgba(0,128,255,0.06); }
        body.light-theme .callout { background: linear-gradient(135deg, rgba(0,128,255,0.04) 0%, rgba(0,128,255,0.01) 100%); }
        body.light-theme .callout p { color: #475569; }
        body.light-theme .video-caption, body.light-theme .screenshot-caption { background: rgba(0,0,0,0.05); color: #64748b; }
        body.light-theme .position-bar-container { background: rgba(15,23,42,0.06); }
        body.light-theme .tool-card { background: linear-gradient(135deg, rgba(0,128,255,0.04) 0%, rgba(0,193,255,0.02) 100%); }
        body.light-theme .tool-card:hover { background: linear-gradient(135deg, rgba(0,128,255,0.08) 0%, rgba(0,193,255,0.04) 100%); }
        body.light-theme a { color: #0060cc; }
        body.light-theme .key { color: #0060cc; }
        body.light-theme strong { color: #0f172a; }
        body.light-theme .check { color: #059669; }
        body.light-theme .cross { color: #dc2626; }
`;

// Theme detection script to inject
const themeScript = `
    // Listen for theme changes from parent
    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    }

    // Listen for messages from parent window
    window.addEventListener('message', function(e) {
        if (e.data && e.data.type === 'theme-change') {
            applyTheme(e.data.theme);
        }
    });

    // Check parent's theme on load
    try {
        var parentTheme = window.parent.document.documentElement.getAttribute('data-theme') || 'dark';
        applyTheme(parentTheme);
    } catch(e) {}
`;

['turborangeita', 'turborangeeng'].forEach(f => {
  const path = 'public/landing/' + f + '.html';
  let h = fs.readFileSync(path, 'utf8');

  // Fix asset paths
  h = h.replace(/src="DEGATE LOGO\.png"/g, 'src="/degate-logo-landing.png"');
  h = h.replace(/src="Screenshot_2025-10-28_at_10\.50\.19\.png"/g, 'src="/turborange-screenshot.png"');
  h = h.replace(/src="liquidity_provider_fee_story\.mp4"/g, 'src="/liquidity_provider_fee_story.mp4"');

  // Replace emojis
  for (const [pattern, replacement] of emojiReplacements) {
    h = h.replace(pattern, replacement);
  }

  // Inject light theme CSS before </style>
  h = h.replace('</style>', lightThemeCSS + '\n    </style>');

  // Inject theme detection script before </body>
  h = h.replace('</body>', '<script>' + themeScript + '</script>\n</body>');

  fs.writeFileSync(path, h, 'utf8');
  console.log(f + ' fully patched');
});
