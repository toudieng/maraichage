/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}", // Scan les fichiers pour les classes Tailwind
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
