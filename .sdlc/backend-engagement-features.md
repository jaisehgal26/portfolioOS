# Task: Backend engagement features (reactions, health, guestbook, rate limits)

- **Slug:** backend-engagement-features
- **Created:** 2026-08-06
- **Status:** testing
- **One-line goal:** Add four production backend capabilities — case-study reactions, cron-driven health monitoring for live services, a moderated guestbook, and IP-based rate limiting on public write endpoints — with matching JaiOS UI in System Monitor, Case Studies, and a new Guestbook surface.

---

## 1. Scope  · owner: scope-analyst

### Problem / request (in plain words)

The portfolio backend today is minimal: `POST /api/v1/contact` persists contact submissions and sends Resend email; `GET /health` returns a static `{"status":"ok"}`. There is no engagement layer (likes, visitor messages), no real uptime visibility, and no abuse protection on public write APIs.

The user wants four related backend features shipped together as one SDLC task:

1. **Project reactions** — visitors can 👍 case studies; counts live in Postgres.
2. **Health checks** — a cron job pings external services; System Monitor shows live status instead of only metaphorical skill metrics.
3. **Guestbook** — visitors leave short public messages (moderated); name/email optional or anonymous.
4. **Rate limiting** — protect contact and other public write endpoints from spam/abuse, respecting Vercel serverless constraints.

### Why it matters (user value)

- **Engagement signal:** Reaction counts on case studies show which problem domains resonate; guestbook adds social proof and personality beyond static copy.
- **Operational credibility:** Real health status for QuickPad, FormForge, and the portfolio API demonstrates production-minded engineering — aligns with System Monitor’s “live read-out” framing and showcase-project copy.
- **Abuse resistance:** Public endpoints without rate limits are risky on a personal site; contact was explicitly deferred in the contact-form handoff.
- **Stack demonstration:** Postgres persistence, cron jobs on Vercel, and serverless-safe rate limiting mirror patterns already described in QuickPad/FormForge project narratives.

---

### Feature 1 — Project reactions

#### What entities/users can do

| Actor | Action |
|-------|--------|
| Visitor | View 👍 count per case study; click to add one 👍 per case study per browser session |
| API | `GET` aggregate counts; `POST` increment (idempotent per visitor fingerprint) |
| Owner | No admin UI in v1 — counts queryable via DB |

#### Reaction targets (which projects)

- **In scope:** all **use-case case studies** from `frontend/data/projects.ts` — keyed by `Project.id` (string slug).
- **Current ids (8):** `agentic-streaming`, `payment-settlement`, `rbac-permissions`, `live-messaging`, `clinical-live-ops`, `admin-bulk-ops`, `job-portal-funnels`, `ai-in-product`.
- **Out of scope for v1:** `portfolioProjects` ids (`quickpad`, `formforge`, `old-portfolio`) — those are showcase demos in Finder → Projects, not case-study write-ups. Can add later with the same `project_id` pattern.
- **Namespace:** store `target_type = 'case_study'` + `target_id` so portfolio reactions can be added without schema churn.

#### Dedup / integrity

- One 👍 per **case study per visitor** — not one global 👍.
- **Default assumption:** server-side dedup via hashed IP + User-Agent (+ optional client token in `localStorage`), stored in Postgres unique constraint. No accounts.
- Counts are **monotonic** (no unlike/remove in v1).

#### UI touchpoints

- `CaseStudiesApp.tsx` — 👍 control + count on active case study (and optionally sidebar totals).
- `ProjectsApp.tsx` / Finder case-study views — same control if planner chooses shared component (recommended).

#### In scope

- Alembic migration: `project_reactions` table (aggregate counts) + `reaction_events` or unique visitor row per `(target_type, target_id, visitor_hash)`.
- `GET /api/v1/reactions?target_type=case_study` — all counts (or `?target_id=` single).
- `POST /api/v1/reactions` — body `{ target_type, target_id }`; validate `target_id` against allowlist derived from `projects.ts` ids (hardcoded list in backend config or shared constant).
- Frontend API helpers in `frontend/lib/api.ts`.
- Optimistic UI + error toast on failure; show current count on load.

#### Out of scope (v1)

- Multiple reaction types (❤️, etc.) — 👍 only.
- Unlike / toggle off.
- Reactions on portfolio showcase projects.
- Admin dashboard to reset or edit counts.
- Auth or logged-in user profiles.

#### Acceptance criteria — reactions

- [ ] All 8 case-study ids accept reactions; unknown id → `422`.
- [ ] `GET` returns accurate counts from Postgres after reload.
- [ ] Same visitor cannot increment the same case study twice (second `POST` → `409` or `200` no-op with same count — planner picks one and documents).
- [ ] Case Studies UI shows count and disabled/highlighted state after user has reacted.
- [ ] Endpoint protected by rate limiting (see Feature 4).

---

### Feature 2 — Health checks

#### What entities/users can do

| Actor | Action |
|-------|--------|
| Cron (Vercel) | On schedule, HTTP-check configured targets; persist result rows |
| Visitor | Open System Monitor → see latest status per service (up/down, latency, last checked) |
| API | `GET /api/v1/health/status` — public read of latest snapshot per target |

#### Health check targets (v1)

| Key | URL | Notes |
|-----|-----|-------|
| `jaios-api` | `GET /health` on same deployment | Self-check via internal path; `vercel.json` rewrites `/health` → `/api` |
| `quickpad` | `https://quickpad.jaisehgal.com` | From `project-portfolio.ts` `liveUrl` |
| `formforge` | `https://formforge.jaisehgal.com` | From `project-portfolio.ts` `liveUrl` |
| `jaisehgal` | `https://jaisehgal.com` | Main portfolio origin (README / profile) |

