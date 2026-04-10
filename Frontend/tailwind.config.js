/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'archivo': ['Archivo Black', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'sans': ['Lato', 'system-ui', 'sans-serif'],
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
      keyframes: {
        slideInFromLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutToLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        slideInFromRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutToRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        slideInFromLeft: 'slideInFromLeft 0.4s ease-out',
        slideOutToLeft: 'slideOutToLeft 0.4s ease-in',
        slideInFromRight: 'slideInFromRight 0.4s ease-out',
        slideOutToRight: 'slideOutToRight 0.4s ease-in',
      },
    },
  },
  plugins: [],
}
