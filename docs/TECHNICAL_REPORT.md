# Technical Report — Cynbit Smart Project Discovery & Cost Estimator

**Prepared for:** Cynbit Technologies — Full Stack Developer Intern Assessment  
**Project:** Cynbit Smart Project Discovery & Cost Estimator (Standalone Prototype)  
**Stack:** React 19 + TypeScript + Vite 7 + Tailwind CSS 4 + React Router + React Hook Form + Zod + jsPDF (Frontend)  
**Backend:** Node.js + Express 4 + TypeScript + Mongoose 8 + MongoDB  
**Author:** Full Stack Developer Candidate  
**Date:** November 2026  

---

## 1. Problem Statement

Technology consultancy and engineering service firms like Cynbit Technologies offer a wide spectrum of software solutions—including web platforms, custom web applications, native and cross-platform mobile apps, AI automation, cloud architecture, and performance marketing. However, prospective clients arriving at the website often face significant friction:

1. **Service Ambiguity & Decision Fatigue:** Non-technical founders and business stakeholders often do not know whether their idea requires a lightweight website, a full-stack SaaS application, or specialized cloud infrastructure.
2. **Opaque Cost & Timeline Expectations:** Visitors want an immediate sense of realistic budget and delivery duration before committing to sales calls. When pricing is completely obscured, bounce rates rise.
3. **Unqualified & Unstructured Lead Intake:** Generic "Contact Us" forms yield unstructured inquiries lacking critical parameters like user roles, database scaling needs, integrations, or budget bands. Engineering leads spend preliminary meetings gathering basic requirements instead of discussing tailored architecture solutions.

---

## 2. Proposed Improvement

The **Cynbit Smart Project Discovery & Cost Estimator** transforms the passive marketing website into an active, interactive qualification and scoping engine:

- **Interactive 5-Step Guided Scoping:** Leads visitors through business intent, dynamic requirements, budget bands in INR, timelines, and contact information.
- **Deterministic Recommendation Engine:** Recommends the exact Cynbit engineering service matching the business objective with clear justification.
- **Rule-Based Cost & Duration Estimation:** Transparently computes realistic, indicative INR budget ranges and delivery timelines based on objective scale, user roles, integrations, and operational complexity.
- **Budget Conflict Transparency:** If a user's stated budget does not align with their requested technical scope, the system transparently advises them on MVP phasing rather than silently altering values.
- **Executive PDF Project Brief Generation:** Generates a downloadable, professionally formatted PDF brief with document reference codes, technical breakdown, and recommended next steps.
- **API & MongoDB Persistence:** Inquiries and calculated estimates are validated and stored in MongoDB through an Express REST API.

---

## 3. Project Objectives

- Provide a standalone, production-ready prototype demonstrating a high-impact improvement to the Cynbit digital ecosystem.
- Implement a 100% deterministic, transparent calculation engine without arbitrary or random outputs.
- Build clean, accessible, modern UI aligned with a navy, blue, and white corporate technology aesthetic.
- Implement strict client and server-side validation using Zod and express-validator.
- Provide full support for offline/disconnected database states with proper HTTP status codes (503 Service Unavailable).

---

## 4. Technology Choices

| Layer | Technology | Rationale |
| --- | --- | --- |
| **Frontend Framework** | React 19 + Vite 7 | Fast HMR, lightweight bundle size, modern component primitives. |
| **Language** | TypeScript (Strict) | End-to-end type safety, eliminating runtime null/undefined errors across forms and estimation calculations. |
| **Routing** | React Router 7 | Client-side routing separating Landing (`/`), Wizard (`/wizard`), and Results (`/results`). |
| **Styling** | Tailwind CSS 4 | CSS-first `@theme` token management, responsive utility classes, and glassmorphism styling. |
| **Form Management** | React Hook Form + Zod | Controlled and performant form handling with declarative schema-based validation. |
| **PDF Generation** | jsPDF | Lightweight, client-side PDF document generation formatted with Cynbit header branding and structured tables. |
| **Backend Runtime** | Node.js + Express 4 | Fast, unopinionated REST API service written in TypeScript. |
| **Database** | MongoDB + Mongoose 8 | Flexible document storage schema supporting rich nested requirement objects and fast indexing. |
| **Security & Middleware** | Helmet + CORS + Dotenv | HTTP security headers, CORS origin restriction, and environment secret protection. |
| **Testing** | Vitest + Supertest | Unit testing for estimation engines and end-to-end HTTP integration tests for API routes. |

---

