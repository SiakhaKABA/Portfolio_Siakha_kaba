import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // indispensable pour Docker
    port: 5173,
    proxy: {
      '/api': {
        // En Docker Compose → VITE_BACKEND_URL=http://backend:3001 (injecté par docker-compose.yml)
        // En local (npm run dev) → http://localhost:3001 par défaut
        target: process.env.VITE_BACKEND_URL ?? 'VITE_BACKEND_URL=http://backend:3001',
        changeOrigin: true,
      },
    },
  },
})
