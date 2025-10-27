/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
    "./src/app/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: { '0%': {opacity:0, transform:'translateY(4px)'}, '100%': {opacity:1, transform:'none'} },
        slideUp: { '0%': {transform:'translateY(12px)', opacity:0}, '100%': {transform:'none', opacity:1} },
        scaleIn: { '0%': {transform:'scale(.98)', opacity:.0}, '100%': {transform:'scale(1)', opacity:1} },
        float: { '0%': { transform:'translateY(0)' }, '50%': { transform:'translateY(8px)' }, '100%': { transform:'translateY(0)' } }
      },
      animation: {
        fadeIn: 'fadeIn .25s ease-out both',
        slideUp: 'slideUp .25s ease-out both',
        scaleIn: 'scaleIn .18s ease-out both',
        float: 'float 6s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
