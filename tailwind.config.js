// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',      // deine Seiten
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',    // falls vorhanden
    './app/**/*.{js,ts,jsx,tsx,mdx}',          // Fallback
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
