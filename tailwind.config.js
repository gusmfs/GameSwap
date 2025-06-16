/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#2d2d2d',
        accent: '#3d3d3d',
      },
      fontFamily: {
        'tektur': ['Tektur', 'sans-serif'],
        'electrolize': ['Electrolize', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 