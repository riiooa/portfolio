/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-mono)', 'Courier New', 'monospace'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        'pure-black': '#000000',
        'pure-white': '#ffffff',
        'gray-950': '#0a0a0a',
        'gray-900': '#111111',
        'gray-800': '#1a1a1a',
        'gray-700': '#2a2a2a',
        'gray-600': '#3a3a3a',
        'gray-500': '#555555',
        'gray-400': '#888888',
        'gray-300': '#aaaaaa',
        'gray-200': '#cccccc',
        'gray-100': '#eeeeee',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'ripple': 'ripple 0.8s ease-out forwards',
        'scramble': 'scramble 0.3s steps(1) infinite',
        'typewriter': 'typewriter 2s steps(40) forwards',
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.6' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
