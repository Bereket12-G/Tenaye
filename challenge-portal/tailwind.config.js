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
    },
  },
  plugins: [],
}