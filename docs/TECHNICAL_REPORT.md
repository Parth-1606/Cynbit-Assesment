# Technical Report — Cynbit Project Discovery Assistant

**Prepared for:** Cynbit Technologies — Full Stack Developer Intern Assessment
**Stack:** React + TypeScript + Vite + Tailwind CSS (frontend) · Node.js + Express + TypeScript + MongoDB/Mongoose (backend)
**Report date:** 2026-11-17

---

## 1. Project Overview

The **Cynbit Project Discovery Assistant** is a full-stack web feature that helps prospective
customers identify which Cynbit service best matches their business requirements.

A visitor answers **five short questions** (business goal, solution type, budget, timeline and
contact details). A **transparent, rule-based recommendation engine** then scores Cynbit's six
service offerings, presents a **primary recommendation** plus **additional relevant services**,
explains *why* the match was made, lists concrete **next steps**, and generates a structured
**project brief** that can be copied to the clipboard or downloaded as a text file.

The inquiry is persisted through a REST API into MongoDB so the sales team can retrieve it later
through an admin-protected endpoint.

### Scope delivered

| Area | Delivered |
| --- | --- |
| Frontend | Navbar, Hero, Services, 5-step questionnaire with progress indicator, recommendation results, project summary, project brief generator, How-it-works, Footer |
| Backend | `POST /api/projects`, `GET /api/projects` (admin), `GET /api/health`, validation, CORS, error handling, dotenv |
| Database | Mongoose `Project` schema with the ten required fields |
| Quality | TypeScript strict mode, 40 automated unit/API tests, 13-check API smoke suite, browser end-to-end walkthrough |
| Docs | This report, comprehensive `README.md`, `.env.example` files, `.gitignore` files, suggested commit messages |

### Explicit design decision: no AI claims

The recommendation logic is a **deterministic scoring model implemented in plain TypeScript**.
It is described in the UI as *"transparent rule-based logic — not AI"* because no AI/LLM
integration is implemented. Claiming otherwise would be misleading.

---

## 2. Problem Statement

Cynbit offers a broad catalogue of services (full-stack web, mobile, AI automation, cloud,
digital marketing, custom software). A typical first-time visitor faces two problems:

1. **Choice paralysis.** Visitors do not know which service matches their problem, so they
   leave without contacting anyone — a lost lead.
2. **Friction in scoping.** When a visitor does reach out, the first conversation is spent
   discovering basics (goal, budget, timeline) that could have been captured up front.

Without a guided entry point, the website behaves as a brochure rather than a qualification
tool. Leads arrive unqualified, sales time is spent on discovery instead of proposals, and
visitors who are not yet sure what they need have no path forward.

---

## 3. Existing Website Improvement Opportunity

The current Cynbit website presents services as static content. The opportunity:

| Current state | Improvement opportunity |
| --- | --- |
| Visitor must self-select a service from a list | A guided questionnaire chooses for them |
| Contact form collects only raw details | Structured answers (goal/budget/timeline) qualify the lead automatically |
| No value exchange for filling a form | Visitor receives an instant, downloadable **project brief** |
| "Which service do I need?" questions hit the sales team | Rule-based matching answers them instantly and transparently |
| Leads are unstructured text | Every inquiry is stored with a consistent schema, ready for filtering/reporting |

**Business impact expected:** higher questionnaire completion → more qualified leads → shorter
sales cycles → better service discovery. The feature is positioned prominently (navbar CTA,
hero CTA, dedicated section) so it becomes the primary conversion path of the site.

---

## 4. Proposed Solution

```
┌──────────────────────────────┐       ┌───────────────────────────────┐
│  React SPA (Vite + Tailwind) │       │  Express REST API (TypeScript) │
│                              │       │                               │
│  5-step questionnaire        │ POST  │  /api/projects  (validate)     │
│  → rule-based engine         ├──────►│  /api/projects  (admin GET)    │
│  → results + project brief   │       │  /api/health                   │
│  → graceful degradation      │       │                               │
└──────────────────────────────┘       └──────────────┬────────────────┘
                                                      │ Mongoose
                                       ┌──────────────▼────────────────┐
                                       │  MongoDB (projects collection) │
                                       └───────────────────────────────┘
```

### Functional flow

