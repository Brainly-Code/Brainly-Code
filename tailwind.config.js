/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      fontFamily: {
        fredoka: ['Fredoka One', 'cursive'],
      },

      backgroundImage: {
        'bg1': "url('/src/assets/bg1.jpg')",
      },
    },
  },
  plugins: [],
};
