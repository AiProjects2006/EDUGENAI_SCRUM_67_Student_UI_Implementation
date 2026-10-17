import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Same-origin proxy avoids CORS when calling the learning-resource service in dev
      '/api/resources': {
        target: process.env.VITE_RESOURCE_SERVICE_URL || 'http://localhost:8085',
        changeOrigin: true,
      },
    },
  },
})