1. **Step 1 — Goal** (5 options): what the business wants to achieve.
2. **Step 2 — Solution** (7 options, including *"Not sure yet"*): what they think they need.
3. **Step 3 — Budget** (6 bands in ₹, including *"Not decided"*).
4. **Step 4 — Timeline** (5 options, including *"Flexible"*).
5. **Step 5 — Contact**: name, email, company (optional), project description.

Each step validates before advancing; **answers are preserved** when navigating backwards or
forwards. On submit the engine computes the recommendation, the UI renders results
immediately, and the inquiry is sent to `POST /api/projects`.

### Key resilience property

> **The recommendation never depends on the API.** The engine runs entirely in the browser, so
> if the backend is unavailable the visitor still receives full results — with an honest
> warning banner explaining that the inquiry could not be saved. No false success states.

### Project brief generator

A structured plain-text document containing: customer information, business objective, required
services, budget & timeline, project description, recommended solution (with reasons and next
steps). Users can **Copy** it (with a legacy `execCommand` fallback when the async Clipboard
API is denied) or **Download** it as a `.txt` file. A `.txt` format was chosen deliberately to
avoid adding a PDF library for a feature that does not need one.

---

## 5. Technology Stack and Justification

### Frontend

| Technology | Why |
| --- | --- |
| **React 19** | Component model fits the reusable UI (OptionCard, FormFields, Toast); huge hiring/repair pool |
| **TypeScript (strict)** | Shared interfaces (`Answers`, `RecommendationResult`) eliminate whole classes of bugs |
| **Vite 7** | Near-instant HMR, first-class TS/ESM, trivial static build for Vercel |
| **Tailwind CSS v4** | CSS-first `@theme` tokens make the dark-navy design system explicit and maintainable; no runtime cost |
| **Lucide React** | Consistent, tree-shakeable icon set — only imported icons ship |

### Backend

| Technology | Why |
| --- | --- |
| **Node.js + Express 4** | Required stack; mature middleware ecosystem (cors, helmet, body-parser) |
| **TypeScript** | Same language as frontend; `InferSchemaType` gives typed documents for free |
| **express-validator** | Declarative, chainable validation that maps cleanly to structured 400 responses |
| **Mongoose 8** | Schema validation, enums mirroring the UI options, indexes, easy Atlas migration |
| **helmet** | Secure default HTTP headers with one line |
| **dotenv** | Secrets stay server-side; `.env.example` documents every variable |
| **vitest + supertest** | Fast in-process API tests without spinning up a server |

### Other

- **REST + JSON** — simple, cacheable, well understood.
- **Git** — logical, reviewable commit history (messages suggested in the README).
- **No unnecessary dependencies** — toasts, clipboard, validation and the engine are all
  hand-written; total runtime deps are React, Lucide, Express, CORS, Helmet, Mongoose,
  express-validator and dotenv.

---

## 6. System Architecture

### Monorepo layout

```
cynbit assesment/
├── package.json              # root scripts delegating with --prefix
├── .gitignore
├── docs/
│   └── TECHNICAL_REPORT.md   # this document
├── scripts/
│   └── api-smoke-test.ps1    # 13-check end-to-end API suite
├── frontend/                 # React SPA (Vite)
│   ├── index.html
│   ├── vite.config.ts        # dev proxy /api → localhost:5000
│   ├── .env.example          # VITE_API_BASE_URL
│   └── src/
│       ├── components/
│       │   ├── assistant/    # questionnaire, progress, results, brief
│       │   ├── layout/       # navbar, hero, footer
│       │   ├── sections/     # services, how-it-works
│       │   └── ui/           # toast, form fields
│       ├── data/             # questions, service catalogue
│       ├── lib/              # recommendation, brief, api, validation
│       ├── types/            # shared interfaces
│       └── index.css         # Tailwind v4 @theme design tokens
└── backend/                  # Express API
    ├── .env.example
    ├── vitest.config.ts
    └── src/
        ├── config/           # env, mongo connection
        ├── constants/        # questionnaire option lists (mirror of UI)
        ├── controllers/      # create/list handlers
        ├── middleware/       # admin auth, error handler
        ├── models/           # Mongoose Project schema
        ├── routes/           # project + health routers
        ├── validation/       # express-validator chains
        └── tests/            # supertest API suite
```

