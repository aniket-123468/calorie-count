/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cyan: '#06B6D4',
        pink: '#EC4899',
        green: '#10B981',
        amber: '#F59E0B',
        red: '#EF4444',
        lightgray: '#F8FAFC',
        darktext: '#0F172A',
        graytext: '#64748B',
        border: '#E2E8F0',
      },
    },
  },
  plugins: [],
};
