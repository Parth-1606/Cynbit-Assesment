/**
 * Simple admin authentication for GET /api/projects.
 * The client sends `Authorization: Bearer <ADMIN_API_TOKEN>`.
 */
import type { NextFunction, Request, Response } from 'express';
import { timingSafeEqual } from 'crypto';
import { env } from '../config/env';

function safeCompare(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!env.adminToken) {
    res.status(503).json({
      success: false,
      message: 'Admin access is not configured. Set ADMIN_API_TOKEN on the server.',
    });
    return;
  }

  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token || !safeCompare(token, env.adminToken)) {
    res.status(401).json({
      success: false,
      message: 'Invalid or missing admin token.',
    });
    return;
  }

  next();
}
