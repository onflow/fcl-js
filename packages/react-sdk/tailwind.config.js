/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  darkMode: "media",
  plugins: [],
  prefix: "flow-",
  // NB: Needed so that Tailwind doesn't remove the classes and we can use them in the theme
  safelist: [
    // All background colors
    {
      pattern:
        /^flow-bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    // All text colors
    {
      pattern:
        /^flow-text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    // All border colors
    {
      pattern:
        /^flow-border-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    // All hover background colors
    {
      pattern:
        /^hover:flow-bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    // Basic colors without numbers
    "flow-bg-black",
    "flow-bg-white",
    "flow-bg-transparent",
    "flow-text-black",
    "flow-text-white",
    "flow-border-black",
    "flow-border-white",
    "flow-border",
    "flow-hover:bg-black",
    "flow-hover:bg-white",
    "hover:flow-bg-black",
    "hover:flow-bg-white",
    "flow-hover:underline",
    "hover:flow-underline",
  ],
}
