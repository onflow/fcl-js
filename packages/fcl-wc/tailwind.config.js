/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideUp: {
          "0%": {
            transform: "translateY(100%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        slideUp: "slideUp 0.2s ease-out forwards",
      },
    },
  },
  darkMode: "class",
  plugins: [],
}
