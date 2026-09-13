import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

/**
 * Vite config.
 *
 * `@kit` / `@demo` aliases keep imports short and, more importantly, make the
 * kit/demo boundary explicit: anything importing `@demo/*` is demo-only code.
 * Mirror the same two aliases in a consuming project and kit imports port over
 * verbatim.
 */
/**
 * Where the app will be served from.
 *
 * Root-hosted (Netlify, Vercel, a custom domain) needs nothing. GitHub Pages
 * serves a project site at `/<repo>/`, so the asset URLs have to be prefixed —
 * hence the env var rather than a hardcoded value, which would break every
 * other host.
 */
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@kit': fileURLToPath(new URL('./src/kit', import.meta.url)),
      '@demo': fileURLToPath(new URL('./src/demo', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Split the heavy, rarely-changing vendors into their own chunks so a
        // code change re-downloads only the app bundle, not all of MUI.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          charts: ['recharts'],
          editor: ['@xyflow/react'],
          terminal: ['@xterm/xterm', '@xterm/addon-fit', '@xterm/addon-web-links'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
