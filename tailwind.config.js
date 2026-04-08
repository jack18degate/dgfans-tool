/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/tools/turbo/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#06d6a0', // Neon Cyan from DG Fans map
        secondary: '#a855f7',
        background: '#05060f',
        surface: '#0c0e1a',
        border: 'rgba(255, 255, 255, 0.06)',
        text: '#edf0f7',
        textMuted: '#6b7a99' // using text-secondary
      }
    },
  },
  plugins: [],
}
