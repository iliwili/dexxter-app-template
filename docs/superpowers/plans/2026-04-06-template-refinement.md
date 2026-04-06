# Template Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine `dexxter-app-template` into a clean, reusable starting point for internal tooling apps — generic naming, ESLint on both sides, optional integrations folder, developer onboarding guide, and consistent port config.

**Architecture:** Minimal changes to existing structure. No new runtime dependencies. ESLint added as dev tooling only. `wordpressService.js` relocated to `integrations/` to signal it is optional. A single `SETUP.md` document guides developers through spinning up a new project.

**Tech Stack:** Node.js + Express (backend), Nuxt 4 + Vue 3 + Tailwind CSS (frontend), ESLint 9 flat config (backend), `@nuxt/eslint` module (frontend), Docker Compose, GitHub Actions

---

## File Map

### Created
- `backend/eslint.config.mjs` — backend ESLint 9 flat config
- `backend/src/integrations/wordpressService.js` — moved from services/
- `backend/src/services/.gitkeep` — keeps empty services/ folder tracked
- `frontend/eslint.config.mjs` — minimal wrapper importing Nuxt-generated config
- `SETUP.md` — developer onboarding guide

### Modified
- `backend/package.json` — rename to `app-name-backend`, add lint scripts, add ESLint devDependencies
- `backend/.env.example` — fix PORT from 3000 to 8080
- `backend/Dockerfile` — fix EXPOSE from 3000 to 8080
- `frontend/package.json` — add lint scripts, add `@nuxt/eslint` devDependency
- `frontend/nuxt.config.ts` — add `@nuxt/eslint` to modules
- `frontend/.env.example` — fix API base URL from port 3000 to 8080
- `docker-compose.yml` — replace `dexxter-app1` image names with `app-name`
- `.github/workflows/deploy.yml` — replace `dexxter-app1` image names with `app-name`
- `README.md` — fix ports, update project structure, remove WordPress env vars

### Deleted
- `backend/src/services/wordpressService.js` — moved to integrations/

---

## Task 1: Generic naming

**Files:**
- Modify: `backend/package.json`
- Modify: `docker-compose.yml`
- Modify: `.github/workflows/deploy.yml`
- Modify: `README.md`

- [ ] **Step 1: Replace in `backend/package.json`**

Change `"name": "dexxter-app1-backend"` to `"name": "app-name-backend"`.

- [ ] **Step 2: Replace in `docker-compose.yml`**

Change both image references:
```yaml
image: ghcr.io/${GITHUB_REPOSITORY_OWNER:-local}/app-name-backend:latest
```
```yaml
image: ghcr.io/${GITHUB_REPOSITORY_OWNER:-local}/app-name-frontend:latest
```

- [ ] **Step 3: Replace in `.github/workflows/deploy.yml`**

Change the two env vars at the top of the file:
```yaml
env:
  REGISTRY: ghcr.io
  BACKEND_IMAGE: ghcr.io/${{ github.repository_owner }}/app-name-backend
  FRONTEND_IMAGE: ghcr.io/${{ github.repository_owner }}/app-name-frontend
```

- [ ] **Step 4: Verify no `dexxter-app1` tokens remain**

