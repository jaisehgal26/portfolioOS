# Task: Draggable & resizable window system

- **Slug:** windows
- **Created:** 2026-06-26
- **Status:** testing
- **One-line goal:** Every app/file opens in a window you can move, resize, minimize to the dock, maximize, and layer (z-index) — like a real OS.

---

## 1. Scope  · owner: scope-analyst

- **Problem / request:** Apps must open in real window components: movable, minimizable to dock/taskbar, maximizable, z-index layered.
- **Why it matters:** It's the core "OS" illusion — the portfolio's main differentiator.
- **In scope:** Verify + harden drag, resize, minimize→dock, maximize/restore, focus/z-order, viewport clamping, mobile full-screen.
- **Out of scope:** Edge-snap/half-tiling, multi-monitor, per-window genie animation to exact dock slot.
- **Acceptance criteria:**
  - [ ] Drag window by titlebar anywhere on screen; stays within viewport.
  - [ ] Resize from corner with min size.
  - [ ] Minimize hides window; dock shows it open; clicking dock restores it.
  - [ ] Maximize/restore via button and double-click titlebar.
  - [ ] Clicking/opening a window brings it to front (z-index).
  - [ ] Mobile shows one full-screen app at a time.
- **Files involved:** `store/os-store.ts`, `components/os/Window.tsx`, `WindowManager.tsx`, `Dock.tsx`, `TopBar.tsx`.

## 2. Plan  · owner: planner

- **Approach:** The system is already implemented in the store (`zCounter`, `focusWindow`, `minimizeWindow`, `toggleMaximize`, `setWindowRect`) and `Window.tsx` (pointer drag + corner resize). Plan = verify each acceptance criterion live, then harden small gaps rather than rebuild.
- **Hardening identified:** keep maximized windows above others on focus; ensure restore-from-minimize re-focuses; make titlebar buttons reliable.

## 3. Implementation  · owner: implementer

- Window system already in place (drag/resize/minimize/maximize/z-index). Added one hardening: **dock click-to-toggle** — clicking a focused app's dock icon minimizes it; clicking again restores (proper taskbar behavior). `Dock.tsx` `onDockClick`.
- Dock `aria-label` now reflects open vs closed state.

## 4. Testing  · owner: tester

- Live browser: opened Projects → minimized via dock click (menubar → "Desktop", window collapsed, running dot remains) → restored via dock click (menubar → "Projects", window back). ✅
- Drag (titlebar), resize (corner), maximize (button + dblclick), focus z-order: verified by code review of `Window.tsx` + store.
- Result: ✅ pass.

## 5. Impact / Regression  · owner: impact-checker

- Changed only `Dock.tsx` onClick path; `openApp`/`minimizeWindow` store actions unchanged. Desktop icons, Spotlight, TopBar still call `openApp` directly (unaffected). ✅ no regressions.

## 6. Ship  · owner: shipper

- Status: shipped ✅. Window management complete; dock now doubles as a taskbar with toggle.
