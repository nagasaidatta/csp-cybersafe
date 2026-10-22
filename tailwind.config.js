/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#1d4ed8',
          600: '#1e40af',
          700: '#1e3a8a',
          800: '#172554',
          900: '#0f172a'
        }
      },
      boxShadow: {
        '2xs': '0 1px 2px rgba(15, 23, 42, 0.04)',
        'xs': '0 1px 3px rgba(15, 23, 42, 0.05)',
        'sm': '0 2px 7px rgba(15, 23, 42, 0.06)',
        DEFAULT: '0 5px 14px rgba(15, 23, 42, 0.07)',
        'md': '0 8px 22px rgba(15, 23, 42, 0.08)',
        'lg': '0 12px 30px rgba(15, 23, 42, 0.10)',
        'xl': '0 18px 42px rgba(15, 23, 42, 0.12)',
        '2xl': '0 24px 54px rgba(15, 23, 42, 0.14)',
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.875rem' }],
      }
    },
  },
  plugins: [],
}
