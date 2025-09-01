import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      // 'localhost://3000',
      'backend-hx6c.onrender.com'
    ],
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    // 👇 allow .mjs, .js, .ts, etc.
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  optimizeDeps: {
    include: [
      'framer-motion',
      'lucide-react'
    ]
  },
})
