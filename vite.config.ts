import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true
  },
  define: {
    // This ensures process.env is handled correctly in the browser build
    'process.env': {}
  }
})