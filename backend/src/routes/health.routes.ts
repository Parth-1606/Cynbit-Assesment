/**
 * GET /api/health - liveness/readiness probe used by Render and by the frontend
 * to show a friendly "backend unavailable" message.
 */
import { Router } from 'express';
import { getDatabaseState } from '../config/db';
import { env } from '../config/env';

const router = Router();

router.get('/', (_req, res) => {
  const database = getDatabaseState();

  res.status(200).json({
    success: true,
    status: database === 'connected' ? 'ok' : 'degraded',
    message:
      database === 'connected'
        ? 'API and database are healthy.'
        : 'API is running but the database is unavailable.',
    environment: env.nodeEnv,
    database,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

export default router;
