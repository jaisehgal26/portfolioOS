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
cp .env.example .env
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
cp frontend/.env.example frontend/.env.local
pnpm dev:frontend
```

Open [http://localhost:3000](http://localhost:3000). Submit the Contact form — you should get a 201 response.

### 5. Verify a submission

```bash
docker exec -it portfolioos-postgres-1 psql -U portfolio -d portfolio -c "SELECT id, name, email, created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 5;"
```

(Container name may differ — run `docker ps` to confirm.)

## Environment variables

### Frontend (`frontend/.env.local`)

| Variable | Local | Production (Vercel) |
|----------|-------|---------------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | *(leave unset — same-origin `/api/v1/contact`)* |

### Backend / API (`backend/.env` local · Vercel env vars in production)

| Variable | Local | Production (Vercel) |
|----------|-------|---------------------|
| `DATABASE_URL` | `postgresql+asyncpg://portfolio:portfolio@127.0.0.1:5433/portfolio` | Neon **pooled** connection string |
| `CORS_ORIGINS` | `http://localhost:3000` | `https://jaisehgal.com,https://www.jaisehgal.com,http://localhost:3000` |

Neon URLs use `postgresql://` — the backend normalizes to `postgresql+asyncpg://` and adds `ssl=require` for Neon hosts.

## Deployment

### Vercel (monorepo — same as FormForge)

1. Deploy repo root (`.` ) — **no** Root Directory override needed.
2. `vercel.json` builds `frontend/` and routes `/api/v1/*` → root `api/index.py` (FastAPI).
3. **Environment variables** (Production + Preview):
   - `DATABASE_URL` — Neon pooled connection string
   - `CORS_ORIGINS` — `https://jaisehgal.com,https://www.jaisehgal.com,http://localhost:3000`
   - Do **not** set `NEXT_PUBLIC_API_URL` — contact form uses same-origin `/api/v1/contact`.
4. Push to `main` — Vercel auto-deploys.

Next.js routes like `/api/embed-check` are **not** rewritten — only `/api/v1/*` hits Python.

### Neon (database)

Project **portfolioos** on Neon. Table `contact_submissions` is already created. Use the **pooled** connection string as `DATABASE_URL` on Vercel.

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check (Render) |
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
- No email notifications or spam protection in v1 — see handoff doc for follow-ups.
- The embed-check Next.js route stays in `frontend/app/api/embed-check/` for BrowserApp iframe previews.
