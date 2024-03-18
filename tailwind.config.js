/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0EA579',
        secondary: '#061A14',
        error: '#ED2939',
        accent: {
          yellow: '#FCD116',
          gray: '#5A5C5C'
        },
        gray: {
          400: "#5B5B5B",
          300: "#7A7A7A",
          200: "#D3D3D3",
          100: "#F3F3F3",
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [require('tw-elements/dist/plugin'), require('tailwind-scrollbar-hide')],
};
