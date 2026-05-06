import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // ← indispensable pour Docker
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://backend:3001', // ← "backend" = nom du service Docker
        changeOrigin: true,
      },
    },
  },
})