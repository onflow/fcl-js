/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./index.html"],
  container: {
    center: true,
    padding: "1rem",
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1400px",
    },
  },
  theme: {
    extend: {
      colors: {
        flow: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          primary: "#00EF8B",
          secondary: "#FFB800",
          accent: "#9945FF",
          dark: "#1a1a1a",
        },
        purple: {
          primary: "#9945FF",
          secondary: "#b060ff",
        },
      },
      backgroundImage: {
        "linear-115": "linear-gradient(115deg, var(--tw-gradient-stops))",
        "linear-145": "linear-gradient(145deg, var(--tw-gradient-stops))",
        "flow-gradient":
          "linear-gradient(135deg, #00EF8B 0%, #22c55e 50%, #16a34a 100%)",
        "hero-pattern":
          'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      },
      fontFamily: {
        flow: ["Inter", "system-ui", "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": {opacity: "0"},
          "100%": {opacity: "1"},
        },
        slideUp: {
          "0%": {transform: "translateY(20px)", opacity: "0"},
          "100%": {transform: "translateY(0)", opacity: "1"},
        },
        float: {
          "0%, 100%": {transform: "translateY(0px)"},
          "50%": {transform: "translateY(-20px)"},
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
}
