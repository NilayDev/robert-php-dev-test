/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1787E8",
        secondary: "#191919",
        "light-gray": "#F1F4F9",
        "white-smoke": "#FBFBFB",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Default sans-serif will use Inter
      },
    },
  },
  plugins: [],
};
