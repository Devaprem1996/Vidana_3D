/**@type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "/src/**/*.{js.ts.jsx.tsx}"],
  theme: {
    extend: {
      fontFamily: {
        zentry: ["zentry", "sanf-serif"],
        general: ["general", "sanf-serif"],
        "robert-m": ["robert-medium", "sanf-serif"],
        "robert-r": ["robert-regular", "sanf-serif"],
        "circular-web": ["circular-web", "sanf-serif"],
      },
    },
  },
  plugins: [],
};