**Default assumption — out of v1:** `oldportfolio.jaisehgal.com` (legacy site, lower priority). Planner may include if zero extra effort.

**Check semantics:** HTTP GET; success = status code 200–399 within timeout (e.g. 10s). Record `status` (`up`/`down`), `status_code`, `latency_ms`, `checked_at`, optional `error_message`.

#### Cron strategy

- **Vercel Cron** hits a protected route e.g. `GET /api/v1/health/cron` or `POST` with `CRON_SECRET` header/env — not callable by anonymous clients.
- **Default schedule:** every 5 minutes (`*/5 * * * *`) — balances freshness vs. serverless invocations.
- Each run checks all targets sequentially or in parallel; writes one row per target to `health_check_results` (or upserts `health_check_latest` + append history — planner chooses simplest).

#### System Monitor UI

- Add a **“Services”** or **“Network”** section to `SystemMonitorApp.tsx` with real data from `GET /api/v1/health/status`.
- Keep existing metaphorical sections (skills as processes, session battery, achievements) — do not remove.
- Visual: green/red indicator, last-checked relative time, latency ms; loading skeleton on fetch.

#### In scope

- Alembic migration for health check storage.
- Cron-invoked checker using `httpx` (async) in FastAPI.
- Public read endpoint (latest snapshot only — no cron secret exposure).
- `vercel.json` cron configuration + `CRON_SECRET` in `.env.example`.
- Frontend fetch on System Monitor mount (and optional 60s refresh while app open).

#### Out of scope (v1)

- Historical charts / uptime percentages / SLA reporting.
- Alerting (email, PagerDuty) on downtime.
- Checking `oldportfolio.jaisehgal.com` unless explicitly added.
- Deep health (DB connectivity probe in `/health`) — optional enhancement; v1 self-check can remain shallow `{"status":"ok"}`.
- Synthetic checks from multiple regions.

#### Acceptance criteria — health checks

- [ ] Cron route runs on schedule in production (or manually triggerable with secret for local test).
- [ ] All four targets above produce stored results after a cron run.
- [ ] `GET /api/v1/health/status` returns latest per-target status JSON consumable by frontend.
- [ ] System Monitor displays live statuses; shows sensible fallback if API unreachable.
- [ ] Failed external URLs marked `down` with error detail; do not crash cron handler.

---

### Feature 3 — Guestbook

#### What entities/users can do

| Actor | Action |
|-------|--------|
| Visitor | Submit a short message; optionally provide name and/or email, or post anonymously |
| Public | `GET` approved messages only, newest first, paginated |
| Owner (moderator) | Review pending messages; approve or reject via secret-protected admin API |

#### Moderation workflow (v1)

**Default assumption — approve-before-public:**

1. `POST` creates row with `status = 'pending'`.
2. Public `GET /api/v1/guestbook` returns only `status = 'approved'`.
3. Moderator uses **secret-token admin routes** (no login UI in v1):
   - `GET /api/v1/admin/guestbook?status=pending` — list pending (header `X-Admin-Key: $ADMIN_API_KEY`)
   - `PATCH /api/v1/admin/guestbook/{id}` — `{ "status": "approved" | "rejected" }`
4. On approve, message becomes visible on next public fetch.
5. **Optional notification:** send Resend email to `notify_email` on new pending submission (same pattern as contact) — **in scope if low effort**; otherwise follow-up.

**Display rules:**

- Anonymous: show as “Anonymous” (no name/email rendered).
- If name provided: show name; email **never** exposed on public API (stored for moderator only / spam contact).
- Max message length (e.g. 500 chars); profanity filter out of scope.

#### In scope

- Alembic migration: `guestbook_entries` (`id`, `created_at`, `status`, `name` nullable, `email` nullable, `message`, `is_anonymous` bool, `visitor_hash` for rate limit dedup optional).
- Public `POST /api/v1/guestbook`, `GET /api/v1/guestbook` (approved only, `limit`/`offset` query params).
- Admin routes behind `ADMIN_API_KEY` env (reuse or separate from `CRON_SECRET`).
- New JaiOS app **Guestbook** (or section in Finder / Contact) — planner decides placement; minimum: readable list + submit form.
- Client validation, loading/success (“Thanks — pending moderation”) states.

#### Out of scope (v1)

- Public display of pending messages.
- Visitor edit/delete of their message.
- Threaded replies.
- CAPTCHA / Akismet / ML moderation.
- Full admin UI in JaiOS — curl/HTTPie moderation is acceptable for v1.
- Email to submitter on approval.

#### Acceptance criteria — guestbook

- [ ] Visitor can submit anonymous or named message; optional email stored but not leaked publicly.
- [ ] Pending messages do not appear on public `GET`.
- [ ] Admin key can list pending and approve; approved message appears publicly.
- [ ] Rejected messages stay hidden.
- [ ] Guestbook `POST` protected by rate limiting.
- [ ] Form UX matches existing JaiOS design patterns (toast, validation errors).

---

### Feature 4 — Rate limiting

#### Strategy (Vercel serverless constraints)

- **No in-memory counters** — each `/api` invocation is stateless; process-local limits are ineffective.
- **Default assumption — Upstash Redis** sliding-window counters (already referenced in `knowledge.ts`, QuickPad/FormForge narratives). Env: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
- **Fallback if Redis unavailable:** planner may use Postgres `rate_limit_buckets` table — slower but avoids new vendor; scope-analyst assumes **Upstash first**, Postgres fallback optional.
- Key: **client IP** from `X-Forwarded-For` (Vercel) or `request.client.host`; hash before logging if stored.

