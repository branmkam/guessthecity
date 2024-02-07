/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        catamaran: ["Catamaran", "sans-serif"],
        oxygen: ["Oxygen", "sans-serif"]
      },
      keyframes: {
        fadein: {
          '0%': {opacity: 0},
          '100%': {opacity: 1},
        }
      },
      animation: {
        fadein: 'fadein 0.6s ease-in-out'
      }
    },
  },
  plugins: [],
};
