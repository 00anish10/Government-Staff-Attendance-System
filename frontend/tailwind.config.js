/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nepali: {
          red: '#DC143C',
          blue: '#003893',
          crimson: '#C41E3A',
          gold: '#FFD700',
          green: '#006B3F',
        },
      },
    },
  },
  plugins: [],
}
