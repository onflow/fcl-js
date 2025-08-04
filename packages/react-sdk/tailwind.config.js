/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [],
  prefix: "flow-",
  safelist: [],
  // NB: Needed so that Tailwind doesn't remove the classes and we can use them in the theme
  safelist: [
    // All background colors
    {
      pattern:
        /^flow-bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/,
      variants: ["hover", "dark", "dark:hover"],
    },
    // All text colors
    {
      pattern:
        /^flow-text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/,
      variants: ["hover", "dark", "dark:hover"],
    },
    // All border colors
    {
      pattern:
        /^flow-border-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/,
      variants: ["hover", "dark", "dark:hover"],
    },
    // Basic colors without numbers - background
    {
      pattern: /^flow-bg-(black|white|transparent)$/,
      variants: ["hover", "dark", "dark:hover"],
    },
    // Basic colors without numbers - text
    {
      pattern: /^flow-text-(black|white)$/,
      variants: ["hover", "dark", "dark:hover"],
    },
    // Basic colors without numbers - border
    {
      pattern: /^flow-border-(black|white)$/,
      variants: ["hover", "dark", "dark:hover"],
    },
    // Additional specific classes
    "flow-border",
    "hover:flow-underline",
    "dark:hover:flow-underline",
  ],
}
