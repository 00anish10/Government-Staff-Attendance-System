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
          red: '#DC2626',
          blue: '#4338CA',
          crimson: '#C41E3A',
          gold: '#FFD700',
          green: '#16A34A',
        },
      },
    },
  },
  plugins: [],
}
