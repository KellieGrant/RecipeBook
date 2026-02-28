import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
   plugins: [
      react(),
      VitePWA({
         registerType: 'autoUpdate',
         includeAssets: ['vite.svg'],
         manifest: {
            name: 'Recipe Book',
            short_name: 'Recipe Book',
            description: 'Add recipes on the web, follow them in the kitchen',
            theme_color: '#7BAE7F',
            background_color: '#F9FAFB',
            display: 'standalone',
            start_url: '/',
            scope: '/',
            icons: [
               { src: '/vite.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
            ],
         },
         workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
            runtimeCaching: [
               {
                  urlPattern: /^https?:\/\/.*\/api\/.*/i,
                  handler: 'NetworkFirst',
                  options: {
                     cacheName: 'api-cache',
                     expiration: { maxEntries: 50, maxAgeSeconds: 5 * 60 },
                     cacheableResponse: { statuses: [0, 200] },
                     networkTimeoutSeconds: 10,
                  },
               },
            ],
         },
      }),
   ],
   server: {
      port: 3000,
      proxy: {
         '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true,
         },
      },
   },
});
