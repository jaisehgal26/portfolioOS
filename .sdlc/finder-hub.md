# Task: Unify the portfolio into one Finder hub

- **Slug:** finder-hub
- **Status:** shipped
- **One-line goal:** Remove the nine standalone section apps and surface everything through a single macOS-style Finder with a section tree on the left and content on the right — so it feels like one OS.

## 1. Scope
- Fold About, Work (Projects+Case Studies), Experience, Skills, Notes, Resume, Quick Hire, UI Gallery, Contact into one Finder.
- Left tree: parents (Work/Experience/Skills/Notes) expand to children; leaves jump straight to content. Breadcrumb on top. Content renders inline (no extra windows).
- Reuse the existing polished section UIs.
- Desktop shows just Finder; dock keeps Finder + Browser + Terminal + Settings.

## 2. Plan
- Extract reusable detail views from the rich apps: `ProjectDetail` (ProjectsApp), `ExperienceDetail` (ExperienceApp), `ResumeDocument` (ResumeApp, stacked, no inner sidebar).
- Store: `finderSection` + `openFinderAt(section)` (mirrors `openFile`); FinderApp consumes it and clears it.
- Rebuild `FinderApp` as tree + breadcrumb + content router (About/Skills/Resume/QuickHire/UIGallery/Contact rendered whole; Work/Experience via detail views; Skills group + Notes rendered inline).
- `data/apps.ts`: set the 9 apps `inDock:false,onDesktop:false`; Finder → `onDesktop:true`, renamed "Portfolio".
- Re-point entry points to `openFinderAt`: ContextMenu, TopBar (JaiOS + Help menus), DesktopWidgets profile, Spotlight (new "Sections" group; folded apps hidden from the Apps list). Mobile desktop grid limited to real apps.

## 3. Implementation
- New/!changed: `FinderApp.tsx` (rebuilt hub), `ProjectsApp.tsx` (+`ProjectDetail`), `ExperienceApp.tsx` (+`ExperienceDetail`), `ResumeApp.tsx` (+`ResumeDocument`), `store/os-store.ts`, `data/apps.ts`, `ContextMenu.tsx`, `TopBar.tsx`, `DesktopWidgets.tsx`, `Spotlight.tsx`, `Desktop.tsx`.

## 4. Testing
- typecheck + lint + `next build` (9/9 pages): pass.
- Live verification on dev server (browser tooling unavailable this session) — pending a manual look.

## 5. Impact / Regression
- The 9 components remain registered/functional (used by the Finder + still openable if ever called), so nothing breaks; they're just no longer surfaced as separate icons. Entry points route to `openFinderAt`. Easter eggs (Terminal/Snake/Secret/Crash) and system apps unaffected. Desktop drop/Text Viewer infra remains but is dormant.

## 6. Ship
- Status: shipped ✅ (pending your visual confirmation on :3060).
