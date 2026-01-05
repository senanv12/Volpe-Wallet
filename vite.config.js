import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: process.env.VİTE_BASE_PATH || '/Volpe-Wallet',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'), // Sizin Landing Page
        app: resolve(__dirname, 'app.html'),    // React Tətbiqi
      },
    },
  },
})