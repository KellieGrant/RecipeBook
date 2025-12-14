/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
      gridTemplateColumns: {
        '70/30': '70% 28%',
      },
      colors: {
        // Light Mode
        'light-bg': '#F9FAFB',
        'light-surface': '#bcb5a4ff',
        'light-accent': '#7BAE7F',
        'light-secondary': '#F2E9E4',
        'light-text': '#6B7280',
        'light-border': '#949084ff',

        // Dark Mode
        'dark-bg': '#1C1C1C',
        'dark-surface': '#3F3F3F',
        'dark-accent': '#A8E6A2',
        'dark-secondary': '#E0CFC2',
        'dark-text': '#F3F4F6',
        'dark-muted': '#9CA3AF',
      },
    },
  },
  plugins: [],
};
