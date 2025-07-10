/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  darkMode: "media",
  plugins: [],
  prefix: "flow-",
  important: true,
  corePlugins: {preflight: false},
}
