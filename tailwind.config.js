/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tui: {
          bg: '#0a0a0a',
          'bg-dark': '#000000',
          'bg-hl': '#1a1a1a',
          border: '#2a2a2a',
          text: '#a0a0a0',
          bright: '#e0e0e0',
          dim: '#505050',
          green: '#9ece6a',
          cyan: '#7dcfff',
          blue: '#7aa2f7',
          magenta: '#bb9af7',
          yellow: '#e0af68',
          red: '#f7768e',
          orange: '#ff9e64',
        }
      }
    }
  },
  plugins: [],
}
