# Task: Cloudflare Turnstile on open routes

- **Slug:** turnstile-protection
- **Created:** 2026-08-25
- **Status:** implementing
- **One-line goal:** Protect all public write endpoints and admin login with Cloudflare Turnstile verification.

---

## 1. Scope  · owner: scope-analyst

- **Problem / request:** Add Cloudflare Turnstile to all open/public routes that need abuse protection.
- **Why it matters:** Rate limiting alone is insufficient; Turnstile blocks automated spam on contact, guestbook, reactions, and admin login.
- **In scope:** POST contact, guestbook, reactions; admin login (frontend + backend). Reusable widget + server-side verification.
- **Out of scope:** GET read endpoints, health checks, cron, embed-check.
- **Acceptance criteria:**
  - [ ] Turnstile widget on contact, guestbook, admin login forms
  - [ ] Invisible Turnstile on reaction clicks
  - [ ] Backend verifies token on all public write endpoints when secret key is set
  - [ ] Dev works without keys (verification skipped)
- **Files:** backend services/deps/schemas/routers, frontend components + api.ts, .env.example

---

## 2. Plan  · owner: planner

- **Approach:** Server-side verify via Cloudflare siteverify API; optional env keys (skip when unset, like rate limiting).
- **Steps:** config → turnstile service → schema fields → router verification → TurnstileWidget → integrate forms.

---

## 3. Implementation  · owner: implementer

- **What was built:** Turnstile on contact, guestbook, reactions (invisible), admin login. Backend siteverify service; skipped when `TURNSTILE_SECRET_KEY` unset.
- **Files changed:** backend config/schemas/routers/services, frontend TurnstileWidget + forms, .env.example
- **Result:** typecheck + lint pass

