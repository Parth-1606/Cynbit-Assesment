# Cynbit Project Discovery Assistant

A complete, responsive **full-stack** web feature for Cynbit Technologies: a five-step
questionnaire that recommends the right Cynbit service using **transparent rule-based logic**
(not AI), generates a downloadable project brief, and stores the inquiry in MongoDB through a
REST API.

> **Assessment deliverable** — Full Stack Developer Intern technical assessment for Cynbit Technologies.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local setup](#local-setup)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Recommendation engine](#recommendation-engine)
- [Testing](#testing)
- [Deployment](#deployment) (Vercel · Render · MongoDB Atlas)
- [Git / commit messages](#git--commit-messages)
- [Troubleshooting](#troubleshooting)

---

## Features

**Frontend**

- Premium dark-navy SaaS interface with blue/purple accents, subtle animations, fully responsive
  (mobile hamburger menu, tablet and desktop layouts).
- Navbar with Cynbit branding, Hero, Services, **Project Discovery Assistant**, progress
  indicator, How-it-works and Footer sections.
- **5-step questionnaire** — goal (5 options), solution (7 options incl. *"Not sure yet"*),
  budget (6 ₹ bands), timeline (5 options), contact details.
- Per-step validation; **answers preserved** when navigating backwards/forwards.
- **Rule-based recommendation engine** — primary service, additional services, "why this
  service" reasons, suggested next steps, budget/timeline summary, match score.
- **Project brief generator** — structured document with a working **Copy** button and
  **Download as .txt**.
- Loading states, success/error toasts, empty states, restart button, accessible labels,
  smooth transitions, and an honest warning when the backend is unavailable
  (results are still shown — the engine never depends on the API).

**Backend**

- `POST /api/projects` — validates and stores inquiries.
- `GET /api/projects` — admin-protected listing (Bearer token, timing-safe comparison).
- `GET /api/health` — liveness/readiness with database state.
- Input validation (express-validator), centralised error handling, CORS allow-list,
  helmet, dotenv, correct HTTP status codes.
- **No secrets in the frontend** — the admin token and database URL never reach the bundle.

**Database**

- Mongoose `Project` schema: `name, email, company, goal, solution, budget, timeline,
  description, recommendation, createdAt` (+ `_id`), enum-validated option fields,
  index on `createdAt`.

---

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript (strict), Vite 7, Tailwind CSS 4, Lucide React |
| Backend | Node.js, Express 4, TypeScript, express-validator, helmet, cors, dotenv |
| Database | MongoDB, Mongoose 8 |
| Testing | Vitest, Supertest, PowerShell API smoke suite |
| Tooling | Git, npm workspaces-style `--prefix` scripts |

---

## Project structure

```
.
├── package.json                  # root scripts (build/test/typecheck both packages)
├── docs/
│   └── TECHNICAL_REPORT.md       # 13-section technical report
├── scripts/
│   └── api-smoke-test.ps1        # 13-check live API suite
├── frontend/                     # React SPA
│   ├── index.html
│   ├── vite.config.ts            # dev proxy: /api → http://localhost:5000
│   ├── .env.example
│   └── src/
│       ├── components/
│       │   ├── assistant/        # DiscoveryAssistant, ProgressIndicator,
│       │   │                      OptionCard, ContactStep, RecommendationResults
│       │   ├── layout/           # Navbar, Hero, Footer
│       │   ├── sections/         # ServicesSection, HowItWorks
│       │   └── ui/               # Toast, FormFields
│       ├── data/                 # questions.ts, services.ts
│       ├── lib/                  # recommendation.ts, brief.ts, api.ts, validation.ts
│       ├── types/                # shared interfaces
│       └── index.css             # Tailwind v4 @theme design tokens
└── backend/                      # Express API
    ├── .env.example
    ├── vitest.config.ts
    └── src/
        ├── config/               # env.ts, db.ts
        ├── constants/            # questionnaire option lists (mirror of frontend)
        ├── controllers/          # project.controller.ts
        ├── middleware/           # auth.ts, errorHandler.ts
        ├── models/               # Project.ts
        ├── routes/               # project.routes.ts, health.routes.ts
        ├── validation/           # project.validation.ts
        └── tests/                # api.test.ts (supertest)
```

---

## Prerequisites

- **Node.js ≥ 20** (developed on v26)
- **npm ≥ 10** (developed on 11)
- **MongoDB** — local instance, Docker (`mongo:7`), or MongoDB Atlas
- Git

> **Note for this environment:** Windows Application Control blocks native `.node` binaries on
> the assessment machine, so both `package.json` files contain an npm override
> `"rollup": "npm:@rollup/wasm-node@4.68.5"` that swaps Rollup's native binary for its official
> WASM build. Builds and tests work with it; do not remove it on a machine with the same policy.

---

## Local setup

```bash
# 1. Clone and install both packages
git clone <your-repo-url>
cd "cynbit assesment"
npm run install:all

# 2. Configure the backend
cd backend
cp .env.example .env
#    → fill MONGODB_URI and ADMIN_API_TOKEN (see below)
cd ..

# 3. Start the API (terminal 1, listens on :5000)
npm run dev:backend

# 4. Start the frontend (terminal 2, listens on :5173)
npm run dev:frontend
```

Open **http://localhost:5173**. The Vite dev proxy forwards `/api/*` to `http://localhost:5000`,
so no CORS configuration is needed locally.

### Using Docker for MongoDB

```bash
docker run -d --name cynbit-mongo -p 27017:27017 mongo:7
# MONGODB_URI=mongodb://127.0.0.1:27017/cynbit_discovery
```

### Running without a database

Leave `MONGODB_URI` empty: the API still boots, `GET /api/health` reports `"status": "degraded"`,
and writes/reads return **503** with a clear message. Useful for exercising validation and auth.

---

## Environment variables

### `backend/.env`

| Key | Required | Example | Purpose |
| --- | --- | --- | --- |
| `PORT` | no | `5000` | API port (Render injects its own) |
| `NODE_ENV` | no | `development` | `development` / `production` / `test` |
| `MONGODB_URI` | for writes | `mongodb+srv://USER:PASS@cluster0.xxxx.mongodb.net/cynbit_discovery?retryWrites=true&w=majority` | Mongo connection string |
| `CORS_ORIGIN` | in prod | `https://your-app.vercel.app` | Comma-separated allowed origins |
| `ADMIN_API_TOKEN` | for admin GET | *(32+ random bytes)* | Bearer token for `GET /api/projects` |

Generate a strong admin token:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

If `ADMIN_API_TOKEN` is empty, `GET /api/projects` returns **503** rather than being left open.

### `frontend/.env`

| Key | Example | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `https://cynbit-discovery-api.onrender.com` | Production API base URL. **Leave empty in development** — the dev proxy handles `/api`. |

Both `.env.example` files are committed. Actual `.env` files are git-ignored.
**No secret is embedded in the frontend bundle.**

---

## API reference

Base URL (local): `http://localhost:5000`

### `GET /api/health`

```json
{
  "success": true,
  "status": "ok",
  "message": "API and database are healthy.",
  "environment": "development",
  "database": "connected",
  "uptimeSeconds": 42,
  "timestamp": "2026-11-17T17:13:34.183Z"
}
```

`status` is `"degraded"` (HTTP 200) when the API is up but the database is not.

### `POST /api/projects`

Stores an inquiry. **201** on success.

```json
{
  "name": "Parth Pawar",
  "email": "parth@example.com",
  "company": "Acme Labs",
  "goal": "Build a new digital product",
  "solution": "Website / Web Application",
  "budget": "₹50,000–₹1,00,000",
  "timeline": "1–3 months",
  "description": "We need a customer portal with authentication, billing and reporting.",
  "recommendation": "Full Stack Development"
}
```

| Status | Meaning |
| --- | --- |
| `201` | Stored; response includes `data` with `id` and `createdAt` |
| `400` | Validation failed — `errors[]` lists `{field, message}` per problem |
| `403` | Origin not allowed by CORS |
| `503` | Database unavailable |

Validation rules: `name` 2–100 chars · `email` valid · `company` ≤ 150 (optional) ·
`goal`/`solution`/`budget`/`timeline` must match a known option exactly ·
`description` 20–2000 chars · `recommendation` ≤ 300 chars.

### `GET /api/projects`

Admin-only listing, newest first.

```http
GET /api/projects?limit=10
Authorization: Bearer <ADMIN_API_TOKEN>
```

| Status | Meaning |
| --- | --- |
| `200` | `{ "success": true, "count": n, "data": [...] }` |
| `401` | Missing or incorrect token |
| `503` | Token not configured, or database unavailable |

`limit` accepts 1–100 (default 50); non-numeric values fall back to the default.

### `GET /`

Returns the service name and endpoint catalogue.

---

## Recommendation engine

**Location:** `frontend/src/lib/recommendation.ts` — a pure, deterministic function.

```
score(service) = goalWeight (0–6) + solutionWeight (0–10) + budgetFit (0–3) + timelineFit (0–3)
```

- The highest scorer becomes the **primary recommendation**.
- Runner-ups scoring **≥ 50 %** of the primary become **additional services** (max 3).
- Reasons and next steps are generated from the winner's own sub-scores, so the explanation
  always matches the displayed match score.
- *"Not sure yet"* contributes nothing (the match leans on the business goal);
  *"Not decided"* budget and *"Flexible"* timeline are neutral.

**This is transparent rule-based logic — the UI explicitly states it is not AI**, because no
AI integration is implemented.

Documented mappings (covered by unit tests): website → Full Stack · automation → AI Automation ·
infrastructure → Cloud · visibility → Digital Marketing · mobile → Mobile App ·
custom tooling → Custom Software.

---

## Testing

```bash
# Type checking (both packages, strict)
npm run typecheck

# Unit + API tests — 12 backend, 28 frontend
npm test

# Production builds
npm run build

# Live API smoke suite (server must be running on :5000)
powershell -ExecutionPolicy Bypass -File scripts\api-smoke-test.ps1
```

**Actual results for this repository (2026-11-17):**

| Suite | Result |
| --- | --- |
| Backend typecheck | ✅ clean |
| Backend tests (vitest + supertest) | ✅ **12/12** |
| Backend build (`dist/index.js`) | ✅ |
| Frontend typecheck | ✅ clean |
| Frontend tests (vitest) | ✅ **28/28** |
| Frontend build (287.6 kB JS / 50.0 kB CSS) | ✅ |
| API smoke suite vs. live MongoDB 7 | ✅ **13/13** |
| CORS (allowed / disallowed / preflight) | ✅ 200 + header / 403 / 204 |
| Browser end-to-end walkthrough | ✅ full flow, validation, copy, download, backend-down, restart — zero console errors |

The smoke suite covers: health, four validation failures, a successful create, 401 on missing
and incorrect admin tokens, 200 with all schema fields present, limit fallback, 404, and
malformed JSON → 400.

---

## Deployment

> **Status: deployment-ready, not deployed.** No production deployment has been performed for
> this assessment.

### 1. MongoDB Atlas

1. Create a free M0 cluster → [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. **Database Access** → add a user with read/write to any database.
3. **Network Access** → allow your Render egress IPs (or `0.0.0.0/0` for testing).
4. **Connect → Drivers** → copy the string and substitute credentials:
   ```
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/cynbit_discovery?retryWrites=true&w=majority
   ```
5. Use it as `MONGODB_URI` on Render.

### 2. Backend on Render

| Setting | Value |
| --- | --- |
| Root directory | `backend` |
| Build command | `npm install && npm run build` |
| Start command | `npm start` |
| Health check path | `/api/health` |

Environment variables:

| Key | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Atlas connection string |
| `CORS_ORIGIN` | `https://your-app.vercel.app` |
| `ADMIN_API_TOKEN` | long random hex |
| `PORT` | injected by Render |

Verify: `GET https://<service>.onrender.com/api/health` → `"status": "ok"`.

### 3. Frontend on Vercel

| Setting | Value |
| --- | --- |
| Root directory | `frontend` |
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |

Environment variable:

| Key | Value |
| --- | --- |
| `VITE_API_BASE_URL` | `https://<your-render-service>.onrender.com` |

**Order matters:** deploy the frontend first, then add the Vercel URL to the backend's
`CORS_ORIGIN` and redeploy the backend — otherwise requests are rejected with **403**.

---

## Git / commit messages

The repository is organized into logical, commit-sized changes. Suggested messages
(no history is fabricated — apply them as you commit):

```
chore: initialize monorepo with root scripts, gitignore and env examples

feat(frontend): scaffold Vite + React + TypeScript + Tailwind design system

feat(frontend): build questionnaire flow, progress indicator and validation

feat(frontend): add rule-based recommendation engine and project brief generator

feat(frontend): add navbar, hero, services, how-it-works and footer sections

feat(backend): scaffold Express + TypeScript API with health endpoint

feat(backend): add project inquiry model, validation and REST routes

feat(database): integrate Mongoose schema with enums and createdAt index

feat(backend): add admin bearer-token authentication for inquiry listing

fix(backend): return 403 for disallowed CORS origins and 400 for malformed JSON

test: add backend API suite, frontend engine tests and API smoke script

docs: add technical report, README and environment variable examples
```

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `ECONNREFUSED` / 503 on submit | Start the backend (`npm run dev:backend`) — the UI still shows results with a warning banner |
| CORS 403 in production | Add your frontend URL to `CORS_ORIGIN` and redeploy the backend |
| `GET /api/projects` → 503 | Set `ADMIN_API_TOKEN` on the server |
| `GET /api/projects` → 401 | Send `Authorization: Bearer <token>` |
| Port already in use | Change `PORT` (backend) or stop the other process |
| Rollup native binary blocked (Windows App Control) | Keep the `"rollup": "npm:@rollup/wasm-node"` override in both `package.json` files |
| Vite proxy returns 502/500 | The backend is not running on `:5000` |

---

## License

Provided as an assessment submission for Cynbit Technologies.
