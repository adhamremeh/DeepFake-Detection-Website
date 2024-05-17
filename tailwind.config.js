/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'SlideTableLeft': 'SlideTableLeft 0.5s ease-in-out forwards',
      },
      keyframes: {
        SlideTableLeft: {
          '0%': { transform: 'translateX(150vw)' },
          '100%': { transform: 'translateX(150vw)' },
        }
      }
    },
  },
  plugins: [],
}