/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // existing palette (keep for compatibility)
        Green: '#4CAF50',
        'dull-white':'#FFFFFFB3',
        'white-light':'#FFFFFF30',
        'white-medium':'#FFFFFF40',

        // brand palette
        brand: {
          50:  '#f2fbf2',
          100: '#dff6e0',
          200: '#b9e9bb',
          300: '#84d688',
          400: '#57c65c',
          500: '#4CAF50', // same as Green
          600: '#3f9a44',
          700: '#2f7435',
          800: '#1f4f27',
          900: '#13351a',
        },
      }
    },
  },
  plugins: [],
}