#### Endpoints & default limits (per IP, sliding window)

| Endpoint | Limit | Window | Rationale |
|----------|-------|--------|-----------|
| `POST /api/v1/contact` | 5 | 1 hour | Spam protection on email path |
| `POST /api/v1/guestbook` | 3 | 1 hour | Prevent guestbook flood |
| `POST /api/v1/reactions` | 30 | 1 hour | Allow browsing all 8 case studies + retries |
| `GET` public reads | 120 | 1 minute | Light abuse guard on status/guestbook/reactions |
| Cron / admin routes | exempt | — | Authenticated by secret, not IP limit |

- Return **`429 Too Many Requests`** with JSON `{"detail":"..."}` and **`Retry-After`** header (seconds).
- Frontend: surface friendly message via existing `ApiError` pattern in `frontend/lib/api.ts`.

#### In scope

- Shared FastAPI dependency/middleware `check_rate_limit(scope: str)`.
- Settings in `backend/app/config.py` for Upstash + limit tunables.
- Apply to all new write endpoints and existing `POST /contact`.
- Document env vars in `.env.example`.

#### Out of scope (v1)

- Per-email or per-API-key tiers.
- WAF / Cloudflare rules.
- Geo blocking.
- Distributed bot detection.

#### Acceptance criteria — rate limiting

- [ ] Exceeding limit returns `429` with `Retry-After`.
- [ ] Under limit, requests succeed normally.
- [ ] Limits enforced across separate serverless invocations (proves Redis or DB backing).
- [ ] Contact form shows user-visible error on `429`.
- [ ] Cron and admin routes bypass public rate limits.

---

### Cross-feature in scope

- Alembic migrations for all new tables; `backend/app/models/`, `schemas/`, `routers/`, `services/`.
- Register routers in `backend/app/main.py`; CORS allows existing origins.
- `frontend/lib/api.ts` extended with typed clients.
- `.env.example` updated (Upstash, `CRON_SECRET`, `ADMIN_API_KEY`).
- `vercel.json` cron entry.
- Changelog entry in `frontend/data/changelog.ts` when shipped (per JaiOS roadmap convention).

### Cross-feature out of scope (v1)

- User accounts, JWT auth, or OAuth.
- Admin UI app in JaiOS (moderation via secret API only).
- Neon branch automation, CI beyond existing Vercel build.
- Moving `embed-check` Next.js route to FastAPI.
- Analytics dashboard / Plausible integration.
- Webhooks on health failure or new guestbook entry (unless trivial Resend notify on guestbook submit).

### Suggested implementation order (for planner)

1. Rate limiting infrastructure (unblocks safe public writes).
2. Health checks + cron (independent).
3. Reactions (smallest user-facing write feature).
4. Guestbook + admin moderation (most workflow).

---

### Open questions / assumptions

| # | Question | Default assumption for v1 |
|---|----------|---------------------------|
| Q1 | Reactions on portfolio projects too? | **No** — case-study ids only (`projects.ts`). |
| Q2 | Reaction dedup mechanism? | **Hashed IP + UA** unique constraint; client `localStorage` mirror for instant UI. |
| Q3 | Second POST on same reaction? | **Idempotent success** (200, no increment) — better UX than 409. |
| Q4 | Include `oldportfolio.jaisehgal.com` in health checks? | **No** unless trivial. |
| Q5 | Health cron frequency? | **Every 5 minutes** via Vercel Cron. |
| Q6 | Guestbook moderation UI? | **Secret-key admin API only**; no in-app moderator. |
| Q7 | Email on new guestbook pending? | **Yes, mirror contact notify** to `notify_email` if Resend already configured. |
| Q8 | Rate limit backend? | **Upstash Redis**; document setup in README. |
| Q9 | Guestbook app placement? | **New Launchpad/Finder app** “Guestbook” — planner confirms vs. Contact tab. |
| Q10 | `projects.ts` count is 8 not 9 | Backend allowlist matches **8 current ids**; update if a ninth is added before ship. |

---

### Files & areas likely involved

**Backend**

- `backend/app/main.py` — router registration, maybe lifespan
- `backend/app/config.py` — Upstash, cron secret, admin key, rate limit constants
- `backend/app/database.py` — unchanged pattern
- `backend/app/models/` — new: `reaction.py`, `health.py`, `guestbook.py` (+ `__init__.py`)
- `backend/app/schemas/` — Pydantic request/response models
- `backend/app/routers/` — `reactions.py`, `health.py`, `guestbook.py`, `admin.py`
- `backend/app/services/` — `rate_limit.py`, `health_checker.py`, optional `guestbook_notify.py`
- `backend/alembic/versions/` — new migrations
- `api/index.py` — unlikely change (re-exports app)

**Frontend**

- `frontend/lib/api.ts` — API client functions + `429` handling
- `frontend/components/apps/CaseStudiesApp.tsx` — reaction UI
- `frontend/components/apps/ProjectsApp.tsx` — optional shared reaction chip
- `frontend/components/apps/SystemMonitorApp.tsx` — services health section
- `frontend/components/apps/GuestbookApp.tsx` — **new**
- `frontend/data/apps.ts`, `frontend/components/os/appRegistry.tsx`, `frontend/components/os/AppIcon.tsx` — register Guestbook
- `frontend/data/changelog.ts` — ship entry

**Config / deploy**

- `vercel.json` — `crons` array
- `.env.example` — new secrets
- `README.md` — Upstash + cron + admin moderation docs

