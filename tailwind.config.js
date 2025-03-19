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
      animation: {
        'slide-down': 'slideDown 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-left': 'slideLeft 0.5s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-100%) translateX(-50%)', opacity: 0 },
          '100%': { transform: 'translateY(0) translateX(-50%)', opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%) translateX(-50%)', opacity: 0 },
          '100%': { transform: 'translateY(0) translateX(-50%)', opacity: 1 },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%) translateY(-50%)', opacity: 0 },
          '100%': { transform: 'translateX(0) translateY(-50%)', opacity: 1 },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%) translateY(-50%)', opacity: 0 },
          '100%': { transform: 'translateX(0) translateY(-50%)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
