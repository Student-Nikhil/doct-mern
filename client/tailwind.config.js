export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { display: ['"Bricolage Grotesque"', 'sans-serif'], body: ['Figtree', 'sans-serif'] },
      colors: {
        ink: '#0B1F24',
        porcelain: '#F2F8F6',
        teal: { 50: '#ECFDF9', 100: '#CCF7EE', 400: '#2DD4BF', 500: '#14B8A6', 600: '#0F9488', 700: '#0F766E', 800: '#115E59', 900: '#134E4A' },
        coral: { 400: '#FF8F72', 500: '#FF7A59', 600: '#F0613E' }
      },
      keyframes: {
        drift: { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(40px,-30px) scale(1.12)' } },
        pulseline: { '0%': { strokeDashoffset: 400 }, '100%': { strokeDashoffset: 0 } }
      },
      animation: { drift: 'drift 14s ease-in-out infinite', pulseline: 'pulseline 2.4s ease-out forwards' }
    }
  },
  plugins: []
};
