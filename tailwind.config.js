const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      languages: ['en'],
      animation: {
        'slide': 'slide-up 5s ease-out',
      },
      keyframes: {
        'slide-up': {
          '0%': {
            transform: 'translateY(0)',
          },
          '5%': {
            transform: 'translateY(-100px)',
          },
          '95%': {
            transform: 'translateY(-100px)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
