/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}",
  "./index.html",
  "./html/**/*.{html,js}",
  "./src/**/*.{html,js}"
],
  theme: {
    extend: {
      boxShadow: {
       'test': '2px 3px 8px #eee',
      }
    },
  },
  plugins: [],
}
