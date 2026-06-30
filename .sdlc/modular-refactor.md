# Modular Refactor — Design Doc (JaiOS)

Status: APPROVED (awaiting go-ahead to start Phase 1)

## Decisions (locked)
- Tooling: **pnpm workspaces + Turborepo**
- Apps granularity: **single `@jaios/apps` package**, modular internally (split later if needed)
- Package namespace: **`@jaios/*`**
- Internal packages only (not published); consumed as TypeScript source, transpiled by Next.

## 1. Goal & principles
- One deployable **shell**: a thin Next.js app that only wires things together.
- Everything else = internal workspace packages, split **by dependency layer** so the
  graph is a DAG (no cycles). Multiple portfolio variations can reuse the same packages
  behind a different shell.
- Simplicity first; each migration step must typecheck + lint + build green before the next.

## 2. Packages (leaf -> root)

| Package | Responsibility | Contains (from today) | Depends on |
|---|---|---|---|
| `@jaios/content` | Single source of truth: portfolio data, no React | `data/content.json`, `content.ts`, profile/projects/experience/skills/notes, `files.ts` | — |
| `@jaios/tailwind-config` | Shared Tailwind preset + tokens | `tailwind.config.ts` theme/colors | — |
| `@jaios/ui` | Design-system primitives + brand atoms + `cn` + `globals.css` | `components/ui/*`, `lib/utils.ts`, brand atoms (`AppIcon`, `JaiLogo`, `Monogram`, `WatchDial`) | react, tailwind-config, (type-only) kernel |
| `@jaios/kernel` | OS platform: state, contracts, platform utils | `store/os-store.ts`, `data/apps.ts` (AppId/AppMeta/APPS), `notifications.ts`, `system.ts`, `sections.ts`, `hooks/*`, `lib/{sounds,accent,download}.ts` | react, zustand, content |
| `@jaios/apps` | Application UIs (window contents) | `components/apps/*`, `components/cards/*`, `data/ui-states.ts` | ui, kernel, content |
| `@jaios/shell` | OS chrome + window manager + app registry | `components/os/*` + `appRegistry.tsx` | kernel, ui, apps, content |
| `apps/web` | Next.js shell app (only deployable) | `app/*` (routes, layout, SEO, JSON-LD, manifest, robots, sitemap, og-image, icons), `public/`, configs | shell, content, ui |

Terminal/Snake/Secret stay inside `@jaios/apps` for now; boundaries allow promoting any
app to its own package later without a rewrite.

## 3. Dependency graph (must stay acyclic)
```
apps/web -> shell, content, ui
shell    -> apps, kernel, ui, content
apps     -> ui, kernel, content
kernel   -> content
ui       -> tailwind-config, (type-only) kernel
content  -> (none)
```
Imports may only point downward. Enforce with ESLint `import/no-cycle`.

## 4. Cycle to break
Today `LaunchpadApp`/`Spotlight` import `AppIcon` from `components/os/` (apps -> shell) while
shell -> apps. Fix: move shared visual atoms (`AppIcon`, `JaiLogo`, `Monogram`, `WatchDial`)
into `@jaios/ui`. `AppIcon` takes `AppMeta` via a **type-only** import from `@jaios/kernel`
(no runtime dependency). The store imports app **metadata** (`apps.ts`), not app
**components** (mapped in `shell/appRegistry.tsx`), so kernel<->apps stays acyclic.

## 5. Repo layout
```
/
  apps/web/                  # Next.js app
  packages/
    content/                 # @jaios/content
    ui/                      # @jaios/ui (+ globals.css, brand atoms)
    kernel/                  # @jaios/kernel
    apps/                    # @jaios/apps
    shell/                   # @jaios/shell
    tailwind-config/         # @jaios/tailwind-config
    tsconfig/                # @jaios/tsconfig (shared base)
  pnpm-workspace.yaml
  turbo.json
  package.json
```

## 6. Tooling
- pnpm workspaces + Turborepo (cached `build`/`lint`/`typecheck`).
- Base `@jaios/tsconfig`; resolve via package names (`@jaios/*`) replacing `@/*`.
- `apps/web/next.config.mjs`: `transpilePackages: ["@jaios/ui","@jaios/kernel","@jaios/apps","@jaios/shell","@jaios/content"]`.
- Tailwind: preset in `@jaios/tailwind-config`; `apps/web` content globs scan `../../packages/**/*.{ts,tsx}`; `globals.css` lives in `@jaios/ui`.
- Preserve `"use client"` per file. Each package: `exports` map, react/react-dom as peerDependencies, `private: true`.

## 7. Migration plan (each phase ships green)
1. Scaffold monorepo (pnpm + turbo); move current app into `apps/web` unchanged. Verify.
2. Extract `@jaios/content`. Repoint imports. Verify.
3. Extract `@jaios/tailwind-config` + `@jaios/ui` (primitives, cn, globals, brand atoms). Verify.
4. Extract `@jaios/kernel` (store, hooks, platform data, lib). Verify.
5. Extract `@jaios/apps` (apps + cards + ui-states); break AppIcon cycle. Verify.
6. Extract `@jaios/shell` (os/* + appRegistry). Verify.
7. Slim `apps/web` to routes + SEO + `<JaiOS/>`. Full verify, then ship.

Work on branch `refactor/monorepo`; one commit per phase.

## 8. Risks & mitigations
- Import churn (~95 files) -> mechanical per phase, `tsc` gate each step.
- Cycles -> AppIcon move + `import/no-cycle`.
- Tailwind not scanning packages -> shared preset + content globs (catch in phase 3).
- OneDrive heaviness -> keep in-memory webpack cache; ideally move repo out of OneDrive.
- Effort: bounded; mostly moves + import rewrites, minimal logic change.
