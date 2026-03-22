/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#34D399', // Dark Mode primary
          500: '#10B981', // Light Mode primary / Dark Mode Hover
          600: '#059669', // Light Mode Hover
        },
        secondary: {
          400: '#FBBF24', // Dark Mode secondary
          500: '#F59E0B', // Light Mode secondary
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
