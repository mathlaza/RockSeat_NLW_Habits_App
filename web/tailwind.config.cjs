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
        blackBackground: '#09090A' // Libera essa cor
      },
      gridTemplateRows: {
        7: 'repeat(7, minmax(0, 1fr))' // Libera opção de grid-rows-7
      }
    },
  },
  plugins: [],
}
