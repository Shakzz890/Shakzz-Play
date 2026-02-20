import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/widevine': {
        target: 'http://143.44.136.74:9443',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/widevine/, '')
      }
    }
  }
})