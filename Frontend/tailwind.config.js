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
      width: {
        '12/14': '85.714286%',
        '1/14': '7.142857%',
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
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.10)',
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
          'border-radius': '1.5rem',
          'overflow': 'hidden',
        },
        '.glass-hover': {
          '@apply transition-all duration-300': {},
          '&:hover': {
            'background': 'rgba(255, 255, 255, 0.15)',
            'border-color': 'rgba(255, 255, 255, 0.3)',
            'box-shadow': '0 8px 32px 0 rgba(51, 51, 51, 0.1)',
          },
        },
      });
    },
  ],
}
