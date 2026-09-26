/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cookie: {
          bg: "#0B0C10",
          card: "#12141A",
          border: "#1F232E",
          hover: "#181B24",
          accent: "#8B5CF6",
          accentHover: "#7C3AED",
          gold: "#FFE500",
          neonGreen: "#10B981",
          cyan: "#06B6D4"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        montserrat: ['"Montserrat"', 'sans-serif'],
        komika: ['"Komika Axis"', 'Impact', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'sans-serif']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite',
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.8))' }
        },
        pop: {
          '0%': { transform: 'scale(0.92)' },
          '70%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1.0)' }
        }
      }
    },
  },
  plugins: [],
}
