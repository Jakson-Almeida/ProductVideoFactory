const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  // Tailwind runs via postcss.config.js in the frontend root.
};