### Request lifecycle (POST /api/projects)

```
Browser → fetch(JSON) → [Vite dev proxy | CORS check] → helmet → express.json
        → express-validator chains → validationResult (400 on failure)
        → controller → Mongoose schema validation → MongoDB insert → 201 + record
```

### Architectural decisions

1. **App factory (`createApp()`)** separate from `index.ts`, so tests import the app without
   opening a database connection or binding a port.
2. **Graceful no-DB boot.** If `MONGODB_URI` is empty the API still starts; `/api/health`
   reports `degraded`, and writes/reads return **503** rather than hanging.
3. **Single source of option truth duplicated deliberately.** `frontend/src/data/questions.ts`
   and `backend/src/constants/questionnaire.ts` hold identical value strings; the backend
   validates with `isIn(...)`, so only values the UI can actually produce are persisted.
4. **Dev proxy vs production.** In development Vite proxies `/api` → `:5000` (no CORS needed);
   in production the frontend reads `VITE_API_BASE_URL` and CORS is restricted to the Vercel
   origin via `CORS_ORIGIN`.

---

## 7. Frontend Implementation

### Component architecture

| Component | Responsibility |
| --- | --- |
| `App` | Composes sections inside `ToastProvider`; includes skip link |
| `Navbar` | Sticky header, anchor links, hamburger menu with `aria-expanded`/`aria-controls` |
| `Hero` | Value proposition, CTAs, stat strip |
| `ServicesSection` | The six recommendable services |
| `DiscoveryAssistant` | **Orchestrator**: owns all state, validation, navigation, submission |
| `ProgressIndicator` | Desktop numbered steps + mobile `progressbar` |
| `OptionCard` | Real `<input type="radio">` (sr-only) inside a styled `<label>` |
| `ContactStep` | Presentational step-5 form |
| `RecommendationResults` | Results, summary, next steps, brief actions |
| `Toast` | Context-based notification system (success/error/info) |
| `FormFields` | Label/hint/error wiring via `aria-describedby` + `aria-invalid` |

Components are **small and mostly presentational**; state and side effects live in the
orchestrator, which keeps the flow easy to reason about and test.

### State model

```ts
interface Answers {
  goal: string | null;
  solution: string | null;
  budget: string | null;
  timeline: string | null;
  contact: { name: string; email: string; company: string; description: string };
}
```

A single `useState<Answers>` object means **answers survive back/forward navigation**
by construction — nothing is unmounted into oblivion. Validation errors are stored per field
and cleared as the user retypes.

### Validation (client side)

Mirrors the backend rules exactly: name 2–100 chars, RFC-ish email pattern, company ≤ 150
(optional), description 20–2000 chars. On failed submit the first `aria-invalid` field receives
focus. Errors are rendered with `role="alert"` so screen readers announce them.

### Design system

