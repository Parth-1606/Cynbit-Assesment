# Cynbit Smart Project Discovery & Cost Estimator

A modern, responsive **full-stack web application** built for **Cynbit Technologies** as an engineering enhancement to their official website. The tool helps prospective customers identify the optimal technology service, configure detailed technical requirements, receive an instant deterministic budget and timeline estimate in INR, download a branded PDF project brief, and submit their inquiry directly to MongoDB through a REST API.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Local Installation & Development](#local-installation--development)
- [Environment Variables](#environment-variables)
- [MongoDB Configuration](#mongodb-configuration)
- [API Documentation](#api-documentation)
- [Recommendation & Estimation Logic](#recommendation--estimation-logic)
- [Testing & Quality Verification](#testing--quality-verification)
- [Deployment Instructions](#deployment-instructions)

---

## Overview

Prospective clients seeking technology partners often struggle to assess what service architecture they need, how much their project will cost, or how long development will take. 

The **Cynbit Smart Project Discovery & Cost Estimator** solves this problem by providing:
1. **Guided Scoping:** A 5-step questionnaire matching objectives (Web, Web App, Mobile, AI Automation, AI Solutions, Cloud Infrastructure, Digital Marketing) to dynamic requirements.
2. **Deterministic Estimation:** Real-time calculation of indicative INR budget ranges and delivery durations using configurable rules without arbitrary values.
3. **Budget Conflict Transparency:** Proactive advisories if the client's stated budget does not align with the requested technical scope.
4. **Professional PDF Briefs:** Client-side generation of an executive PDF project brief using `jsPDF`.
5. **Secure Persistence:** Server-side validation and storage in MongoDB with graceful offline degradation.

---

## Key Features

### Frontend (React 19, TypeScript, Tailwind CSS, React Router)
- **Landing Page (`/`):** Hero ("Let's Build Something Amazing"), CTAs ("Discover Your Solution" / "How It Works"), 3 feature cards, and 4-step process breakdown.
- **5-Step Discovery Wizard (`/wizard`):**
  - **Step 1 — Business Objective:** Website, Web Application, Mobile App, AI Automation, AI Solutions, Cloud, Digital Marketing.
  - **Step 2 — Project Requirements:** Dynamic questions customized to the selected objective (e.g., page volume, auth, payment gateways, user roles, dashboards, database requirements, third-party integrations, AI capabilities, cloud scope, growth channels).
  - **Step 3 — Target Budget:** 6 INR budget tiers.
  - **Step 4 — Delivery Timeline:** 5 timeline tiers.
  - **Step 5 — Contact Information:** Full name, email, company, and project description with **React Hook Form + Zod** schema validation.
  - Progress indicator, step navigation, and answer preservation across back/forward navigation.
- **Results Page (`/results`):**
  - Personalized greeting.
  - Recommended Cynbit service and "Why this service is recommended" justification.
  - Project complexity classification (Low, Moderate, High, Enterprise).
  - Indicative budget range in INR and estimated duration in weeks.
  - Transparent budget conflict alert if stated budget is lower than requirements.
  - Selected requirements summary and next steps.
  - **5 Working Action Buttons:**
    - `Download PDF Project Brief`: Generates formatted PDF file.
    - `Copy Project Summary`: Copies formatted text to clipboard with toast notification.
    - `Edit Requirements`: Navigates back to the wizard with answers preserved.
    - `Submit Inquiry`: Submits inquiry to Express API and stores in MongoDB.
    - `Start Again`: Clears state and restarts the questionnaire.

### Backend (Node.js, Express, TypeScript, Mongoose)
- `POST /api/projects`: Accepts inquiries, validates fields, verifies/calculates estimates on the server, and stores records in MongoDB.
- `GET /api/health`: Provides API status and database connection state (`connected` vs `disconnected`).
- `GET /api/projects`: Admin endpoint with Bearer token authentication to review submissions.
- Strict input sanitization, centralized error handling, and CORS allow-listing.
- Offline-safe database handling returning HTTP `503 Service Unavailable` if MongoDB is disconnected.

---

## Technology Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 19, TypeScript (Strict), Vite 7, Tailwind CSS 4, React Router 7, React Hook Form, Zod, jsPDF, Lucide React |
| **Backend** | Node.js, Express 4, TypeScript, Mongoose 8, express-validator, Helmet, CORS, Dotenv |
| **Database** | MongoDB (Local or MongoDB Atlas) |
| **Testing** | Vitest, Supertest |

---

## Project Structure

```
cynbit-project-discovery/
├── package.json              # Monorepo scripts (build/test/typecheck)
├── .env.example              # Root environment template
├── docs/
│   └── TECHNICAL_REPORT.md   # Comprehensive technical assessment report
├── backend/
│   ├── src/
│   │   ├── config/           # Database (db.ts) and env (env.ts)
│   │   ├── constants/        # Questionnaire enums & options
│   │   ├── controllers/      # Project inquiry & admin controllers
│   │   ├── middleware/       # Auth (admin token) & error handling
│   │   ├── models/           # Mongoose Project schema
│   │   ├── routes/           # REST endpoints (/api/projects, /api/health)
│   │   ├── services/         # Server-side estimation service
│   │   ├── utils/            # Configurable estimation rules
│   │   ├── validation/       # Request validation chains
│   │   ├── tests/            # Vitest unit & API integration tests
│   │   ├── app.ts            # Express application factory
│   │   └── index.ts          # Server entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Layout (Navbar, Footer) and UI (Toast)
│   │   ├── context/          # ProjectDiscoveryContext (state preservation)
│   │   ├── hooks/            # useProjectDiscovery custom hook
│   │   ├── pages/            # LandingPage, WizardPage, ResultsPage
│   │   ├── services/         # API client & jsPDF brief generator
│   │   ├── utils/            # Client-side estimation engine & formatters
│   │   ├── types/            # TypeScript interfaces & types
│   │   ├── App.tsx           # React Router configuration
│   │   ├── main.tsx          # React application root
│   │   └── index.css         # Tailwind CSS design tokens
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
```

---

## Local Installation & Development

### 1. Prerequisites
- **Node.js**: v20 or higher
- **npm**: v10 or higher
- **MongoDB**: Local MongoDB instance or free MongoDB Atlas URI

### 2. Clone and Install Dependencies
```bash
# Clone the repository
git clone <repository-url>
cd "cynbit assesment"

# Install all dependencies for both backend and frontend
npm run install:all
```

### 3. Configure Environment Variables
Copy `.env.example` in both `backend` and `frontend`:
```bash
# Backend configuration
cp backend/.env.example backend/.env

# Frontend configuration (optional in dev, Vite proxies /api to port 5000)
cp frontend/.env.example frontend/.env
```

### 4. Run the Development Servers
In two separate terminals:

```bash
# Terminal 1 — Start the Backend API (runs on http://localhost:5000)
npm run dev:backend

# Terminal 2 — Start the Frontend SPA (runs on http://localhost:5173)
npm run dev:frontend
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Port the Express server listens on | `5000` |
| `NODE_ENV` | Environment mode (`development` / `production`) | `development` |
| `MONGODB_URI` | Connection URI for MongoDB | *(empty for offline testing)* |
| `CORS_ORIGIN` | Comma-separated allowed frontend origins | `http://localhost:5173` |
| `ADMIN_API_TOKEN` | Bearer token protecting `GET /api/projects` | `dev-admin-secret-change-in-production` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_URL` | Production Backend API URL | *(empty in dev; uses Vite proxy)* |

---

## MongoDB Configuration

The application works both with and without a live MongoDB connection:

1. **MongoDB Atlas (Cloud Production):**
   - Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - In Database Access, add a user with read/write privileges.
   - In Network Access, allow access from your deployment IP (or `0.0.0.0/0` for cloud services like Render).
   - Copy the SRV string and set `MONGODB_URI` in `backend/.env`:
     ```env
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cynbit_discovery?retryWrites=true&w=majority
     ```

2. **Local MongoDB:**
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/cynbit_discovery
   ```

3. **Graceful Disconnected Mode:**
   - If `MONGODB_URI` is left blank or the database is unreachable, `GET /api/health` indicates `database: "disconnected"`.
   - `POST /api/projects` cleanly responds with HTTP `503 Service Unavailable` explaining that the database is offline.
   - The frontend clearly informs the user while still displaying the full calculated estimate and allowing PDF downloads.

---

## API Documentation

### 1. `GET /api/health`
Checks API liveness and database connection status.
- **Response `200 OK`:**
  ```json
  {
    "status": "ok",
    "uptime": 12.34,
    "timestamp": "2026-11-18T21:40:00.000Z",
    "database": "connected"
  }
  ```

### 2. `POST /api/projects`
Validates and persists a project inquiry while calculating/verifying estimates.
- **Request Body:**
  ```json
  {
    "customerName": "Parth Pawar",
    "email": "parth@example.com",
    "company": "Acme Labs",
    "businessObjective": "Develop a web application",
    "selectedRequirements": {
      "userRoles": "Multi-role",
      "dashboardRequirements": "Advanced interactive dashboards",
      "databaseRequirements": "Document / NoSQL",
      "thirdPartyIntegrations": ["Payment Gateway"]
    },
    "budget": "₹50,000–₹1,00,000",
    "timeline": "1–3 months",
    "projectDescription": "Need a customer portal with authentication, billing and interactive analytics."
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "message": "Project inquiry received successfully.",
    "data": {
      "id": "673b50c37c3527cb6b91fa01",
      "customerName": "Parth Pawar",
      "email": "parth@example.com",
      "recommendation": "Full Stack Development",
      "estimatedBudget": "₹1,12,000 – ₹1,92,000",
      "estimatedDuration": "6–9 weeks",
      "createdDate": "2026-11-18T21:40:00.000Z"
    },
    "estimates": {
      "recommendedService": "Full Stack Development",
      "projectComplexity": "High",
      "estimatedBudget": "₹1,12,000 – ₹1,92,000",
      "estimatedDuration": "6–9 weeks"
    }
  }
  ```

### 3. `GET /api/projects` (Admin Only)
Retrieves submitted inquiries (newest first). Requires `Authorization: Bearer <ADMIN_API_TOKEN>`.

---

## Recommendation & Estimation Logic

The deterministic estimation rules are located in:
- Backend: `backend/src/utils/estimationRules.ts`
- Frontend: `frontend/src/utils/estimationEngine.ts`

### Service Mappings:
- Website → **Web Development**
- Web application → **Full Stack Development**
- Mobile application → **Mobile App Development**
- Business automation → **AI Automation**
- AI solutions → **AI Development**
- Cloud infrastructure → **Cloud Solutions**
- Digital marketing → **Digital Marketing**

### Calculation Rules:
- **Base Costs & Durations:** Realistic baseline figures for each category.
- **Feature Increments:** Incremental cost and duration added for page volume, authentication, payment gateways, RBAC, interactive dashboards, cloud migrations, and marketing channels.
- **Complexity Assessment:** Automatically labeled as *Low*, *Moderate*, *High*, or *Enterprise* based on scope points and cost thresholds.
- **INR Formatting:** Formatted via Indian numbering conventions (e.g., `₹1,50,000`).
- **Conflict Handling:** Proactive advice if the user's budget is lower than the required scope without silently modifying their input.

---

## Testing & Quality Verification

Run all test suites across the monorepo:

```bash
# Typecheck both projects
npm run typecheck

# Run backend tests (16 tests)
npm run test --prefix backend

# Run frontend tests (32 tests)
npm run test --prefix frontend

# Build production bundles
npm run build
```

**Verified Test Results:**
- **Backend Tests:** 16 passed (100% success).
- **Frontend Tests:** 32 passed (100% success).
- **Total:** 48 passing tests.
- **TypeScript:** 0 compilation errors in strict mode.

---

## Deployment Instructions

### 1. Frontend Deployment on Vercel
1. Push this repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Set **Root Directory** to `frontend`.
4. Framework Preset will auto-detect as **Vite**.
5. In **Environment Variables**, add:
   - `VITE_API_URL`: Your deployed Render API URL (e.g. `https://cynbit-discovery-api.onrender.com`).
6. Click **Deploy**.

### 2. Backend Deployment on Render
1. Sign in to [Render](https://render.com) and click **"New +" → "Web Service"**.
2. Connect your repository.
3. Configure settings:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
4. In **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or leave default)
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `CORS_ORIGIN`: Your Vercel frontend URL (e.g. `https://cynbit-discovery.vercel.app`).
   - `ADMIN_API_TOKEN`: A secure random secret string.
5. Click **Create Web Service**.
