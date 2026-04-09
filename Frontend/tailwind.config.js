/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'lust': ['Lust', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'custom': {
          'white': '#FFFFFF',
          'off-white': '#F5F5F5',
          'light-gray': '#E8E8E8',
          'gray': '#D3D3D3',
          'medium-gray': '#999999',
          'dark-gray': '#666666',
          'charcoal': '#333333',
          'black': '#000000',
        }
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      fontSize: {
        '7xl': '5rem',
        '8xl': '6rem',
        '9xl': '7.5rem',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#333333',
          },
        },
      },
    },
  },
  plugins: [],
}