## 5. Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT (React 19)                     │
│  - LandingPage (/)                                          │
│  - WizardPage (/wizard): 5-step questionnaire               │
│  - ResultsPage (/results): estimates, PDF brief, submission │
│  - ProjectDiscoveryContext: session persistence & state     │
│  - EstimationEngine & jsPDF Brief Generator                 │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON / HTTP REST
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Express + TS)                   │
│  - Routes: GET /api/health, POST /api/projects              │
│  - Middleware: CORS, Helmet, express-validator, error-handler│
│  - EstimationService: Server-side estimation verification   │
│  - Mongoose Model: Project (persisted in MongoDB)           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE (MongoDB)                      │
│  - Collection: projects                                     │
│  - Schema: customerName, email, objective, requirements,    │
│            budget, timeline, recommendation, estimates, date│
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Implementation Details

### Frontend Pages
1. **Landing Page (`/`):**
   - Hero: "Let's Build Something Amazing."
   - Primary CTA: "Discover Your Solution" (routes to `/wizard`).
   - Secondary CTA: "How It Works" (smooth scroll).
   - Three feature cards: Smart Service Recommendation, Project Cost Estimation, Instant Project Brief.
   - 4-step process explanation cards.
   - Branded Cynbit header and footer.

2. **Project Discovery Wizard (`/wizard`):**
   - **Step 1 (Business Objective):** 7 core options (Website, Web application, Mobile application, Business automation, AI solutions, Cloud infrastructure, Digital marketing).
   - **Step 2 (Project Requirements):** Dynamic inputs customized per objective (page volume, auth, payments, user roles, dashboard complexity, database models, third-party integrations, AI capabilities, cloud scope, and marketing channels).
   - **Step 3 (Budget):** 6 INR budget tiers (Below ₹25,000 up to Above ₹5,00,000 and Not decided).
   - **Step 4 (Timeline):** 5 timeline ranges (1–2 weeks to Flexible).
   - **Step 5 (Contact Details):** Full name, email, company, and project description with Zod validation.
   - Stepper progress bar with step preservation across back/forward navigation.

3. **Results Page (`/results`):**
   - Personalized greeting (`Hello, [Full Name]`).
   - Recommended Cynbit service card with complexity tier (Low, Moderate, High, Enterprise).
   - Narrative "Why this service is recommended" justification.
   - Indicative Budget Range (INR formatted: `₹X,XX,XXX – ₹Y,YY,YYY`) and Estimated Duration (`X–Y weeks`).
   - Budget alignment advisory (if stated budget conflicts with technical requirements).
   - Working buttons:
     - **Download PDF Project Brief:** Uses `jsPDF` to download `Cynbit_Project_Brief_[Name].pdf`.
     - **Copy Project Summary:** Copies text summary to clipboard with toast notification.
     - **Edit Requirements:** Returns to Step 2 with state preserved.
     - **Submit Inquiry:** Sends payload to `POST /api/projects`, showing loading and success confirmation.
     - **Start Again:** Resets questionnaire state.

---

## 7. Recommendation Algorithm

The recommendation engine strictly maps business objectives to Cynbit's core technical service departments:

| Selected Business Objective | Recommended Cynbit Service |
| --- | --- |
| Build a website | **Web Development** |
| Develop a web application | **Full Stack Development** |
| Develop a mobile application | **Mobile App Development** |
| Automate business operations | **AI Automation** |
| Implement AI solutions | **AI Development** |
| Improve cloud infrastructure | **Cloud Solutions** |
| Improve digital marketing | **Digital Marketing** |

Each recommendation generates a tailored justification explaining why that technical competency is ideal for the client's goals.

---

## 8. Estimation Methodology

The estimation model is deterministic, modular, and configurable (`backend/src/utils/estimationRules.ts` and `frontend/src/utils/estimationEngine.ts`).

### Calculation Factors
1. **Base Category Cost & Time:** Every objective establishes a realistic starting foundation (e.g., Website: ₹25,000–₹45,000; Web Application: ₹65,000–₹1,10,000; Mobile App: ₹80,000–₹1,35,000).
2. **Feature Additions:**
   - Website page tiers: +₹15,000 to +₹35,000.
   - Authentication (OAuth/RBAC): +₹10,000 to +₹30,000 (+1 to 2 weeks).
   - Payment Gateways: +₹15,000 to +₹25,000 (+1 week).
   - Admin Dashboards & Reporting: +₹20,000 to +₹35,000 (+1 to 2 weeks).
   - Third-Party Integrations: +₹12,000 to +₹22,000 per integration.
   - Multi-platform mobile targets: +₹45,000 to +₹75,000 (+2 to 3 weeks).
   - AI automation workflows & document processing: +₹22,000 to +₹38,000 per module.
   - Cloud migrations & CI/CD automation: +₹20,000 to +₹35,000 per area.
