/**
 * MongoDB connection helper.
 * The API can boot without a database (useful for local development and for
 * exercising validation/auth routes); health checks report the real state.
 */
import mongoose from 'mongoose';
import { env, isProduction } from './env';

export type DatabaseState = 'connected' | 'disconnected' | 'connecting';

export function getDatabaseState(): DatabaseState {
  switch (mongoose.connection.readyState) {
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    default:
      return 'disconnected';
  }
}

/** Opens the MongoDB connection. Resolves `false` when no URI is configured. */
export async function connectDatabase(): Promise<boolean> {
  if (!env.mongoUri) {
    console.warn('[db] MONGODB_URI is not set - starting without a database.');
    return false;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: !isProduction,
    });
    console.log(`[db] MongoDB connected to ${mongoose.connection.host}/${mongoose.connection.name}`);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[db] MongoDB connection failed: ${message}`);
    return false;
  }
}

/** Closes the connection gracefully on shutdown. */
export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('[db] MongoDB connection closed.');
  }
}
