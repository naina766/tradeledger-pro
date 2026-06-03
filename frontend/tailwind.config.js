/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables manually toggling dark mode via class
  theme: {
    extend: {
      colors: {
        // Linear & Stripe style premium color palettes
        slate: {
          950: '#030712',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
        brand: {
          primary: '#4f46e5', // Indigo
          success: '#10b981', // Neon emerald for profit
          danger: '#ef4444', // Coral red for losses
          warning: '#f59e0b', // Yellow
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 4px 30px rgba(0, 0, 0, 0.4)',
        glow: '0 0 15px rgba(79, 70, 229, 0.4)'
      }
    },
  },
  plugins: [],
}
