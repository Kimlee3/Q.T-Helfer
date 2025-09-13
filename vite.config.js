import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // Vercel 배포를 위한 기본 경로 설정
  plugins: [react()],
  server: {
    proxy: {
      // '/api'로 시작하는 요청을 http://localhost:3001 로 전달
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
