/**
 * Server entry point: loads environment variables, connects to MongoDB,
 * starts Express and wires up graceful shutdown.
 */
import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/db';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const app = createApp();

  const server = app.listen(env.port, () => {
    console.log(`[server] Cynbit Discovery API listening on http://localhost:${env.port}`);
    console.log(`[server] Environment: ${env.nodeEnv}`);
    if (env.corsOrigins.length > 0) {
      console.log(`[server] CORS origins: ${env.corsOrigins.join(', ')}`);
    } else {
      console.log('[server] CORS: all origins allowed (set CORS_ORIGIN to restrict)');
    }
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n[server] Received ${signal}, shutting down...`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });

    // Force-exit if the connection refuses to close.
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch((error) => {
  console.error('[server] Failed to start:', error);
  process.exit(1);
});
