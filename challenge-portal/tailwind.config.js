/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefcf5',
          100: '#d6f7e6',
          200: '#b0efcf',
          300: '#80e2b3',
          400: '#4cd496',
          500: '#23c37d',
          600: '#16a569',
          700: '#148356',
          800: '#136745',
          900: '#0f5238',
        },
      },
      keyframes: {
        barberpole: {
          '0%': { backgroundPositionX: '0%' },
          '100%': { backgroundPositionX: '100%' },
        },
        jiggle: {
          '0%, 100%': { transform: 'skewX(0deg)' },
          '25%': { transform: 'skewX(1deg)' },
          '75%': { transform: 'skewX(-1deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        barberpole: 'barberpole 2s linear infinite',
        jiggle: 'jiggle 1.6s ease-in-out infinite',
        pop: 'pop 300ms ease-out both',
      },
    },
  },
  plugins: [],
}