Tailwind v4 CSS-first `@theme` defines the palette (`navy-950 … navy-500`, blue/indigo/purple
accents), typography (Inter + Sora), and keyframe animations (`fade-up`, `scale-in`, `shimmer`).
Reusable classes (`.card`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.gradient-rule`)
keep markup clean. A `prefers-reduced-motion` block disables animations for users who ask for it,
and a global `:focus-visible` outline keeps keyboard navigation obvious.

### Accessibility

- Landmarks: `nav` / `main` / `footer`, single `h1`, skip link to the assistant.
- Every form control has a programmatically associated `<label>` (verified: 5/5 fields).
- Radio groups wrapped in `<fieldset>` with `<legend class="sr-only">`.
- Progress exposed via `role="progressbar"` + `aria-valuenow/min/max` and an `sr-only` summary.
- `aria-live="polite"` toast region; `role="status"` / `role="alert"` for banners.
- Focus is moved to the step heading after each navigation.

---

## 8. Backend Implementation

### Endpoints

| Method | Path | Auth | Success | Failure modes |
| --- | --- | --- | --- | --- |
| `GET` | `/api/health` | — | `200` `{status: ok\|degraded, database, uptimeSeconds, timestamp}` | — |
| `POST` | `/api/projects` | — | `201` `{success, message, data}` | `400` validation, `403` CORS, `503` no DB |
| `GET` | `/api/projects` | Bearer token | `200` `{success, count, data[]}` | `401` bad/missing token, `503` token unset or no DB |
| `GET` | `/` | — | `200` endpoint catalogue | — |
| *any* | unknown route | — | — | `404` JSON |

### Validation

`express-validator` chains in `validation/project.validation.ts`:

- `name` — required, trimmed, 2–100 chars.
- `email` — required, valid, normalised, ≤ 254 chars.
- `company` — optional (falsy allowed), ≤ 150 chars.
- `goal` / `solution` / `budget` / `timeline` — required **and** must be a member of the
  corresponding option list (`isIn`), so arbitrary strings can never be persisted.
- `description` — required, 20–2000 chars.
- `recommendation` — required, ≤ 300 chars.

Failures return a structured response:

```json
{ "success": false, "message": "Validation failed.",
  "errors": [ { "field": "email", "message": "Enter a valid email address" } ] }
```

### Admin authentication

`GET /api/projects` requires `Authorization: Bearer <ADMIN_API_TOKEN>`.

- Comparison uses Node's `crypto.timingSafeEqual` after a length check to avoid timing leaks.
- If `ADMIN_API_TOKEN` is not configured the route returns **503** (not an accidental open door).
- Missing/incorrect token → **401**.
- The token exists only in the backend environment; it is never sent to the browser bundle.

### Error handling

A single central `errorHandler`:

- body-parser errors carry their own `status`/`statusCode` → malformed JSON becomes **400**.
- Mongoose `ValidationError`/`CastError` → **400**; duplicate key (`code 11000`) → **409**.
- CORS rejection is raised as an error with `status = 403` (rather than an opaque 500).
- Anything else → **500**, with a generic message in production and no stack traces leaked.

### CORS

Explicit allow-list from `CORS_ORIGIN` (comma-separated). Requests with no `Origin`
(server-to-server, curl) pass; disallowed browser origins are rejected with **403**.
Allowed methods `GET, POST, OPTIONS`; allowed headers `Content-Type, Authorization`.

### Configuration (`backend/src/config/env.ts`)

Read once at startup: `PORT`, `NODE_ENV`, `MONGODB_URI`, `CORS_ORIGIN`, `ADMIN_API_TOKEN`.
Invalid ports fall back to `5000`; empty values are reported at boot rather than crashing.

---

## 9. Database Design

### Collection: `projects` (Mongoose model `Project`)

| Field | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `name` | String | required, 2–100, trimmed | customer full name |
| `email` | String | required, ≤ 254, lowercased | stored normalised |
| `company` | String | optional, ≤ 150, default `''` | not required by the brief |
| `goal` | String | required, **enum** (5 values) | mirrors step 1 |
| `solution` | String | required, **enum** (7 values) | mirrors step 2 |
| `budget` | String | required, **enum** (6 values) | mirrors step 3 (₹ bands) |
| `timeline` | String | required, **enum** (5 values) | mirrors step 4 |
| `description` | String | required, 20–2000, trimmed | free-text project brief |
| `recommendation` | String | required, ≤ 300 | primary service name |
| `createdAt` | Date | default `Date.now`, **immutable** | server-assigned |

- `_id` (ObjectId) is Mongoose's primary key; serialised as `id` in API responses.
- **Index:** `{ createdAt: -1 }` for the admin listing (newest first).
- `versionKey: false` — no `__v` noise in responses.
- Enum validation acts as a **second line of defence** behind express-validator, so even a
  direct database write cannot store an unknown option.

### Why these shapes

- Option fields are **strings, not references**: the option lists are small, change rarely and
  are validated by `isIn`; a lookup collection would add joins with no benefit at this scale.
- `description` is capped at 2000 chars to bound storage and payload size (`express.json`
  also caps bodies at 100 kB).
- `recommendation` is stored as a denormalised string so the admin list is readable without
  joining to a service catalogue.

---

## 10. Recommendation Algorithm

**Location:** `frontend/src/lib/recommendation.ts` — a pure, deterministic function
(`buildRecommendation(input) → RecommendationResult`), trivially unit-testable.

### Scoring model

```
score(service) = goalWeight + solutionWeight + budgetFit + timelineFit
```

| Signal | Range | Source | Rationale |
| --- | --- | --- | --- |
| `goalWeight` | 0–6 | Step 1 | Business intent is a strong but indirect signal |
| `solutionWeight` | 0–10 | Step 2 | *"I need X"* is the strongest explicit signal |
| `budgetFit` | 0–3 | Step 3 | Whether the band realistically funds the service |
| `timelineFit` | 0–3 | Step 4 | Whether the deadline is achievable |

Maximum possible score = **22**; the displayed match percentage is
`round(score / 22 × 100)` (minimum 5% when a service wins with 0 points).

### Weight tables (extract)

```ts
GOAL_WEIGHTS['Automate business operations'] = { 'ai-automation': 6, 'custom-software': 4, ... }
SOLUTION_WEIGHTS['Website / Web Application'] = { 'full-stack': 10, 'custom-software': 4 }
SOLUTION_WEIGHTS['Not sure yet']              = {}        // contributes nothing
BUDGET_FIT['Below ₹25,000']                   = { 'digital-marketing': 3, 'mobile-app': 0, ... }
TIMELINE_FIT['Within 2 weeks']                = { 'mobile-app': 0, 'digital-marketing': 3, ... }
```

Notable behaviours:

- **"Not sure yet"** contributes zero, so the match falls back to the business goal — the
  UI copy explicitly says so.
- **"Not decided"** budget and **"Flexible"** timeline are neutral (or slightly positive),
  so indecision never penalises the user.
- Tight deadlines penalise long-build services (a mobile app in 2 weeks scores 0 on
  timeline fit), producing an honest, defensible recommendation.

### Ranking and additional services

1. Score all six services; sort by score descending, then by catalogue order (stable,
   so identical input always yields identical output).
2. The top service is the **primary recommendation**.
3. Runner-ups whose score is **≥ 50 % of the primary score** become **additional services**,
   capped at **3**.
4. `reasons[]` and `nextSteps[]` are generated **from the winning service's own sub-scores**,
   so the explanation always matches the number the user sees.

### Documented example mappings (all covered by unit tests)

| User need | Recommended service |
| --- | --- |
| Website / web application requirements | Full Stack Development |
| Business automation | AI Automation |
| Infrastructure modernization | Cloud Solutions |
| Online visibility | Digital Marketing |
| Mobile application | Mobile App Development |
| Custom tooling | Custom Software Development |

### Transparency guarantee

Every contributing rule produces a human-readable sentence (e.g. *"Your budget of ₹50,000–₹1,00,000
comfortably covers a Mobile App Development engagement."*). Nothing is hidden behind a model —
and nowhere in the UI is the feature described as AI-powered.

---

## 11. Testing Approach

Four layers, all executed for this assessment. **Results below are actual outputs** from this
project's environment; nothing is projected or estimated.

### 11.1 Backend unit/API tests — **12/12 passing** (vitest + supertest)

`backend/src/tests/api.test.ts` exercises the app in-process (no server, no DB required):

- `GET /api/health` → 200 with status payload
- `GET /` → endpoint catalogue
- `POST` empty body → 400 with per-field errors
- `POST` invalid email → 400 `email`
- `POST` unknown goal value → 400 `goal`
- `POST` short description → 400 `description`
- `POST` valid payload → 201 (or 503 when no DB configured — asserted as an acceptable pair)
- `GET /api/projects` without token → 401
- `GET /api/projects` with wrong token → 401
- `GET /api/projects` with valid token → 200 (or 503 without a DB)
- Unknown route → 404 JSON
- Malformed JSON body → 400 (not a crash)

```
Test Files  1 passed (1)
     Tests  12 passed (12)
```

### 11.2 Frontend unit tests — **28/28 passing** (vitest)

- **Recommendation engine (16):** all six documented mappings; additional-services cap;
  primary never duplicated; ≥ 1 reason and ≥ 1 next step; determinism (identical input →
  identical output); match score bounds; "Not sure yet" handling; reasons quote the user's
  goal; next steps quote the budget; aggressive timelines score lower; mixed signals
  produce additional services.
- **Brief generator & validation (12):** all six brief sections present; customer details
  verbatim; budget/timeline/service included; download-safe slug; missing company handled;
  contact validation accepts/rejects correctly; email edge cases; min-length description;
  optional company; whitespace trimming.

```
Test Files  2 passed (2)
     Tests  28 passed (28)
```

### 11.3 API smoke suite — **13/13 passing** against a real MongoDB

`scripts/api-smoke-test.ps1` runs against a live server (`mongo:7` in Docker, database
`cynbit_discovery`):

```
--- Health ---
  PASS  GET /api/health -> 200
--- Validation ---
  PASS  POST empty body -> 400
  PASS  POST invalid email -> 400
  PASS  POST unknown goal -> 400
  PASS  POST short description -> 400
--- Create ---
  PASS  POST valid inquiry -> 201
--- Admin auth ---
  PASS  GET no token -> 401
  PASS  GET bad token -> 401
  PASS  GET with valid token -> 200
  PASS  all schema fields present
  PASS  GET bad limit falls back -> 200
--- Error handling ---
  PASS  Unknown route -> 404
  PASS  Malformed JSON -> 400

=== Results: 13 passed, 0 failed ===
```

**CORS checks (separate manual run):**

| Case | Result |
| --- | --- |
| Allowed origin `http://localhost:5173` | `200` + `Access-Control-Allow-Origin` echoed |
| Disallowed origin `https://evil.example.com` | `403` with JSON error |
| `OPTIONS` preflight | `204`, `Allow-Methods: GET,POST,OPTIONS`, `Allow-Headers: Content-Type,Authorization` |

### 11.4 Browser end-to-end walkthrough (automated Chromium)

| Scenario | Result |
| --- | --- |
| Page load | Zero console errors; landmarks `nav`/`main`/`footer`/single `h1`; skip link present |
| Full 5-step flow → results | ✅ reached *"We recommend Mobile App Development"* |
| Empty-form submit | ✅ 3 `aria-invalid` fields, 3 `role="alert"` messages, no submission |
| Errors clear while typing | ✅ `aria-invalid` count returns to 0 |
| Real POST through dev proxy | ✅ **HTTP 201**, record verified in MongoDB with `₹`/`–` UTF-8 intact |
| Copy project brief | ✅ button shows *"Copied!"*, success toast announced |
| Download project brief | ✅ `parth-pawar-mobile-app-development-2026-11-17.txt` (3 077 bytes), all 6 sections readable |
| Backend unavailable | ✅ results still shown + warning banner: *"We could not save your inquiry: The server is unavailable right now…"*, no false success |
| Restart questionnaire | ✅ back to step 1, answers cleared, info toast shown |
| Accessibility spot-check | ✅ 5/5 fields labelled, `hamburger` with `aria-expanded`/`aria-controls="mobile-menu"` |

### 11.5 Static checks

- `tsc --noEmit` clean on **both** packages (strict mode, `noUnusedLocals`, `noUnusedParameters`).
- Production builds succeed: frontend **287.6 kB JS / 50.0 kB CSS** (88.4 kB gzip JS),
  backend compiles to `dist/index.js`.

### 11.6 Known limitations of this testing

- Visual/screenshot review was not possible in this environment (the browser window was not
  visible to the automation layer), so layout QA relied on the accessibility tree and DOM
  inspection rather than pixel inspection.
- Mobile navigation was verified structurally (hamburger control, `#mobile-menu` with 5 links,
  desktop nav hidden below `md`) but not through viewport emulation, which the tooling does not
  provide.
- The Lighthouse audit was not run; no performance/accessibility *score* is claimed.

---

## 12. Deployment Instructions

> **Status: prepared, not deployed.** The steps below are the configuration this repository is
> ready for. No production deployment has been performed for this assessment.

### 12.1 Database — MongoDB Atlas

1. Create a free M0 cluster at <https://www.mongodb.com/atlas>.
2. **Database Access:** create a user with *Read and write to any database*.
3. **Network Access:** add `0.0.0.0/0` (or restrict to your Render egress IPs).
4. **Connect → Drivers:** copy the connection string and replace `<password>`:
   ```
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/cynbit_discovery?retryWrites=true&w=majority
   ```
5. This exact value becomes `MONGODB_URI` on Render.

### 12.2 Backend — Render

1. Push the repository to GitHub.
2. **New → Web Service**, select the repo, set **Root Directory** to `backend`.
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Environment variables:

   | Key | Value |
   | --- | --- |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | the Atlas connection string |
   | `CORS_ORIGIN` | `https://your-app.vercel.app` (comma-separate multiple) |
   | `ADMIN_API_TOKEN` | a long random value, e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
   | `PORT` | injected by Render automatically |

6. Health check path: `/api/health`.
7. Verify: `GET https://<service>.onrender.com/api/health` → `"status": "ok"`.

### 12.3 Frontend — Vercel

1. **New Project** → import the repo → set **Root Directory** to `frontend`.
2. Framework preset: **Vite**. Build: `npm run build`. Output: `dist`.
3. Environment variable:

   | Key | Value |
   | --- | --- |
   | `VITE_API_BASE_URL` | `https://<your-render-service>.onrender.com` |

   Leave it **empty in development** — the Vite dev proxy handles `/api` locally.
4. After the first deploy, add the Vercel URL to the backend's `CORS_ORIGIN`, or requests
   will be rejected with 403.
5. Set `VITE_API_BASE_URL` and redeploy whenever the backend URL changes.

### 12.4 Local development

```bash
npm run install:all

# Terminal 1 — API (defaults to :5000)
cd backend
cp .env.example .env      # fill MONGODB_URI + ADMIN_API_TOKEN
npm run dev

# Terminal 2 — frontend (:5173, proxies /api to :5000)
cd frontend
npm run dev
```

Without a database the API still boots (`/api/health` reports `degraded` and writes return
503) — useful for exercising validation and auth.

### 12.5 Build & verification commands

```bash
npm run typecheck     # both packages, strict TS
npm test              # 12 backend + 28 frontend tests
npm run build         # backend dist/ + frontend dist/
powershell -ExecutionPolicy Bypass -File scripts\api-smoke-test.ps1   # 13 live API checks
```

### 12.6 Environment variables (never committed)

| File | Variable | Purpose |
| --- | --- | --- |
| `backend/.env` | `PORT` | API port (default 5000) |
| | `NODE_ENV` | `development` / `production` / `test` |
| | `MONGODB_URI` | Atlas or local connection string |
| | `CORS_ORIGIN` | allowed frontend origins |
| | `ADMIN_API_TOKEN` | bearer token for `GET /api/projects` |
| `frontend/.env` | `VITE_API_BASE_URL` | production API base URL (empty = dev proxy) |

Both `.env.example` files are committed; actual `.env` files are git-ignored. **No secret is
present in the frontend bundle** — the admin token never leaves the server.

---

## 13. Future Improvements

**Product**

1. **Admin dashboard UI** — paginated table of inquiries with filtering by goal/budget/date,
   CSV export and status markers (new / contacted / proposal sent).
2. **Email follow-up** — send the generated brief to the customer and notify the sales team
   (e.g. via Resend/SendGrid) on successful submission.
3. **Multi-select solutions** — let users tick several solution types so "multiple needs"
   scoring (already supported by the engine) can be exercised directly.
4. **Editable brief** — let users tweak the generated brief before downloading, and persist
   the revision.
5. **Analytics** — track step drop-off to identify which questions hurt completion.

**Technical**

6. **Rate limiting** (`express-rate-limit`) and a CAPTCHA/honeypot on `POST /api/projects`
   to deter spam.
7. **Persist the engine server-side** so API clients and the website share one source of
   truth, plus a stored `matchScore` for reporting.
8. **E2E suite in CI** — Playwright scenarios replacing the manual browser walkthrough,
   running against a service container (`mongodb` service in GitHub Actions).
9. **Visual regression + Lighthouse CI** — enforce accessibility/performance budgets on
   every pull request (see §11.6 for why no score is claimed today).
10. **Refresh tokens / JWT** for admin access instead of a single static bearer token, with
    rotation and per-user audit logging.
11. **Indexes & reporting** — compound indexes (`goal`, `createdAt`) and an aggregation
    endpoint once inquiry volume grows.
12. **i18n** — externalise the questionnaire copy for regional markets.
13. **PDF export** — add a lightweight PDF path only if customers ask for it (the `.txt`
    format was chosen to avoid an unnecessary dependency).

---

*End of report. All test figures quoted in §11 were produced by running the commands in this
repository on 2026-11-17; no deployment has been performed.*
