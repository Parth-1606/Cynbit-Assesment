/**
 * Express application factory.
 * Kept separate from `index.ts` so tests can import the app without
 * opening a database connection or binding a port.
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import projectRoutes from './routes/project.routes';
import healthRoutes from './routes/health.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export function createApp(): express.Express {
  const app = express();

  // Security headers + request body parsing.
  app.use(helmet());
  app.use(express.json({ limit: '100kb' }));

  // CORS: explicit allow-list from the environment (Vercel domain in production).
  app.use(
    cors({
      origin(origin, callback) {
        // No Origin header (curl, server-to-server) or an explicitly allowed origin.
        if (!origin || env.corsOrigins.length === 0 || env.corsOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        // Reject rather than crash: the browser blocks the request either way,
        // and a 403 is far more useful in logs than a 500.
        const error = new Error(`Origin ${origin} is not allowed by CORS`) as Error & {
          status?: number;
        };
        error.status = 403;
        callback(error);
      },
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // Request logging outside of tests.
  if (env.nodeEnv !== 'test') {
    app.use((req, _res, next) => {
      console.log(`[http] ${req.method} ${req.originalUrl}`);
      next();
    });
  }

  app.get('/', (_req, res) => {
    res.status(200).json({
      success: true,
      service: 'cynbit-discovery-api',
      message: 'Cynbit Project Discovery Assistant API',
      endpoints: ['GET /api/health', 'POST /api/projects', 'GET /api/projects'],
    });
  });

  app.use('/api/health', healthRoutes);
  app.use('/api/projects', projectRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
