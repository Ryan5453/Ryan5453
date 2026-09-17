import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { feed } from './vite.feed'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), feed()],
  css: {
    postcss: './postcss.config.js',
  },
})
