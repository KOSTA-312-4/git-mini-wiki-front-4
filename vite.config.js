import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // /api 요청은 백엔드 서버(server 폴더)로 전달
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
