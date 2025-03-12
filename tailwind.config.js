/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff6b6b',
        'primary-dark': '#ff5252',
        secondary: '#4ecdc4',
        'secondary-dark': '#35b8b0',
      },
    },
  },
  plugins: [],
}
