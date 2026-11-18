import { defineConfig } from 'vitest/config';

/**
 * Test environment configuration.
 * `ADMIN_API_TOKEN` is injected so the admin-authenticated route can be
 * exercised without reading a real `.env` file.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    clearMocks: true,
    env: {
      NODE_ENV: 'test',
      MONGODB_URI: '',
      ADMIN_API_TOKEN: 'test-admin-token',
      CORS_ORIGIN: 'http://localhost:5173',
    },
  },
});
