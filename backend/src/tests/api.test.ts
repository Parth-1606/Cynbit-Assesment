/**
 * API tests for the Cynbit Discovery API.
 *
 * These tests exercise routing, validation, authentication and CORS behaviour
 * without requiring a running MongoDB instance: routes that need the database
 * are asserted to fail gracefully with 503.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { createApp } from '../app';
import { disconnectDatabase } from '../config/db';

let app: Express;

/** A payload that satisfies every validation rule. */
const validPayload = {
  customerName: 'Parth Pawar',
  name: 'Parth Pawar',
  email: 'parth@example.com',
  company: 'Acme Labs',
  businessObjective: 'Develop a web application',
  goal: 'Develop a web application',
  budget: '₹50,000–₹1,00,000',
  timeline: '1–3 months',
  projectDescription: 'We need a customer portal with authentication, billing and reporting.',
  description: 'We need a customer portal with authentication, billing and reporting.',
  selectedRequirements: {
    userRoles: 'Multi-role',
    dashboardRequirements: 'Advanced interactive dashboards',
    databaseRequirements: 'Document / NoSQL',
    thirdPartyIntegrations: ['Payment Gateway'],
  },
};

beforeAll(() => {
  app = createApp();
});

afterAll(async () => {
  await disconnectDatabase();
});

describe('GET /api/health', () => {
  it('returns 200 with a JSON status payload', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('database');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('GET /', () => {
  it('describes the available endpoints', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.endpoints).toContain('POST /api/projects');
  });
});

describe('POST /api/projects', () => {
  it('rejects an empty body with 400 and per-field errors', async () => {
    const res = await request(app).post('/api/projects').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.length).toBeGreaterThan(0);
    expect(res.body.errors.map((e: { field: string }) => e.field)).toContain('email');
  });

  it('rejects an invalid email address', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ ...validPayload, email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'email' })]),
    );
  });

  it('rejects values outside the known option lists', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ ...validPayload, businessObjective: 'Something made up', goal: 'Something made up' });
    expect(res.status).toBe(400);
  });

  it('rejects a description shorter than 20 characters', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ ...validPayload, projectDescription: 'too short', description: 'too short' });
    expect(res.status).toBe(400);
  });

  it('accepts a valid payload (503 when no database is configured)', async () => {
    const res = await request(app).post('/api/projects').send(validPayload);
    // 201 = stored successfully; 503 = valid but no database reachable in this environment.
    expect([201, 503]).toContain(res.status);
    expect(res.body).toHaveProperty('success');
  });
});

describe('GET /api/projects (admin)', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 with an incorrect token', async () => {
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', 'Bearer definitely-the-wrong-token');
    expect(res.status).toBe(401);
  });

  it('accepts a valid admin token (503 when no database is configured)', async () => {
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', 'Bearer test-admin-token');
    expect([200, 503]).toContain(res.status);
  });
});

describe('Unknown routes', () => {
  it('returns 404 with a JSON body', async () => {
    const res = await request(app).get('/not-a-real-endpoint');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('Malformed JSON', () => {
  it('returns 400 instead of crashing', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Content-Type', 'application/json')
      .send('{ bad json');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
