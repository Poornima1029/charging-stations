import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => ({
  base: './',  // ✅ this is the fix
  plugins: [vue()],
  build: {
    outDir: 'dist',
  },
  server: mode === 'development' ? {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  } : undefined,
}))
