/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: { fontFamily: {
        'ubuntu': ['"Ubuntu"', 'cursive'],
      },},
  },
  plugins: [require("flowbite/plugin")],
}
