import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  build: {
    outDir: 'dist', // default, but explicitly stating it is safe
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
