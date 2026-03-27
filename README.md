# Dexxter — Full-Stack Template

Node/Express backend + Nuxt 4 frontend, Docker Compose orchestration.

## Quick Start

```bash
git clone <repo-url> && cd Dexxter
cp .env.example .env          # fill in your values
docker compose up --build
```

- Frontend: http://localhost:80
- Backend API: http://localhost:3000
- Health check: http://localhost:3000/health

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
| `PORT` | backend | Express listen port (default 3000) |
| `WORDPRESS_URL` | backend | Base URL of WordPress site |
| `WORDPRESS_USER` | backend | WordPress username for REST API auth |
| `WORDPRESS_APP_PASSWORD` | backend | WordPress Application Password |
| `API_URL` | backend | Generic external API base URL |
| `API_KEY` | backend | Generic external API key |
| `NUXT_PUBLIC_API_BASE` | frontend | Backend base URL visible to browser |

## Project Structure

```
├── backend/       Express REST API
│   └── src/
│       ├── routes/       HTTP route definitions
│       ├── controllers/  Request handlers
│       ├── services/     Business logic / external API wrappers
│       └── middleware/   Express middleware
├── frontend/      Nuxt 4 application
│   ├── composables/  Shared Vue composables (useApi, …)
│   └── pages/        File-based routing
└── .github/workflows/deploy.yml  CI/CD pipeline
```
