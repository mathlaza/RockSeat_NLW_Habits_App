/** @type {import('tailwindcss').Config} */
module.exports = {
  // Onde que estão meus arquivos que receberão css:
  content: [
    './src/**/*.tsx',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        blackBackground: '#09090A'
      }
    },
  },
  plugins: [],
}
