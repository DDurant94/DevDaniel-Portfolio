import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core - keep together in one chunk
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
          // Three.js ecosystem
          'three-vendor': ['three'],
          'three-fiber': ['@react-three/fiber', '@react-three/drei'],
          'three-post': ['@react-three/postprocessing', 'postprocessing'],
          // Motion libraries
          'motion-vendor': ['motion', '@react-spring/web', '@react-spring/three'],
          // Router
          'router-vendor': ['react-router-dom'],
          // UI libraries
          'ui-vendor': ['react-bootstrap', 'bootstrap'],
          // Utilities
          'utils-vendor': ['lenis', '@emailjs/browser']
        }
      }
    }
  }
})
