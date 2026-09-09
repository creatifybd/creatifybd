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
    manifest: true,
    chunkSizeWarningLimit: 600,
    assetsInlineLimit: 4096, // inline assets < 4KB as base64
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  test: {
    include: ['src/test/**/*.{test,spec}.{js,jsx}'],
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
})

