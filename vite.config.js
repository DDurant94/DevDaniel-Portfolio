import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    // Optimize asset handling
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Manual chunking for better caching and loading
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
          'three-vendor': ['three'],
          'three-fiber': ['@react-three/fiber', '@react-three/drei'],
          'three-post': ['@react-three/postprocessing', 'postprocessing'],
          'motion-vendor': ['motion', '@react-spring/web', '@react-spring/three'],
          'router-vendor': ['react-router-dom'],
          'utils-vendor': ['lenis', '@emailjs/browser']
        },
        // Optimize asset naming for better caching
        assetFileNames: (assetInfo) => {
          // Separate assets by type for better caching
          if (/\.(png|jpe?g|webp|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i.test(assetInfo.name)) {
            return `assets/videos/[name]-[hash][extname]`;
          } else if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          
          return `assets/[name]-[hash][extname]`;
        }
      }
    }
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'motion',
      'lenis'
    ]
  },
  // Deployment headers for Netlify/Vercel (add to netlify.toml or vercel.json for production)
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  }
})
