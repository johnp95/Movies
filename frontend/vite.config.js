import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    // user-event typing is slow under load; the 5s default can flake on CI
    testTimeout: 10000,
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true
  }
})