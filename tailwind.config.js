/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b0d11',
        surface: '#131720',
        'surface-hover': '#1a2030',
        border: '#1e2540',
        red: {
          DEFAULT: '#e84343',
          dim: '#7a1c1c',
        },
        orange: {
          DEFAULT: '#f5a623',
          dim: '#7a4f0a',
        },
        blue: {
          DEFAULT: '#4a9eff',
          dim: '#1a3d6e',
        },
        green: {
          DEFAULT: '#50c878',
          dim: '#1a4d2e',
        },
        purple: {
          DEFAULT: '#a855f7',
          dim: '#4a1a7a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
