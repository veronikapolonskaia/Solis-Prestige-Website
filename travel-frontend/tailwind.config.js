import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandPurple: '#2E0854',  // corporate dark purple
        brandGold: '#CBA45C',    // corporate gold
        champagne: '#f2dfcb',
      },
      fontFamily: {
        serif: ['Garamond', 'Georgia', 'serif'],
        sans: ['Garamond', 'Georgia', 'serif'],
        display: ['Garamond', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'wide': '0.05em',
        'wider': '0.1em',
        'widest': '0.15em',
        'logo': '0.08em',
        'tagline': '0.2em',
      },
    },
  },
  plugins: [forms],
}

