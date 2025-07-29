/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5B4FE5',
          50: '#F3F2FF',
          100: '#E8E5FF',
          200: '#D1CCFF',
          300: '#B5ABFF',
          400: '#9286FF',
          500: '#5B4FE5',
          600: '#4A3FCF',
          700: '#3A30B8',
          800: '#2B23A2',
          900: '#1F1B8B'
        },
        secondary: {
          DEFAULT: '#8B7FF0',
          50: '#F7F6FF',
          100: '#EFECFF',
          200: '#DFD9FF',
          300: '#CBC2FF',
          400: '#B5A8FF',
          500: '#8B7FF0',
          600: '#7366E8',
          700: '#5D4EE0',
          800: '#4A3AD8',
          900: '#3A29D0'
        },
        accent: '#FF6B6B',
        success: '#4ECDC4',
        warning: '#FFE66D',
        error: '#FF6B6B',
        info: '#4E9FE5',
        surface: '#FFFFFF',
        background: '#F8F9FA'
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem'
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0,0,0,0.1)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.15)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.4s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceSubtle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-4px)' },
          '60%': { transform: 'translateY(-2px)' }
        }
      }
    },
  },
  plugins: [],
}