import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Venueta',
        short_name: 'Venueta',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    host: true // expose dev server to your network so your phone can access it
  }
});
