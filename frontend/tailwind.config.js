/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        orange: "var(--accent-orange)",
        cyan: "var(--accent-cyan)",
        green: "var(--accent-green)",
        yellow: "var(--accent-yellow)",
      },
      borderColor: {
        DEFAULT: "var(--border-default)",
        default: "var(--border-default)",
        subtle: "var(--border-subtle)",
        secondary: "var(--text-secondary)",
        orange: "var(--accent-orange)",
      },
      fontFamily: {
        display: ["Chivo", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  corePlugins: {
    preflight: true,
  },
  plugins: [],
};
