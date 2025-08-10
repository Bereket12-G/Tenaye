/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
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
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
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
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        barberpole: 'barberpole 2s linear infinite',
        jiggle: 'jiggle 1.6s ease-in-out infinite',
        pop: 'pop 300ms ease-out both',
        fadeIn: 'fadeIn 0.3s ease-out both',
        slideIn: 'slideIn 0.3s ease-out both',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}