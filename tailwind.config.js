module.exports = {
  content: [
    "./src/app/components/turbo-range/**/*.{js,ts,jsx,tsx}",
    "./src/app/tools/page.tsx"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#06d6a0', // Neon Cyan from DG Fans map
        secondary: '#a855f7',
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-hover': 'var(--surface-hover)',
        border: 'var(--border)',
        text: 'var(--text-primary)',
        textMuted: 'var(--text-secondary)'
      }
    },
  },
  plugins: [],
}
