import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

/**
 * Unit tests for kit behaviour that a screenshot cannot prove: transport
 * reconnects, queue order, what a disabled block refuses. The browser suites
 * in tests/*.mjs cover rendering and layout.
 *
 * Tests live in tests/unit, not beside the components, so copying src/kit/
 * into a project brings no test files with it.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@kit': fileURLToPath(new URL('./src/kit', import.meta.url)),
      '@demo': fileURLToPath(new URL('./src/demo', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/unit/setup.ts'],
  },
});
