import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        UzuTBlack: '#0E2615',
        UzuTGreen: '#3FD246',
        primary: '#3FD246',
        secondary: '#BEC8DA',
        dark: '#0E2615',
        white: '#ffffff',
      },
    },
  },
} satisfies Config