Run from project root:
```bash
grep -r "dexxter-app1" . --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=.nuxt
```
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add backend/package.json docker-compose.yml .github/workflows/deploy.yml
git commit -m "refactor: replace dexxter-app1 with app-name placeholder"
```

---

## Task 2: Relocate wordpressService to integrations/

**Files:**
- Create: `backend/src/integrations/wordpressService.js`
- Create: `backend/src/services/.gitkeep`
- Delete: `backend/src/services/wordpressService.js`

- [ ] **Step 1: Create the integrations directory and move the file**

```bash
mkdir -p backend/src/integrations
cp backend/src/services/wordpressService.js backend/src/integrations/wordpressService.js
```

- [ ] **Step 2: Update the file header comment**

Open `backend/src/integrations/wordpressService.js`. Change the top comment to:

```js
//
// WordPress REST API wrapper — OPTIONAL INTEGRATION
//
// Copy this file to src/services/ and adapt it when your app needs to
// communicate with the WordPress REST API.
//
// Requires env vars: WORDPRESS_URL, WORDPRESS_USER, WORDPRESS_APP_PASSWORD
//
```

- [ ] **Step 3: Add .gitkeep to services/**

```bash
touch backend/src/services/.gitkeep
rm backend/src/services/wordpressService.js
```

- [ ] **Step 4: Verify structure**

```bash
find backend/src -type f
```
Expected output (order may vary):
```
backend/src/routes/index.js
backend/src/controllers/.gitkeep
backend/src/middleware/.gitkeep
backend/src/services/.gitkeep
backend/src/integrations/wordpressService.js
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/
git commit -m "refactor: move wordpressService to integrations/ as optional"
```

---

## Task 3: Backend ESLint

**Files:**
- Modify: `backend/package.json`
- Create: `backend/eslint.config.mjs`

- [ ] **Step 1: Install ESLint devDependencies**

```bash
cd backend
npm install -D eslint @eslint/js globals
```

- [ ] **Step 2: Add lint scripts to `backend/package.json`**

Add under `"scripts"`:
```json
"lint": "eslint .",
"lint:fix": "eslint . --fix"
```

- [ ] **Step 3: Create `backend/eslint.config.mjs`**

```js
import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'warn',
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
    },
  },
  {
    ignores: ['node_modules/'],
  },
];
```

- [ ] **Step 4: Run lint and verify zero errors**

```bash
cd backend
npm run lint
```
Expected: exits with code 0, no errors. Warnings for `console.log` in `server.js` are acceptable — these are `warn` not `error`.

- [ ] **Step 5: Commit**

```bash
git add backend/eslint.config.mjs backend/package.json backend/package-lock.json
git commit -m "feat: add ESLint 9 flat config to backend"
```

---

## Task 4: Frontend ESLint

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/nuxt.config.ts`
- Create: `frontend/eslint.config.mjs`

- [ ] **Step 1: Install `@nuxt/eslint`**

```bash
cd frontend
npm install -D @nuxt/eslint eslint
```

- [ ] **Step 2: Add `@nuxt/eslint` to `frontend/nuxt.config.ts`**

```ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080',
    },
  },
})
```

- [ ] **Step 3: Run `nuxt prepare` to generate the ESLint config**

```bash
cd frontend
npm run postinstall
```

This runs `nuxt prepare`, which generates `.nuxt/eslint.config.mjs`.

- [ ] **Step 4: Create `frontend/eslint.config.mjs`**

```js
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt()
```

- [ ] **Step 5: Add lint scripts to `frontend/package.json`**

Add under `"scripts"`:
```json
"lint": "eslint .",
"lint:fix": "eslint . --fix"
```

- [ ] **Step 6: Run lint and verify zero errors**

```bash
cd frontend
npm run lint
```
Expected: exits with code 0, no errors.

- [ ] **Step 7: Commit**

```bash
git add frontend/eslint.config.mjs frontend/nuxt.config.ts frontend/package.json frontend/package-lock.json
git commit -m "feat: add @nuxt/eslint to frontend"
```

---

## Task 5: Fix port configuration

The backend `.env.example` says `PORT=3000` but `docker-compose.yml` maps `8080:8080`. The `frontend/.env.example` points to port 3000 for the API. Both need to be consistent with the intended layout (backend on 8080, frontend on 3000).

**Files:**
- Modify: `backend/.env.example`
- Modify: `backend/Dockerfile`
- Modify: `frontend/.env.example`

- [ ] **Step 1: Fix `backend/.env.example`**

Change `PORT=3000` to `PORT=8080`.

- [ ] **Step 2: Fix `backend/Dockerfile`**

Change `EXPOSE 3000` to `EXPOSE 8080`.

- [ ] **Step 3: Fix `frontend/.env.example`**

Change `NUXT_PUBLIC_API_BASE=http://localhost:3000` to `NUXT_PUBLIC_API_BASE=http://localhost:8080`.

- [ ] **Step 4: Verify consistency**

Run:
```bash
grep -n "3000\|8080" backend/.env.example backend/Dockerfile frontend/.env.example docker-compose.yml
```
Expected: only `8080` appears for backend, only `3000` appears for frontend (Nuxt dev server default).

- [ ] **Step 5: Commit**

```bash
git add backend/.env.example backend/Dockerfile frontend/.env.example
git commit -m "fix: align backend port to 8080 across env and Dockerfile"
```

---

## Task 6: Write SETUP.md

**Files:**
- Create: `SETUP.md`

