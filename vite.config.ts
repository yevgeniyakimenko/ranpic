import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({ 
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'ranpic.png', 
        'mask.svg', 
        'square-github.svg', 
        'square-github-light.svg', 
        'pwa-192x192.png', 
        'pwa-512x512.png', 
        'favicon.ico', 
        'apple-touch-icon.png',
      ],
      manifest: {
        name: 'RanPic',
        short_name: 'RanPic',
        description: 'Random avatar generator',
        theme_color: '#8e3fb9',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: 'any',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg}'],
      },
    }),
  ],
})