**Reference data (read-only alignment)**

- `frontend/data/projects.ts` — reaction id allowlist
- `frontend/data/project-portfolio.ts` — health URLs for QuickPad, FormForge
- `frontend/data/profile.ts` — `jaisehgal.com` URL

---

## 2. Plan  · owner: planner

### Chosen approach (simplest that fully satisfies scope)

#### Feature 4 — Rate limiting (build first)

**Approach:** FastAPI `Depends` dependency `check_rate_limit(scope: str)` backed by **Upstash Redis REST** via the official `upstash-redis` Python client (thin wrapper over HTTP — no persistent TCP, serverless-safe).

- **Key format:** `rl:{scope}:{ip_hash}` where `ip_hash = sha256(client_ip)[:16]` (never store raw IP in Redis).
- **Algorithm:** Upstash `@upstash/ratelimit` sliding window is a JS package — on Python, use Redis `INCR` + `EXPIRE` or Upstash's REST `pipeline` with a simple fixed-window counter per scope (good enough for v1). Simplest: **fixed window** via `INCR` key with TTL = window seconds; on first increment set `EXPIRE`. Slight burst at window boundaries is acceptable for a personal portfolio.
- **IP extraction:** `request.headers.get("x-forwarded-for", "").split(",")[0].strip()` or `request.client.host`.
- **Local dev:** If `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` unset, **skip rate limiting** with a warning log (same pattern as missing `RESEND_API_KEY`). Keeps local DX simple; production must set Upstash.
- **429 response:** `HTTPException(429, detail="Too many requests. Please try again later.")` + `Retry-After` header (seconds until window reset).
- **Exempt routes:** cron (`verify_cron_secret` dependency) and admin (`verify_admin_key` dependency) — do **not** attach `check_rate_limit`.

**Scopes & limits (from scope):**

| Scope key | Endpoints | Limit | Window (s) |
|-----------|-----------|-------|------------|
| `contact_write` | `POST /api/v1/contact` | 5 | 3600 |
| `guestbook_write` | `POST /api/v1/guestbook` | 3 | 3600 |
| `reactions_write` | `POST /api/v1/reactions` | 30 | 3600 |
| `public_read` | `GET /api/v1/reactions`, `GET /api/v1/guestbook`, `GET /api/v1/health/status` | 120 | 60 |

---

#### Feature 2 — Health checks

**Approach:** Single table `health_check_latest` — one row per target, **upserted** each cron run (no history table). Public read is a single `SELECT *` — simplest query path.

- **Checker:** `httpx.AsyncClient` with 10s timeout; success = HTTP status 200–399.
- **Targets (hardcoded in `backend/app/services/health_checker.py`):**

| `target_key` | URL | Source |
|--------------|-----|--------|
| `jaios-api` | `{health_self_url}/health` | env `HEALTH_SELF_URL` default `https://jaisehgal.com` |
| `quickpad` | `https://quickpad.jaisehgal.com` | `project-portfolio.ts` |
| `formforge` | `https://formforge.jaisehgal.com` | `project-portfolio.ts` |
| `jaisehgal` | `https://jaisehgal.com` | profile / README |

- **Cron route:** `GET /api/v1/health/cron` protected by `Authorization: Bearer {CRON_SECRET}` (Vercel Cron auto-sends this when `CRON_SECRET` is set).
- **Parallel checks:** `asyncio.gather` with per-target try/except — one failure does not abort others.
- **Frontend:** New "Network · services" section in `SystemMonitorApp.tsx`; fetch on mount + 60s interval; skeleton → list with green/red dot, latency, relative `checked_at`.

---

#### Feature 1 — Project reactions

**Approach:** Single table `reaction_events` with **unique constraint** on `(target_type, target_id, visitor_hash)`. No separate counter table — `GET` uses `COUNT(*) GROUP BY target_id` (8 targets max, trivial).

- **Dedup:** `visitor_hash = sha256(f"{ip}|{user_agent}|{REACTION_HASH_SALT}")` hex digest; salt from env (default static dev value).
- **Idempotent POST (Q3):** `INSERT … ON CONFLICT DO NOTHING`; always return `200` with current count and `already_reacted: bool`.
- **Allowlist:** Hardcoded `frozenset` in `backend/app/constants.py` matching all 8 ids from `projects.ts`:
  - `agentic-streaming`, `payment-settlement`, `rbac-permissions`, `live-messaging`, `clinical-live-ops`, `admin-bulk-ops`, `job-portal-funnels`, `ai-in-product`
- **v1 type:** Only `target_type = "case_study"` accepted; others → `422`.
- **Frontend:** Shared `ReactionButton` component; `localStorage` key `jaios:reacted:{targetId}` for instant disabled UI; sync with server on load.

---

#### Feature 3 — Guestbook

**Approach:** Single `guestbook_entries` table; approve-before-public workflow; admin moderation via `X-Admin-Key` header (no JaiOS admin UI).

- **Placement:** New **Guestbook** app (`id: "guestbook"`) in `category: "lab"`, registered in `apps.ts`, `appRegistry.tsx`, `AppIcon.tsx` (new `messageSquare` glyph), and `LaunchpadApp.tsx` `LAUNCHER_IDS`. Separate from Contact — guestbook is public visitor messages, Contact is direct outreach.
- **Email notify:** Reuse `email.py` pattern — new `send_guestbook_notification()` called after successful `POST` (fire-and-forget, skip if no Resend key).
- **Anonymous:** `is_anonymous=true` → ignore name/email on public response; display "Anonymous".
- **Public response never includes `email`.**

