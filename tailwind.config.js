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
        'light-bg': '#F5F5F4',        // warm neutral background
        'light-surface': '#FFFFFF',    // main cards/surfaces
        'light-accent': '#7BAE7F',     // primary green
        'light-secondary': '#EDE9FE',  // subtle lilac secondary accent
        'light-text': '#374151',       // strong neutral text
        'light-border': '#D4D4D8',     // soft neutral border

        // Dark Mode
        'dark-bg': '#020617',          // near-black slate
        'dark-surface': '#111827',     // primary surface
        'dark-accent': '#A8E6A2',      // soft green accent
        'dark-secondary': '#312E81',   // deep indigo secondary
        'dark-text': '#E5E7EB',        // light neutral text
        'dark-muted': '#9CA3AF',       // muted/secondary text
      },
    },
  },
  plugins: [],
};
