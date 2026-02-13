import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  publicDir: 'public',
  plugins: [react(),  tailwindcss(),],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('three') || id.includes('@react-three')) return 'three-stack';
          if (id.includes('framer-motion')) return 'motion-stack';
          if (id.includes('react-router-dom')) return 'router-stack';
          if (id.includes('html2pdf') || id.includes('html2canvas') || id.includes('dompurify')) return 'export-stack';
          return 'vendor';
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
