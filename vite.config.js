import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/AcaiAPI': {
        target: 'https://runasp.net',
  changeOrigin: true,
  ws: true,
  secure: false
      },
    },
  },
})
