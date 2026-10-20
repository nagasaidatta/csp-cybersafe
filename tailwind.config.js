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
        '2xs': '0 0 4px 0 rgba(0, 0, 0, 0.08)',
        'xs': '0 0 6px 1px rgba(0, 0, 0, 0.08)',
        'sm': '0 0 12px 1px rgba(0, 0, 0, 0.09), 0 0 4px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 0 16px 2px rgba(0, 0, 0, 0.10), 0 0 5px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 0 22px 3px rgba(0, 0, 0, 0.12), 0 0 7px 0 rgba(0, 0, 0, 0.05)',
        'lg': '0 0 30px 4px rgba(0, 0, 0, 0.14), 0 0 9px 0 rgba(0, 0, 0, 0.06)',
        'xl': '0 0 40px 6px rgba(0, 0, 0, 0.16), 0 0 12px 0 rgba(0, 0, 0, 0.07)',
        '2xl': '0 0 52px 8px rgba(0, 0, 0, 0.18), 0 0 14px 0 rgba(0, 0, 0, 0.08)',
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.875rem' }],
      }
    },
  },
  plugins: [],
}
