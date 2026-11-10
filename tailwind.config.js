/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base':           '#F8FAFC',
        'bg-panel':          '#FFFFFF',
        'surface-container': '#F1F5F9',
        'surface-elevated':  '#FFFFFF',
        'ink':               '#0F172A',
        'paper-text':        '#0F172A',
        'gold':              '#D97706',
        'gold-soft':         '#FCD34D',
        'muted-line':        '#E2E8F0',
        'right':             '#0D9488',
        'wrong':             '#DC2626',
        'navy':              '#1E3A8A',
        'navy-hover':        '#172554',
        'brass':             '#D97706',
        'brass-soft':        '#FEF3C7',
        'brass-text':        '#92400E',
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', '"EB Garamond"', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow':    '0 0 24px rgba(217, 119, 6, 0.25)',
        'gold-glow-lg': '0 0 36px rgba(217, 119, 6, 0.4)',
        'card-ambient': '0 20px 60px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}
