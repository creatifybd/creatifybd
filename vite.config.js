import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  export default defineConfig({
    plugins: [
      react(),
      {
        name: 'inject-build-meta',
        transformIndexHtml(html) {
          const buildId = process.env.VITE_BUILD_ID || String(Date.now());
          const buildTs = new Date().toISOString();
          return html.replace(
            '<head>',
            `<head>\n  <meta name="build-id" content="${buildId}">\n  <meta name="build-ts" content="${buildTs}">`
          );
        }
      }
    ],
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/firebase')) return 'firebase';
            if (id.includes('node_modules/framer-motion')) return 'motion';
            if (id.includes('node_modules/lucide-react')) return 'icons';
            if (id.includes('node_modules/dompurify') || id.includes('node_modules/browser-image-compression')) return 'media-utils';
            if (id.includes('node_modules')) return 'vendor';
            if (id.includes('/src/pages/admin/') || id.includes('/src/pages/AdminDashboard')) return 'admin';
          }
        }
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
      css: true,
    },
  })
  