---

### Approaches rejected (and why)

| Rejected | Why |
|----------|-----|
| Postgres `rate_limit_buckets` fallback | Extra table + migration + slower; Upstash is already the project narrative; skip dual-backend complexity in v1. |
| FastAPI middleware for rate limits | Dependency per route is explicit, testable, and exempts cron/admin without path-matching logic. |
| `reaction_counts` + `reaction_events` two-table design | `COUNT(*)` over ≤8 targets with sparse rows is trivial; avoids counter sync bugs. |
| `health_check_results` append-only history | Scope excludes charts/SLA; latest-only table is half the code. |
| `oldportfolio.jaisehgal.com` health target | Explicitly out of scope (Q4). |
| `409` on duplicate reaction | Scope default Q3 prefers idempotent `200` — better UX. |
| In-memory / process-local rate limits | Useless on Vercel serverless (scope constraint). |
| `@upstash/ratelimit` (JS) from Python | Wrong runtime; use `upstash-redis` Python client instead. |
| Guestbook inside Contact app | Different mental model (public wall vs private message); scope Q9 prefers standalone app. |
| Full admin UI in JaiOS | Out of scope; curl + `X-Admin-Key` is sufficient. |
| CAPTCHA / profanity filter | Out of scope. |

---

### Step-by-step implementation plan (ordered)

1. **Config & constants**
   - Add env fields to `backend/app/config.py`: Upstash, `CRON_SECRET`, `ADMIN_API_KEY`, `REACTION_HASH_SALT`, `HEALTH_SELF_URL`, rate-limit tunables.
   - Create `backend/app/constants.py` with `CASE_STUDY_IDS` frozenset and `HEALTH_TARGETS` dict.

2. **Rate limiting service**
   - Create `backend/app/services/rate_limit.py`: IP helper, Upstash client factory, `async def enforce_rate_limit(request, scope)`.
   - Create `backend/app/deps/rate_limit.py`: `def rate_limit_dep(scope: str)` returning a FastAPI dependency.

3. **Auth deps for protected routes**
   - Create `backend/app/deps/auth.py`: `verify_cron_secret`, `verify_admin_key`.

4. **Alembic migration `002_engagement_features.py`**
   - Create all three tables (schema below). Update `backend/app/models/__init__.py`.

5. **SQLAlchemy models + Pydantic schemas**
   - `models/reaction.py`, `models/health.py`, `models/guestbook.py`
   - `schemas/reaction.py`, `schemas/health.py`, `schemas/guestbook.py`

6. **Wire rate limits on existing contact route**
   - Add `Depends(rate_limit_dep("contact_write"))` to `POST /contact` in `contact.py`.

7. **Health checker + routes**
   - `services/health_checker.py` — async check + upsert logic.
   - `routers/health.py` — `GET /health/status` (public + `public_read` limit), `GET /health/cron` (cron secret only).

8. **Reactions router**
   - `routers/reactions.py` — GET + POST with allowlist validation, visitor hash, idempotent insert.

9. **Guestbook router + admin router**
   - `routers/guestbook.py` — public GET/POST.
   - `routers/admin.py` — `GET /admin/guestbook`, `PATCH /admin/guestbook/{id}` behind admin key.
   - `services/guestbook_notify.py` — Resend notification on new pending entry.

10. **Register routers in `main.py`**
    - Include health, reactions, guestbook, admin routers.
    - Extend CORS `allow_headers` to include `Authorization` (harmless; cron is server-side).

11. **Deploy config**
    - Add `crons` to `vercel.json`.
    - Update `.env.example` (all new vars).
    - Add `httpx` + `upstash-redis` to `pyproject.toml`.

12. **Frontend API layer**
    - Extend `frontend/lib/api.ts`: shared `apiFetch`, `ApiError.retryAfter`, typed functions for reactions, health, guestbook; friendly 429 message using `Retry-After`.

13. **Frontend components**
    - `ReactionButton.tsx` — shared 👍 control.
    - Wire into `CaseStudiesApp.tsx` hero area (below stack chips).
    - `SystemMonitorApp.tsx` — Services section.
    - `GuestbookApp.tsx` — list + submit form.

14. **Guestbook app registration**
    - `apps.ts` — new `guestbook` AppId + meta.
    - `appRegistry.tsx` — map component.
    - `AppIcon.tsx` — `messageSquare` glyph.
    - `LaunchpadApp.tsx` — add to `LAUNCHER_IDS`.

15. **Changelog + README**
    - New entry at top of `frontend/data/changelog.ts`.
    - Brief README section on Upstash setup, cron secret, admin moderation curl examples.

---

### Exact DB schema (migration `002_engagement_features`)

#### Table: `reaction_events`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `UUID` | PK, default `gen_random_uuid()` |
| `target_type` | `VARCHAR(32)` | NOT NULL |
| `target_id` | `VARCHAR(64)` | NOT NULL |
| `visitor_hash` | `VARCHAR(64)` | NOT NULL |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, server default `now()` |

**Indexes / constraints:**
- `UNIQUE (target_type, target_id, visitor_hash)` — name `uq_reaction_events_visitor`
- `INDEX ix_reaction_events_target` on `(target_type, target_id)` — speeds up COUNT

#### Table: `health_check_latest`

| Column | Type | Constraints |
|--------|------|-------------|
| `target_key` | `VARCHAR(32)` | PK |
| `url` | `VARCHAR(512)` | NOT NULL |
| `status` | `VARCHAR(8)` | NOT NULL — `'up'` or `'down'` |
| `status_code` | `INTEGER` | NULLABLE |
| `latency_ms` | `INTEGER` | NULLABLE |
| `error_message` | `TEXT` | NULLABLE |
| `checked_at` | `TIMESTAMPTZ` | NOT NULL |

