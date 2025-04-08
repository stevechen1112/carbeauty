/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./components/**/*.{vue,js,ts,jsx,tsx}",
    "./pages/**/*.{vue,js,ts,jsx,tsx}",
    "./App.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
          darker: '#1D4ED8',
          light: '#60A5FA',
          lighter: '#93C5FD'
        },
        secondary: {
          DEFAULT: '#10B981',
          dark: '#059669',
          darker: '#047857',
          light: '#34D399',
          lighter: '#6EE7B7'
        },
        accent: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
          darker: '#B45309',
          light: '#FBBF24',
          lighter: '#FCD34D'
        }
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'button': '0 2px 4px 0 rgba(0, 0, 0, 0.1)'
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem'
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem'
      }
    }
  },
  plugins: [],
} 