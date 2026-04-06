# app-name

Node/Express backend + Nuxt 4 frontend, Docker Compose orchestration.

## Quick Start

```bash
git clone <repo-url> && cd app-name
cp .env.example .env          # fill in your values
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Health check: http://localhost:8080/health

## Local Development (without Docker)

```bash
# Backend
cd backend && cp .env.example .env && npm install && npm run dev

# Frontend (separate terminal)
cd frontend && cp .env.example .env && npm install && npm run dev
```

## Environment Variables

| Variable | Service | Description |
|---|---|---|
| `PORT` | backend | Express listen port (default 8080) |
| `API_URL` | backend | Generic external API base URL |
| `API_KEY` | backend | Generic external API key |
| `NUXT_PUBLIC_API_BASE` | frontend | Backend base URL visible to browser |

## Project Structure

```
├── backend/       Express REST API
│   └── src/
│       ├── routes/       HTTP route definitions
│       ├── controllers/  Request handlers
│       ├── services/     Business logic (project-specific)
│       ├── middleware/   Express middleware
│       └── integrations/ Optional external API wrappers (e.g. WordPress)
├── frontend/      Nuxt 4 application
│   └── app/
│       ├── composables/  Shared Vue composables (useApi, …)
│       └── pages/        File-based routing
└── .github/workflows/deploy.yml  CI/CD pipeline
```
