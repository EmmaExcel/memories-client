/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App/**/*.{js,jsx,ts,tsx}",
    "./screen/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./styles/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        customColor: "#001F3F",
      },
    },
  },
  plugins: [],
};
