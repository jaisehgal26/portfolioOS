# JaiBrowser — browser-themed sibling shell (handoff)

## What shipped
A second, login-selectable experience (`@jaios/browser-shell`) where the portfolio behaves like a web browser. Selectable at login alongside the macOS `@jaios/shell`. A neutral composition root (`apps/web/components/Root.tsx`) owns boot/login/global chrome and branches OS vs Browser on a persisted `shellMode`.

## Architecture
- `os-store` gains `shellMode: "os" | "browser"` (+ `setShellMode`), persisted/hydrated under `jaios-prefs`.
- URL helpers extracted to `@jaios/kernel/lib/url` (`normalizeUrl`/`hostOf`/`favicon`), shared by the OS `BrowserApp` and the new shell.
- `@jaios/shell` split: `OSShell` (desktop only) + re-exports `BootScreen`/`LoginScreen`/`CrashScreen`. `JaiOS.tsx` removed.
- New `useBrowserStore` (`@jaios/kernel/browser-store`): tabs (URL-history only; titles derived in UI), bookmarks, global history, downloads, devtools layout, incognito, bookmarks bar. Persists under `jaios-browser*` keys.
- Dependency graph stays acyclic: `web → {shell, browser-shell, content, ui, kernel}`; `browser-shell → {kernel, ui, content}` only.

## Features
- Login world chooser (radiogroup, keyboard nav, persisted default).
- Chrome: tab strip, nav controls, omnibox (internal/external/search routing + bookmark star + Cmd/Ctrl+L), bookmarks bar, kebab menu, downloads button, device toolbar.
- Internal `jai://` pages from `@jaios/content`: home (New Tab), about, projects (+`:id` case study), experience, skills, notes (+`:id`), resume (real download), contact, search results, settings, bookmarks, history, downloads, 404.
- External URLs render in a sandboxed iframe.
- DevTools (F12 / Cmd-Ctrl+Shift+I, dock bottom/right, resizable, persisted): Console (curated `jai.*` API, input history, expandable object trees, navigation logs, `rm -rf` crash egg), Network (deterministic waterfall whose XHR previews are the real content JSON; throttling scales timings), Elements (live DOM walk, highlight overlay, inspect picker, computed Styles pane), Sources (content `fileTree` viewer), Application (real localStorage), Lighthouse (animated gauges).
- Easter eggs: incognito, 404 console hint, console greeting, `rm -rf /` crash.
- Find-in-page (Ctrl/Cmd+F), Alt+←/→ back/forward. Reserved browser shortcuts (Cmd+W/R/Tab) are intentionally not hijacked.

## Verification
`pnpm typecheck`, `pnpm lint`, `pnpm build` all green. Production server smoke-tested: `/` → 200 with OS markup, `/sitemap.xml` → 200. No OS regressions.

## Notes
- Turbo caches `.next/**`; on OneDrive a restored cache can miss vendor chunks and 500 at runtime. Fix locally with `rm -rf apps/web/.next .turbo && pnpm --filter web exec next build`. Vercel builds fresh, so deploys are unaffected.
