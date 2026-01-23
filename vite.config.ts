import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    // For hash-based routing, redirect paths to root and let hash handle routing
    middlewareMode: false,
  },
  // Handle SPA routing in production
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