**Indexes:** PK on `target_key` is sufficient (4 rows).

#### Table: `guestbook_entries`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `UUID` | PK, default `gen_random_uuid()` |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, server default `now()` |
| `status` | `VARCHAR(16)` | NOT NULL, default `'pending'` — enum: `pending`, `approved`, `rejected` |
| `name` | `VARCHAR(100)` | NULLABLE |
| `email` | `VARCHAR(320)` | NULLABLE |
| `message` | `VARCHAR(500)` | NOT NULL |
| `is_anonymous` | `BOOLEAN` | NOT NULL, default `false` |
| `visitor_hash` | `VARCHAR(64)` | NULLABLE — optional audit, not exposed |

**Indexes:**
- `INDEX ix_guestbook_entries_status_created` on `(status, created_at DESC)` — public list + admin pending list

---

### Exact API routes

#### Rate-limited public reads

All `GET` routes below include `Depends(rate_limit_dep("public_read"))`.

---

#### `GET /api/v1/reactions`

**Query params:**
- `target_type` (required): `"case_study"`
- `target_id` (optional): single id filter

**200 response:**
```json
{
  "target_type": "case_study",
  "counts": [
    { "target_id": "agentic-streaming", "count": 12 },
    { "target_id": "payment-settlement", "count": 3 }
  ]
}
```
- If `target_id` provided, return single-item array (or empty `count: 0` if none).
- Missing `target_type` → `422`.

---

#### `POST /api/v1/reactions`

**Rate limit:** `reactions_write`

**Body:**
```json
{ "target_type": "case_study", "target_id": "agentic-streaming" }
```

**Responses:**
- `200` — `{ "target_type": "case_study", "target_id": "...", "count": 13, "already_reacted": false }`
- `200` (duplicate) — same shape, `already_reacted: true`, count unchanged
- `422` — unknown `target_id` or invalid `target_type`
- `429` — rate limited + `Retry-After` header

---

#### `GET /api/v1/health/status`

**200 response:**
```json
{
  "services": [
    {
      "target_key": "jaios-api",
      "url": "https://jaisehgal.com/health",
      "status": "up",
      "status_code": 200,
      "latency_ms": 45,
      "error_message": null,
      "checked_at": "2026-08-06T12:00:00Z"
    }
  ]
}
```
- Empty DB (never run cron) → `200` with `services: []` (frontend shows "No data yet").
- `checked_at` ISO-8601 UTC.

---

#### `GET /api/v1/health/cron`

**Auth:** `Authorization: Bearer {CRON_SECRET}` — **no rate limit**

**200 response:**
```json
{ "checked": 4, "results": [ { "target_key": "quickpad", "status": "up", "latency_ms": 120 } ] }
```

**401** — missing/invalid secret

---

#### `POST /api/v1/guestbook`

**Rate limit:** `guestbook_write`

**Body:**
```json
{
  "message": "Great portfolio!",
  "name": "Alex",
  "email": "alex@example.com",
  "is_anonymous": false
}
```
- `message` required, 1–500 chars.
- If `is_anonymous: true`, name/email ignored (stored as NULL).
- If not anonymous, `name` optional (display "Anonymous" if blank), `email` optional.

**201 response:**
```json
{ "id": "uuid", "status": "pending", "message": "Thanks — your message is awaiting moderation." }
```
(message field in response is a static confirmation string, not the entry text)

**422** — validation errors  
**429** — rate limited

---

#### `GET /api/v1/guestbook`

**Query:** `limit` (default 20, max 50), `offset` (default 0)

**200 response:**
```json
{
  "items": [
    { "id": "uuid", "created_at": "...", "name": "Alex", "message": "Great portfolio!" }
  ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```
- Approved only; `email` never included; anonymous entries → `"name": "Anonymous"`.

---

#### `GET /api/v1/admin/guestbook`

**Auth:** `X-Admin-Key: {ADMIN_API_KEY}` — **no rate limit**

**Query:** `status` (default `pending`) — `pending` | `approved` | `rejected`

**200 response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "created_at": "...",
      "status": "pending",
      "name": "Alex",
      "email": "alex@example.com",
      "message": "...",
      "is_anonymous": false
    }
  ]
}
```

**401** — invalid key

---

#### `PATCH /api/v1/admin/guestbook/{id}`

**Auth:** `X-Admin-Key`

**Body:** `{ "status": "approved" }` or `{ "status": "rejected" }`

**200 response:** full admin item shape  
**404** — unknown id  
**422** — invalid status value

---

#### `POST /api/v1/contact` (existing — add rate limit only)

**Rate limit:** `contact_write` — behavior unchanged otherwise.

---

### Rate limit implementation detail

**Library:** `upstash-redis` (PyPI) — REST-native, no connection pool.

**Pattern:**
```python
# backend/app/deps/rate_limit.py
def rate_limit_dep(scope: str):
    async def _dep(request: Request) -> None:
        await enforce_rate_limit(request, scope)
    return _dep
