/**
 * Centralised error handling: 404 for unknown routes and a single
 * JSON error shape for anything thrown downstream.
 */
import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { isProduction, isTest } from '../config/env';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

/**
 * Resolves an HTTP status code from an error.
 * Body-parser errors (malformed JSON, oversized payloads) carry their own
 * `status`/`statusCode`, Mongoose errors map to 400/409, everything else is 500.
 */
function resolveStatus(error: unknown): number {
  if (
    error instanceof mongoose.Error.ValidationError ||
    error instanceof mongoose.Error.CastError
  ) {
    return 400;
  }
  if (typeof error === 'object' && error !== null) {
    const candidate = error as { status?: unknown; statusCode?: unknown; code?: unknown };
    const explicit =
      (typeof candidate.status === 'number' && candidate.status) ||
      (typeof candidate.statusCode === 'number' && candidate.statusCode);
    if (explicit) return explicit;
    if (candidate.code === 11000) return 409; // duplicate key
    if (candidate.code === 'entity.parse.failed') return 400; // malformed JSON body
  }
  return 500;
}

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = resolveStatus(error);
  const rawMessage = error instanceof Error ? error.message : 'Unexpected server error';

  if (!isTest) {
    console.error(`[error] ${req.method} ${req.originalUrl} -> ${status}:`, error);
  }

  // Friendly wording for the common client-side failures; everything else is
  // hidden behind a generic message in production.
  const errorType = typeof error === 'object' && error !== null ? (error as { type?: string }).type : undefined;
  const message =
    errorType === 'entity.parse.failed'
      ? 'Invalid JSON payload in request body.'
      : status === 500 && isProduction
        ? 'Internal server error. Please try again later.'
        : status === 500
          ? 'Unexpected server error.'
          : rawMessage;

  res.status(status).json({
    success: false,
    message,
  });
}
