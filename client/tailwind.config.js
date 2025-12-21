/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 700ms ease-out both',
        slideUp: 'slideUp 600ms ease-out both',
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite'
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(0,0,0,0.15)'
      },
      backgroundSize: {
        'shimmer': '200% 100%'
      }
    }
  },
  plugins: []
};
