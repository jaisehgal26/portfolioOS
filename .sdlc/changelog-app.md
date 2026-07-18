# Task: Changelog / Timeline app (F12)

- **Slug:** changelog-app
- **Created:** 2026-07-19
- **Status:** shipped
- **One-line goal:** Standalone Changelog app showing when and what shipped in JaiOS — static timeline, filters, Launchpad + Spotlight.

---

## 1. Scope  · owner: scope-analyst

- **Problem / request:** Recruiters need to see JaiOS evolves over time; no shipped-history surface exists.
- **Why it matters:** Proves consistency, iteration, and maintenance mindset.
- **In scope:**
  - `data/changelog.ts` with 8+ curated entries
  - `ChangelogApp` — vertical timeline, filter chips, expandable cards
  - Register app in apps.ts, appRegistry, AppIcon, Launchpad
  - Offline-safe static data
- **Out of scope:** Git auto-gen, Finder section, localStorage read state, Terminal command (F01)
- **Acceptance criteria:**
  - [ ] 8+ seed entries
  - [ ] Filter chips work
  - [ ] Expand/collapse + optional open-app link
  - [ ] Launchpad + Spotlight discoverable
  - [ ] typecheck + build pass
- **Files & areas likely involved:** `data/changelog.ts`, `ChangelogApp.tsx`, `data/apps.ts`, `appRegistry.tsx`, `AppIcon.tsx`, `LaunchpadApp.tsx`

---

## 2. Plan  · owner: planner

- **Chosen approach:** Static data file + single scroll timeline UI; standalone app (not Finder section).
- **Step-by-step plan:**
  1. Define types + seed data in `data/changelog.ts`
  2. Register `changelog` app id
  3. Build `ChangelogApp.tsx` with filters and expandable timeline cards
  4. Wire Launchpad; Spotlight auto-includes non-folded apps
  5. Test and mark roadmap F12 complete

---

## 3. Implementation  · owner: implementer

- **What was built (summary):** Changelog app with vertical timeline, tag filter chips, expandable entry cards, related-app links. 9 seed entries in `data/changelog.ts`. Registered as standalone system app in Launchpad + Spotlight.
- **Files changed:** `data/changelog.ts`, `components/apps/ChangelogApp.tsx`, `data/apps.ts`, `appRegistry.tsx`, `AppIcon.tsx`, `LaunchpadApp.tsx`, `.sdlc/changelog-app.md`, `.sdlc/jaios-feature-roadmap.md`

---

## 4. Testing  · owner: tester

- **Commands run:** `pnpm typecheck` ✅ · `pnpm build` ✅
- **Manual checks:** Launchpad opens Changelog; filter chips; expand/collapse; Open app button
- **Result:** ✅ pass

---

## 5. Impact / Regression  · owner: impact-checker

- **Result:** ✅ no regressions — additive app registration only

---

## 6. Ship  · owner: shipper

- **Suggested commit message:** `feat: add Changelog timeline app (F12)`
- **Status:** shipped ✅
