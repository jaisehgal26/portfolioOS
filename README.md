# portfolioOS

Monorepo for [jaisehgal.com](https://jaisehgal.com) — a Next.js "JaiOS" portfolio frontend and a FastAPI backend for contact form submissions.

## Layout

```
portfolioOS/
├── frontend/          # Next.js 15 app (JaiOS UI)
├── backend/           # FastAPI + SQLAlchemy + Alembic
├── docker-compose.yml # Local PostgreSQL 16
└── package.json       # pnpm workspace orchestration scripts
```

**Production:** Single Vercel project (root directory `.`) — Next.js UI + FastAPI contact API via root `api/index.py` · Postgres on Neon. Same pattern as [FormForge](https://github.com/jaisehgal26/dynamic-form-builder).

## Prerequisites

- Node.js 20+ and [pnpm](https://pnpm.io/)
- Python 3.11+
- Docker Desktop (local Postgres)

## Local development

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start PostgreSQL

```bash
pnpm docker:up
# or: docker compose up -d
```

### 3. Backend setup

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
cp ../.env.example ../.env   # shared with frontend — edit at repo root
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

From repo root you can also run:

```bash
pnpm dev:backend
```

(requires venv already created and dependencies installed)

### 4. Frontend setup

```bash
cp .env.example .env   # repo root — shared with backend (skip if already created)
pnpm dev:frontend
```

Open [http://localhost:3000](http://localhost:3000). Submit the Contact form — you should get a 201 response.

### 5. Verify a submission

```bash
docker exec -it portfolioos-postgres-1 psql -U portfolio -d portfolio -c "SELECT id, name, email, created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 5;"
```

(Container name may differ — run `docker ps` to confirm.)

## Environment variables

Single file at the **repo root**: `.env` (copy from `.env.example`). Both Next.js and FastAPI read from it locally.

### Shared (`.env` at repo root)

| Variable | Local | Production (Vercel) |
|----------|-------|---------------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | *(leave unset — same-origin `/api/v1/contact`)* |
| `DATABASE_URL` | `postgresql+asyncpg://portfolio:portfolio@127.0.0.1:5433/portfolio` | Neon **pooled** connection string |
| `CORS_ORIGINS` | `http://localhost:3000` | `https://jaisehgal.com,https://www.jaisehgal.com,http://localhost:3000` |
| `RESEND_API_KEY` | Your Resend API key | Same — from [resend.com/api-keys](https://resend.com/api-keys) |
| `RESEND_FROM_EMAIL` | `JaiOS <onboarding@resend.dev>` | `Jai Sehgal <contact@jaisehgal.com>` after domain verified |
| `NOTIFY_EMAIL` | `sehgaljai81@gmail.com` | Your inbox for new contact notifications |

Neon URLs use `postgresql://` — the backend normalizes to `postgresql+asyncpg://` and adds `ssl=require` for Neon hosts.

On contact submit, the API saves to Postgres then sends two emails via Resend: a **notification to you** and an **auto-reply to the sender**. If `RESEND_API_KEY` is unset, submissions still save — emails are skipped.

## Deployment

### Vercel (monorepo)

1. Deploy repo root (`.` ) — **no** Root Directory override needed.
2. `vercel.json` builds `frontend/` and routes `/api/v1/*` → root `api/index.py` (FastAPI).
3. **Environment variables** (Production + Preview):
   - `DATABASE_URL` — Neon pooled connection string
   - `CORS_ORIGINS` — `https://jaisehgal.com,https://www.jaisehgal.com,http://localhost:3000`
   - `RESEND_API_KEY` — Resend API key
   - `RESEND_FROM_EMAIL` — verified sender (e.g. `Jai Sehgal <contact@jaisehgal.com>`)
   - `NOTIFY_EMAIL` — `sehgaljai81@gmail.com`
   - `CRON_SECRET` — long random string for health cron (see below)
   - `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — rate limiting
   - Do **not** set `NEXT_PUBLIC_API_URL` — contact form uses same-origin `/api/v1/contact`.
4. Push to `main` — Vercel auto-deploys.

**Note:** Vercel Hobby only allows **once-per-day** crons. Health checks use an external scheduler ([cron-job.org](https://cron-job.org)) instead — see [Health cron](#health-cron-cron-joborg).

Next.js routes like `/api/embed-check` are **not** rewritten — only `/api/v1/*` hits Python.

### Health cron (cron-job.org)

Pings monitored URLs and stores results for the Activity Monitor app.

1. Set `CRON_SECRET` in Vercel (Production) — e.g. `openssl rand -hex 32`.
2. Optional: `HEALTH_SELF_URL=https://jaisehgal.com` (default).
3. Create a job at [cron-job.org](https://console.cron-job.org/jobs/create):

| Field | Value |
|-------|--------|
| **URL** | `https://jaisehgal.com/api/v1/health/cron?secret=YOUR_CRON_SECRET` |
| **Schedule** | Every 5–15 minutes (your choice) |
| **Request method** | `GET` |

Alternative (header instead of query string):

- URL: `https://jaisehgal.com/api/v1/health/cron`
- Header: `Authorization: Bearer YOUR_CRON_SECRET`

Success response (200):

```json
{ "checked": 4, "results": [{ "target_key": "jaios-api", "status": "up", "latency_ms": 120 }] }
```

Public read (no secret): `GET /api/v1/health/status` — returns latest cached results for the UI.

### Neon (database)

Project **portfolioos** on Neon. Table `contact_submissions` is already created. Use the **pooled** connection string as `DATABASE_URL` on Vercel.

### Resend (email)

1. Create a free account at [resend.com](https://resend.com) and an [API key](https://resend.com/api-keys).
2. For production, [verify `jaisehgal.com`](https://resend.com/docs/dashboard/domains/introduction) and set `RESEND_FROM_EMAIL` to e.g. `Jai Sehgal <contact@jaisehgal.com>`.
3. For local testing, use `JaiOS <onboarding@resend.dev>` (Resend test sender) — can only send to your own verified email until the domain is verified.

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/v1/health/status` | Latest service health (Activity Monitor) |
| `GET` | `/api/v1/health/cron` | Run health checks (requires `CRON_SECRET`) |
| `POST` | `/api/v1/contact` | Submit contact form |

**Request body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Hello!",
  "subject": "Optional subject"
}
```

**Response (201):**

```json
{
  "id": "uuid",
  "created_at": "2026-08-05T12:00:00Z"
}
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start frontend dev server |
| `pnpm dev:frontend` | Same as above |
| `pnpm dev:backend` | Start FastAPI with reload (Windows venv path) |
| `pnpm build` | Build frontend for production |
| `pnpm typecheck` | TypeScript check for frontend |
| `pnpm docker:up` | Start local Postgres |
| `pnpm docker:down` | Stop local Postgres |

## Notes

- Contact API cold starts on Vercel serverless (~1–3s first request after idle). The form shows "Sending…" until the response returns.
- Email delivery failures are logged but do not block a successful form submission (DB is source of truth).
- The embed-check Next.js route stays in `frontend/app/api/embed-check/` for BrowserApp iframe previews.
