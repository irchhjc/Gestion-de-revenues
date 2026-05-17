/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        ink: {
          900: '#0A0E1A',
          800: '#0F1524',
          700: '#161D33',
          600: '#1F2940',
        },
        accent: {
          400: '#7C9CFF',
          500: '#5B7FFF',
          600: '#3B5BDB',
        },
        success: {
          400: '#3DDC97',
          500: '#22C586',
          600: '#15A06A',
        },
        danger: {
          400: '#FF7B7B',
          500: '#F25757',
          600: '#D63939',
        },
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(91, 127, 255, 0.5)',
        card: '0 8px 32px -4px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
