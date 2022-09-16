/** @type {import('tailwindcss').Config} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto Mono", ...fontFamily.serif],
        display: ["Roboto Mono", ...fontFamily.serif],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
