/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cherry Bomb One"', 'cursive'],
        comic: ['"Comic Relief"', '"Comic Sans MS"', 'cursive'],
      },
    },
  },
  plugins: [],
};
