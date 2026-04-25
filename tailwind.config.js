/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgMain: '#ffffff',
        accent: '#B76E79',
        textMain: '#111111',
        textLight: '#555555',
        borderSoft: '#e5e5e5',
      },
      borderRadius: {
        'soft': '8px', // Perfect for those professional rounded corners
      }
    },
  },
  plugins: [],
}