3. **Complexity Classification:**
   - **Low Complexity:** Total estimate < ₹60,000.
   - **Moderate Complexity:** ₹60,000 to ₹1,50,000.
   - **High Complexity:** ₹1,50,000 to ₹3,00,000.
   - **Enterprise Scale:** Above ₹3,00,000 or 8+ major architectural modules.
4. **INR Currency Formatting:** All monetary values format according to Indian standards via `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`.
5. **Transparent Budget Conflict Detection:** If the client's stated budget is below the minimum realistic threshold for the configured scope (e.g., Selecting "Below ₹25,000" while requesting a multi-role web application with payments and dashboards estimated at ₹1,10,000+), the system alerts the user:
   > *"Your selected budget is 'Below ₹25,000', while the indicative estimate for this scope is ₹... Cynbit can phase your deliverables (starting with a core MVP) or refine feature scope to align with your target budget."*

---

## 9. Database Design

### Mongoose Project Model (`backend/src/models/Project.ts`)

| Field | Type | Description |
| --- | --- | --- |
| `customerName` | String (Required) | Client full name (indexed, min 2 chars). |
| `email` | String (Required) | Normalized lowercase work email. |
| `company` | String (Optional) | Client organization or business name. |
| `businessObjective` | String (Enum) | One of the 7 official business objectives. |
| `projectType` | String (Required) | Recommended service type. |
| `selectedRequirements` | Mixed / Object | Detailed dynamic requirements map. |
| `budget` | String (Enum) | Selected INR budget range. |
| `timeline` | String (Enum) | Selected timeline tier. |
| `projectDescription` | String (Required) | Narrative description (min 20 chars). |
| `recommendation` | String (Required) | Recommended service title. |
| `estimatedBudget` | String (Required) | Indicative calculated INR range. |
| `estimatedDuration` | String (Required) | Calculated delivery duration in weeks. |
| `createdDate` | Date (Default Now) | Submission timestamp (indexed descending). |

Aliases (`name`, `goal`, `solution`, `description`, `createdAt`) are supported via Mongoose pre-validate middleware hooks to ensure backward compatibility.

---

## 10. Testing & Verification

### Test Execution Results (Actual, Verified Runs)

1. **Backend Test Suite (`npm run test --prefix backend`):**
   - `src/tests/estimation.test.ts`: 4 passed (100% coverage of all 7 objectives, dynamic calculations, complexity metrics, budget conflict alerts).
   - `src/tests/api.test.ts`: 12 passed (Health checks, root metadata, empty payload 400 rejection, invalid email rejection, enum boundary checks, short description rejection, 503 database disconnected fallback, admin auth checks, 404 handler, malformed JSON handler).
   - **Total Backend Tests: 16 passed, 0 failed.**

2. **Frontend Test Suite (`npm run test --prefix frontend`):**
   - `src/utils/estimationEngine.test.ts`: 4 passed (INR formatting, objective mappings, feature scoping, conflict detection).
   - `src/lib/brief.test.ts`: 12 passed.
   - `src/lib/recommendation.test.ts`: 16 passed.
   - **Total Frontend Tests: 32 passed, 0 failed.**

3. **TypeScript Typecheck (`npm run typecheck`):**
   - Both `backend` (`tsc -p tsconfig.test.json --noEmit`) and `frontend` (`tsc --noEmit`) compiled with **0 errors**.

4. **Production Build (`npm run build`):**
   - Both backend and frontend production builds completed cleanly.

---

## 11. Limitations

1. **Indicative Nature of Estimates:** The calculator provides deterministic baseline figures based on standard complexity metrics. Custom proprietary protocols or specialized legacy integrations may require individualized technical scoping.
2. **Database Dependency for Persistence:** While estimates, questionnaires, summary copying, and PDF generation function entirely client-side without an active database, inquiry storage requires an active MongoDB connection. When disconnected, the API gracefully returns HTTP 503.

---

## 12. Future Scope

1. **Interactive Architecture Diagram Export:** Allowing users to download an auto-generated visual architecture topology diagram alongside their PDF brief.
2. **Calendar Scheduling Integration:** Providing direct Calendly / Google Calendar booking integration directly from the Results page to schedule discovery calls with Cynbit architects.
3. **Multi-Currency Toggle:** Adding support for USD / EUR / GBP conversion alongside INR.
