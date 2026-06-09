import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#F5F4F0',
        surface: '#FFFFFF',
        border: '#D8D5CE',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B6860',
        'text-muted': '#9E9B93',
        accent: '#E8562A',
        'accent-bg': '#FDF0EB',
        positive: '#1A6633',
        'positive-bg': '#EBF5EE',
        negative: '#842029',
        'negative-bg': '#FDF0F1',
        gold: '#D4A017',
        'gold-bg': '#FBF0D0',
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '10px',
      },
    },
  },
  plugins: [],
}

export default config