- [ ] **Step 1: Create `SETUP.md` at project root**

```markdown
# Setting Up a New App from This Template

## 1. Clone or use as GitHub template

```bash
git clone <this-repo-url> my-new-app
cd my-new-app
```

Or click **"Use this template"** on GitHub to create a new repo.

## 2. Rename the app

Find and replace `app-name` with your project name in these files:

| File | What changes |
|------|--------------|
| `backend/package.json` | `"name"` field |
| `docker-compose.yml` | both image names |
| `.github/workflows/deploy.yml` | `BACKEND_IMAGE` and `FRONTEND_IMAGE` env vars |
| `README.md` | references throughout |

Also update the VPS deploy path in `.github/workflows/deploy.yml`:

```yaml
script: |
  cd ~/your-project-name   # ← change this
```

## 3. Set up environment variables

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill in values in each `.env` file. See `README.md` for a description of each variable.

## 4. Configure GitHub Actions secrets

Add these secrets in your GitHub repo settings → Secrets and variables → Actions:

| Secret | Description |
|--------|-------------|
| `SSH_KEY` | Private SSH key for VPS access |
| `VPS_HOST` | Tailscale hostname or IP of your VPS |
| `VPS_USER` | SSH username on the VPS |
| `TS_OAUTH_CLIENT_ID` | Tailscale OAuth client ID |
| `TS_OAUTH_SECRET` | Tailscale OAuth secret |

## 5. Deploy

Push to `master` to trigger the first build and deploy:

```bash
git push origin master
```

The pipeline builds Docker images, pushes them to GHCR, and deploys via SSH to your VPS.

## Optional: WordPress integration

A pre-configured WordPress REST API client is available in `backend/src/integrations/wordpressService.js`. Copy it to `backend/src/services/` and set `WORDPRESS_URL`, `WORDPRESS_USER`, and `WORDPRESS_APP_PASSWORD` in your `.env` to use it.
```

- [ ] **Step 2: Commit**

```bash
git add SETUP.md
git commit -m "docs: add SETUP.md for new app onboarding"
```

---

## Task 7: Fix README.md

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Fix the Quick Start ports**

In the README Quick Start section, update the URLs:
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Health check: http://localhost:8080/health
```

Also fix Local Development section — the backend dev port in the README currently says 3000, update all backend references to 8080.

- [ ] **Step 2: Update the project structure section**

Replace the current structure block with:
```
├── backend/       Express REST API
│   └── src/
│       ├── routes/       HTTP route definitions
│       ├── controllers/  Request handlers
│       ├── services/     Business logic (project-specific)
│       ├── middleware/   Express middleware
│       └── integrations/ Optional external API wrappers (e.g. WordPress)
├── frontend/      Nuxt 4 application
│   ├── app/
│   │   ├── composables/  Shared Vue composables (useApi, …)
│   │   └── pages/        File-based routing
└── .github/workflows/deploy.yml  CI/CD pipeline
```

- [ ] **Step 3: Clean up environment variables table**

Remove WordPress-specific variables (`WORDPRESS_URL`, `WORDPRESS_USER`, `WORDPRESS_APP_PASSWORD`) from the main env table — they are documented in `backend/src/integrations/wordpressService.js`. The table should only contain:

| Variable | Service | Description |
|---|---|---|
| `PORT` | backend | Express listen port (default 8080) |
| `API_URL` | backend | Generic external API base URL |
| `API_KEY` | backend | Generic external API key |
| `NUXT_PUBLIC_API_BASE` | frontend | Backend base URL visible to browser |

- [ ] **Step 4: Verify README**

Read through the README once to check for any remaining references to `dexxter-app1` or wrong ports.

```bash
grep -n "dexxter-app1\|localhost:3000" README.md
```
Expected: no matches (3000 should only appear in frontend context if at all, not for backend).

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: fix README ports and update project structure"
```

---

## Final verification

- [ ] **Verify no `dexxter-app1` tokens anywhere**

```bash
grep -r "dexxter-app1" . --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=.nuxt --exclude-dir=.output
```
Expected: no output.

- [ ] **Verify both lint scripts pass**

```bash
cd backend && npm run lint
cd ../frontend && npm run lint
```
Expected: both exit 0.

- [ ] **Verify git log is clean**

```bash
git log --oneline -8
```
Expected: 7 commits from this plan, each scoped appropriately.
