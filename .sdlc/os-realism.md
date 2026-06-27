# Task: Real-OS realism pack (5 features)

- **Slug:** os-realism
- **Status:** shipped (live visual pending)
- **One-line goal:** Make JaiOS feel like a real operating system: sounds, Control Center, window snapping/edge-resize/genie, and an app switcher + global shortcuts.

## Shipped
1. **UI sound design** — `lib/sounds.ts` synthesizes short Web-Audio blips (open/close/minimize/toggle/notify/error/boot); no asset files, AudioContext resumed on first gesture. Wired through the store actions (open/close/minimize windows, theme/wallpaper/accent toggles, toasts+notifications, crash, login chime). `soundEnabled` persisted; honored everywhere; DND mutes notification sounds.
2. **Control Center** — clicking the menu-bar Wi-Fi/battery cluster opens `ControlCenter.tsx`: Dark / Focus(DND) / Sound tiles, a **Brightness slider that dims the whole screen** (overlay in `JaiOS`), and quick Wallpaper + Accent switchers. Store: `controlCenterOpen`, `brightness`, `dnd`, `soundEnabled` (+ persistence).
3. **Window realism** — `Window.tsx`: resize from **all 8 edges/corners**; **drag-snapping** (top → maximize, sides → half-tile) with a live accent preview; **genie** open/minimize/close animation (scale + rise from toward the dock).
4. **App switcher** — `AppSwitcher.tsx`: ⌘/Ctrl+Tab cycles open windows (Shift to reverse), release to commit. (Some browsers reserve Ctrl/⌘+Tab; the TopBar "Window" menu is the reliable fallback.)
5. **Global shortcuts** — `use-keyboard-shortcuts.ts`: ⌘K Spotlight, ⌘, Settings, ⌘W close, ⌘M minimize, ⌘1–4 Dossier sections.

## Tests
- typecheck + lint + `next build` (9/9): pass. Live verification on the dev server pending (browser tooling unavailable this session).

## Notes / follow-ups
- ⌘/Ctrl+Tab reliability depends on the browser. Next realism batch (suggested earlier): session persistence, dynamic menu bar, Trash, Mission Control, lock/idle screensaver.
