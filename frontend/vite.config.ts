/// <reference types="vite/client" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Dev proxy: the browser calls /api/... and Vite forwards to Express,
    // so no CORS setup is needed during development.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    clearMocks: true,
  },
});
