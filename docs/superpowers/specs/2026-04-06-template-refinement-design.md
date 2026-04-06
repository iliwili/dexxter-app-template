# Template Refinement Design

**Date:** 2026-04-06
**Status:** Approved

## Goal

Refine `dexxter-app-template` into a clean, reusable starting point for internal tooling apps. Stack is unchanged. Focus: generic naming, ESLint, optional integrations folder, and a developer onboarding guide.

---

## Stack (unchanged)

- **Frontend:** Nuxt 4 + Vue 3 + Tailwind CSS
- **Backend:** Node.js + Express
- **Infra:** Docker Compose, GitHub Actions CI/CD → GHCR → SSH deploy via Tailscale to VPS

---

## Changes

### 1. Generic naming

Replace all occurrences of `dexxter-app1` with `app-name` across:

- `backend/package.json` — `"name": "app-name-backend"`
- `docker-compose.yml` — image names
- `.github/workflows/deploy.yml` — image name env vars
- `README.md`

`app-name` is the find-and-replace token developers use when starting a new project.

### 2. Project structure changes

Move `backend/src/services/wordpressService.js` → `backend/src/integrations/wordpressService.js`.

Add `backend/src/services/.gitkeep` to keep the empty `services/` folder tracked — this is where project-specific business logic lives.

Final backend structure:

```
backend/src/
├── routes/index.js          # /health route only
├── controllers/.gitkeep
├── middleware/.gitkeep
├── services/.gitkeep
└── integrations/
    └── wordpressService.js  # optional — copy to services/ and adapt when needed
```

### 3. ESLint

**Backend** — flat config (`eslint.config.js`) using `@eslint/js`. Targets Node/CommonJS. Rules: no unused vars, no-console (warn), single quotes, semicolons required.

Script added to `backend/package.json`:
- `"lint": "eslint ."`
- `"lint:fix": "eslint . --fix"`

**Frontend** — uses `@nuxt/eslint` module (official Nuxt 4 integration). Handles Vue files, auto-imports, and TypeScript automatically. Added to `nuxt.config.ts` modules. Extends Nuxt defaults with consistent style rules matching the backend.

Script added to `frontend/package.json`:
- `"lint": "eslint ."`
- `"lint:fix": "eslint . --fix"`

### 4. SETUP.md (new)

A short guide at the project root for spinning up a new app from this template:

1. Clone the repo or use it as a GitHub template
2. Find-and-replace `app-name` across the project (list exact files)
3. Copy `.env.example` files and fill in values
4. Configure GitHub Actions secrets: `SSH_KEY`, `VPS_HOST`, `VPS_USER`, `TS_OAUTH_CLIENT_ID`, `TS_OAUTH_SECRET`
5. Push to `master` to trigger the first deploy

### 5. README.md fixes

- Correct ports: frontend → `3000`, backend → `8080` (currently swapped in README)
- Update project structure section to reflect `integrations/` folder
- Remove WordPress-specific env vars from the main table (documented in `wordpressService.js` comments instead)

---

## What is NOT changing

- No authentication (Tailscale handles access control)
- No example CRUD route — health/ping is sufficient as a pattern example
- No Prettier — ESLint handles formatting
- No additional composables or middleware beyond what exists

---

## Success criteria

- `app-name` is the only project-specific token — one find-and-replace starts a new project
- Both `backend` and `frontend` pass `npm run lint` with zero errors on a fresh clone
- `SETUP.md` is the only doc a developer needs to read to spin up a new app
- No dead code in the default template path (`wordpressService.js` is clearly optional)
