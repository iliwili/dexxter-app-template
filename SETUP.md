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

The current value is `cd ~/dexxter` — update `dexxter` to match your VPS directory.

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
