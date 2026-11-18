/**
 * Centralised environment configuration.
 * Values are read once at startup so that secrets never leak into the
 * frontend bundle and misconfiguration is reported early.
 */
import dotenv from 'dotenv';

dotenv.config();

function readPort(raw: string | undefined, fallback: number): number {
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 && parsed <= 65535 ? parsed : fallback;
}

function readOrigins(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: readPort(process.env.PORT, 5000),
  mongoUri: (process.env.MONGODB_URI ?? '').trim(),
  /** Comma-separated allow-list of frontend origins, e.g. the Vercel domain. */
  corsOrigins: readOrigins(process.env.CORS_ORIGIN),
  /** Bearer token protecting GET /api/projects. Empty disables admin access. */
  adminToken: (process.env.ADMIN_API_TOKEN ?? '').trim(),
} as const;

export const isProduction = env.nodeEnv === 'production';
export const isTest = env.nodeEnv === 'test';
