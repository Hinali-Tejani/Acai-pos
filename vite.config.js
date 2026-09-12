import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/AcaiAPI': {
        target: 'https://palladiumacaiapi.runasp.net',
        changeOrigin: true,
        ws: true, // 👈 Ensures both HTTP and WebSocket streams pass through
        secure: false
      },
      '/orderhub': {
        target: 'https://runasp.net',
        changeOrigin: true,
        ws: true,
        secure: false,
      }
    }
  },
})