```

**`enforce_rate_limit` logic:**
1. If Upstash env unset → return (dev skip).
2. Resolve client IP → hash.
3. Key = `f"rl:{scope}:{ip_hash}"`.
4. `count = redis.incr(key)`; if `count == 1`: `redis.expire(key, window_seconds)`.
5. If `count > limit`: compute `retry_after = redis.ttl(key)` (fallback to `window_seconds`), raise 429 with `Retry-After` header.

**Router usage:**
```python
@router.post("/guestbook", dependencies=[Depends(rate_limit_dep("guestbook_write"))])
```

For GET routes, same pattern with `public_read` scope.

---

### Health cron — vercel.json + validation + httpx

**`vercel.json` addition:**
```json
"crons": [
  { "path": "/api/v1/health/cron", "schedule": "*/5 * * * *" }
]
```
(Rewrite `/api/v1/:path*` → `/api` already handles routing.)

**Cron validation (`deps/auth.py`):**
```python
async def verify_cron_secret(authorization: str | None = Header(None)) -> None:
    settings = get_settings()
    if not settings.cron_secret:
        raise HTTPException(503, "Cron not configured")
    if authorization != f"Bearer {settings.cron_secret}":
        raise HTTPException(401, "Unauthorized")
```

**httpx usage (`health_checker.py`):**
```python
async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
    start = time.perf_counter()
    try:
        resp = await client.get(url)
        latency_ms = int((time.perf_counter() - start) * 1000)
        status = "up" if 200 <= resp.status_code < 400 else "down"
        ...
    except httpx.HTTPError as e:
        status = "down"
        error_message = str(e)[:500]
```

**Local test:** `curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:8000/api/v1/health/cron`

---

### Guestbook admin — `X-Admin-Key` pattern

```python
async def verify_admin_key(x_admin_key: str = Header(..., alias="X-Admin-Key")) -> None:
    settings = get_settings()
    if not settings.admin_api_key or x_admin_key != settings.admin_api_key:
        raise HTTPException(401, "Unauthorized")
```

**Moderation curl examples (document in README):**
```bash
# List pending
curl -H "X-Admin-Key: $ADMIN_API_KEY" "$API/api/v1/admin/guestbook?status=pending"

# Approve
curl -X PATCH -H "X-Admin-Key: $ADMIN_API_KEY" -H "Content-Type: application/json" \
  -d '{"status":"approved"}' "$API/api/v1/admin/guestbook/{id}"
```

---

### Frontend components

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `ReactionButton` | `frontend/components/reactions/ReactionButton.tsx` | 👍 + count; props: `targetType`, `targetId`; loads count on mount; optimistic increment; `localStorage` `jaios:reacted:{targetId}`; disabled + filled state when reacted; toast on error/429 |
| `CaseStudiesApp` | modify | Place `ReactionButton` in hero (below stack chips) for `activeId` |
| `ServicesHealth` (inline or sub-component) | inside `SystemMonitorApp.tsx` | Fetch `getHealthStatus()` on mount; 60s `setInterval` refresh; skeleton rows; green/red `Circle` icon; format latency + relative time via `Intl.RelativeTimeFormat` or simple helper; fallback text if fetch fails |
| `GuestbookApp` | `frontend/components/apps/GuestbookApp.tsx` | `AppScroll` layout; approved messages list (paginated "Load more"); submit form (message required, name/email optional, anonymous checkbox); states: idle/submitting/success/error; success copy: "Thanks — pending moderation"; mirror `ContactForm` input classes |

**Guestbook registration:**
- `AppId`: add `"guestbook"`
- `apps.ts`: `{ id: "guestbook", name: "Guestbook", shortName: "Guestbook", icon: "messageSquare", accent: "amber", category: "lab", description: "Leave a note on the wall", defaultSize: { w: 560, h: 580 }, inDock: false, onDesktop: false }`
- `LaunchpadApp.tsx`: add `"guestbook"` to `LAUNCHER_IDS`

---

### Files to create / change (exhaustive)

**Create — backend:**
- `backend/app/constants.py`
- `backend/app/deps/__init__.py`
- `backend/app/deps/auth.py`
- `backend/app/deps/rate_limit.py`
- `backend/app/models/reaction.py`
- `backend/app/models/health.py`
- `backend/app/models/guestbook.py`
- `backend/app/schemas/reaction.py`
- `backend/app/schemas/health.py`
- `backend/app/schemas/guestbook.py`
- `backend/app/services/rate_limit.py`
- `backend/app/services/health_checker.py`
- `backend/app/services/guestbook_notify.py`
- `backend/app/routers/reactions.py`
- `backend/app/routers/health.py`
- `backend/app/routers/guestbook.py`
- `backend/app/routers/admin.py`
- `backend/alembic/versions/002_engagement_features.py`

**Change — backend:**
- `backend/app/config.py` — new settings
- `backend/app/main.py` — register routers, CORS headers
- `backend/app/models/__init__.py` — export new models
- `backend/app/routers/contact.py` — rate limit dependency
- `pyproject.toml` — add `httpx`, `upstash-redis`

**Create — frontend:**
- `frontend/components/reactions/ReactionButton.tsx`
- `frontend/components/apps/GuestbookApp.tsx`

**Change — frontend:**
- `frontend/lib/api.ts` — new clients + 429 handling
- `frontend/components/apps/CaseStudiesApp.tsx` — ReactionButton
- `frontend/components/apps/SystemMonitorApp.tsx` — services section
- `frontend/data/apps.ts` — guestbook AppId + meta
- `frontend/components/os/appRegistry.tsx` — GuestbookApp import/map
- `frontend/components/os/AppIcon.tsx` — `messageSquare` glyph
- `frontend/components/apps/LaunchpadApp.tsx` — LAUNCHER_IDS
- `frontend/data/changelog.ts` — ship entry

**Change — config / docs:**
- `vercel.json` — crons array
- `.env.example` — new env vars
- `README.md` — Upstash, cron, admin moderation section

**No change expected:**
- `api/index.py`
- `backend/app/database.py`
- `frontend/components/apps/ProjectsApp.tsx` (optional follow-up; not required for acceptance)

---

### New dependencies

| Package | Where | Why |
|---------|-------|-----|
| `httpx>=0.27` | `pyproject.toml` | Async HTTP health checks |
| `upstash-redis>=1.0` | `pyproject.toml` | Serverless-safe rate limit counters |

**npm:** none — use existing `fetch`, `lucide-react`, OS store toasts.

---

### Risks & tricky bits

1. **Upstash not configured in production** — writes become unprotected; document clearly in README + Vercel env checklist.
2. **`X-Forwarded-For` spoofing locally** — only trusted on Vercel; acceptable for portfolio-grade limits.
3. **Reaction dedup vs NAT** — multiple users behind same IP share one vote; acceptable v1 trade-off per scope.
4. **Cron cold start + 4 sequential HTTP checks** — parallel `gather` keeps under 30s `maxDuration`; monitor if FormForge/QuickPad are slow.
5. **`jaios-api` self-check loop** — cron invokes own deployment; ensure `/health` rewrite works and does not recurse into cron route (it won't — different path).
6. **Empty health table before first cron** — frontend must handle `services: []` gracefully.
7. **CORS `allow_methods`** — currently `GET, POST` only; admin `PATCH` is curl-only (no browser CORS needed). If testing admin from browser console on same origin, `/api` rewrite handles it server-side.
8. **Guestbook email on anonymous submit** — notification should say "Anonymous" when `is_anonymous`.
9. **Migration on Neon** — run via existing Alembic workflow before deploy.
10. **localStorage vs server dedup mismatch** — if user clears storage, server still returns `already_reacted: true`; UI should trust server response over localStorage on POST response.

---

### Env vars to add to `.env.example`

```bash
# --- Upstash Redis (rate limiting) — https://console.upstash.com ---
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...

