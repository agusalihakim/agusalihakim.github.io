/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        bg:       "#F8F8F5",
        ink:      "#111111",
        muted:    "#6B6B6B",
        surface:  "#E8E4DC",
        accent:   "#4A6CF7",
      },
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body:    ["'Inter'", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 6.5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(1.75rem, 4vw, 2.75rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
      maxWidth: {
        content: "860px",
      },
    },
  },
  plugins: [],
};
