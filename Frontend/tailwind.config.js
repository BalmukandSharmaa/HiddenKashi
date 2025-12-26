/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3e2',
          100: '#fde7c5',
          200: '#fbce8b',
          300: '#f9b551',
          400: '#f79d17',
          500: '#e88b0b',
          600: '#c67208',
          700: '#a45906',
          800: '#824705',
          900: '#603503',
        },
      },
    },
  },
  plugins: [],
}