# --- Cron (Vercel auto-sends Authorization: Bearer) ---
CRON_SECRET=generate-a-long-random-string

# --- Guestbook admin moderation (curl / HTTPie) ---
ADMIN_API_KEY=generate-a-long-random-string

# --- Reactions visitor fingerprint salt (change in production) ---
REACTION_HASH_SALT=change-me-in-production

# --- Health self-check base URL (no trailing slash) ---
HEALTH_SELF_URL=https://jaisehgal.com
```

**Optional tunables (implementer may add to `config.py` with defaults, document if exposed):**
- `RATE_LIMIT_CONTACT=5`, `RATE_LIMIT_GUESTBOOK=3`, `RATE_LIMIT_REACTIONS=30`, `RATE_LIMIT_PUBLIC_READ=120`
- Window seconds per scope (defaults: 3600 for writes, 60 for reads)

**Vercel dashboard (production only — comment in `.env.example`):**
- Set all above + existing `DATABASE_URL`, `RESEND_*`, `CORS_ORIGINS`
- `CRON_SECRET` must match Vercel Cron auth behavior

---

## 3. Implementation  · owner: implementer

- **What was built (summary):**
  - Upstash Redis rate limiting on contact, guestbook, reactions writes + public reads
  - Health cron (`GET /api/v1/health/cron`) + status API + System Monitor Services section
  - Case-study reactions with idempotent POST + ReactionButton in Case Studies
  - Guestbook with approve-before-public workflow, admin API, Resend notify, Launchpad app
  - Alembic migration `002_engagement_features` (3 tables)
  - `vercel.json` cron every 5 minutes
- **Files changed:** See plan file list — all backend routers/models/schemas/services/deps + frontend api.ts, ReactionButton, GuestbookApp, CaseStudiesApp, SystemMonitorApp, apps registration, changelog
- **Notable decisions / deviations from plan:** None significant
- **Anything left as TODO / follow-up:**
  - Run `alembic upgrade head` on Neon before deploy
  - Set Upstash, CRON_SECRET, ADMIN_API_KEY on Vercel
  - Manually trigger cron once or wait 5m for health data

---

## 4. Testing  · owner: tester

- **Commands run:**
  - `pnpm typecheck` → ✅ pass
  - `pnpm lint` → ✅ pass
  - `pnpm build` → ✅ pass
  - `pytest backend/tests/test_engagement_api.py` (PYTHONPATH=backend) → ✅ 9/9 pass
  - FastAPI import (`app.main`) → ✅ 10 routes registered
  - Neon schema check → ✅ `reaction_events`, `health_check_latest`, `guestbook_entries` exist (migration applied)
  - Production `GET /health` → ✅ 200 `{"status":"ok"}`
  - Production `GET /api/v1/reactions` → ⚠️ 404 (new API not deployed yet)
- **Manual checks performed:**
  - Neon `guestbook_entries` columns match schema (id, status, name, email, message, is_anonymous, visitor_hash)
  - Docker Postgres unavailable locally (daemon not running) — could not run alembic against local DB
- **Edge cases verified (via pytest):**
  - Missing `target_type` on reactions GET → 422
  - Invalid `target_type` / `target_id` → 422
  - Health cron without Bearer token → 401/503
  - Admin guestbook without `X-Admin-Key` → 422
  - Empty guestbook message → 422
  - `CASE_STUDY_IDS` count = 8
- **Bugs found & status:** None blocking; production deploy pending for live API smoke tests
- **Result:** ✅ pass (pre-deploy); post-deploy re-check reactions/health/guestbook endpoints required

---

## 5. Impact / Regression  · owner: impact-checker

*(Not written.)*

---

## 6. Ship  · owner: shipper

*(Not written.)*
