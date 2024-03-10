module.exports = {
  corePlugins: {
    preflight: false,
  },
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
        ],
      },
    ],
    "declaration-block-trailing-semicolon": null,
    "no-descending-specificity": null,
  },
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        auto: "max-content auto",
      },
      borderWidth: {
        1: "1px",
      },
      colors: {
        navy: "#044B81",
        blue0: "#E4EDF9",
        blue1: "#02BBFE",
        blue2: "#2BA3FA",
        bgBlue: "rgba(43, 163, 250, 0.15)",
        lightGray: "#E6E7EB",
        medGray: "#CBCFD4",
        darkGray: "#7E858D",
        brown: "#C8BBAA",
        black: "#000000",
        white: "#FFFFFF",
        offWhite: "#F9F9F9",
      },

      container: {
        center: true,
        padding: "1rem",
        screens: {
          lg: "720px",
          xl: "920px",
          "2xl": "1152px",
        },
      },
      lineHeight: {
        none: "0",
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography')
  ]
  // plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
