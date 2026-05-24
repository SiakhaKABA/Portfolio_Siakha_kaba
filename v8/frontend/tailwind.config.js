/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      colors: {
        teal: { 400: '#2dd4bf', 300: '#5eead4', 200: '#99f6e4' },
      },
      animation: {
        'fade-in':  'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
        'scale-in': 'scaleIn 0.3s ease forwards',
        'shake':    'shake 0.4s ease',
        'float':    'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 },                              to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.93)' },    to: { opacity: 1, transform: 'scale(1)' } },
        shake:   { '0%,100%': { transform: 'translateX(0)' }, '20%,60%': { transform: 'translateX(-8px)' }, '40%,80%': { transform: 'translateX(8px)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' },         '50%': { transform: 'translateY(-14px)' } },
      },
    },
  },
  plugins: [],
}
