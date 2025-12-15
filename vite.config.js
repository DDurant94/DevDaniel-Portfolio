import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          threeStack: [
            'three',
            '@react-three/fiber',
            '@react-three/drei'
          ],
          motionLibs: [
            'motion'
          ]
        }
      }
    }
  }
})
