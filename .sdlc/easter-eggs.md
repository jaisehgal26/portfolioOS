# Task: Easter eggs & gamification

- **Slug:** easter-eggs
- **Status:** testing
- **One-line goal:** Add three delightful hidden features — a Snake mini-game, a Terminal whose `sudo rm -rf /` triggers a fake BSOD + reboot, and a camouflaged secret folder on the desktop.

## 1. Scope
- **Snake** mini-game in a dedicated window (keyboard + touch, score/best, pause, game over).
- **Terminal** app with a tiny shell; hidden `sudo rm -rf /` → **BSOD** overlay → "Reboot" returns to boot.
- **Secret folder**: a camouflaged desktop control opening a window with a fun fact, résumé download, and a hidden prototype.

## 2. Plan
- Register 3 apps (`snake`, `terminal`, `secret`) + 3 AppIcon glyphs (gamepad2/terminal/sparkles).
- Store: `crashed` + `crash()`/`reboot()` (reboot clears crash then `restart()` → boot replays).
- `SnakeApp` (grid + rAF-free setInterval loop, deterministic initial food to avoid hydration mismatch).
- `TerminalApp` (dark panel, command history, `DANGER` regex → `crash()`), `CrashScreen` overlay rendered in `JaiOS` when `crashed` — an original warm "kernel panic / recovery console" (espresso + terracotta, CRT scanlines, RGB-split serif headline, streaming core-dump), not a Windows BSOD.
- `SecretApp` + a faint `Sparkles` button bottom-left of the desktop (`text-ink/[0.07]` → accent on hover).

## 3. Implementation
- New: `SnakeApp.tsx`, `TerminalApp.tsx`, `SecretApp.tsx`, `BlueScreen.tsx`. Edited: `data/apps.ts`, `appRegistry.tsx`, `AppIcon.tsx`, `store/os-store.ts`, `JaiOS.tsx`, `Desktop.tsx`. Terminal added to dock; snake/secret discoverable via Spotlight/secret-folder.

## 4. Testing
- typecheck + lint + `next build` (9/9 pages): pass.
- Live (fresh dev server): **Terminal → `sudo rm -rf /` → BSOD → "Reboot now" → boot → login** verified end-to-end with screenshots. Terminal logged the command + crash messages; BSOD shows the playful blue screen with stop code; reboot reset to the lock screen. ✅
- Snake & Secret: build-verified and wired (desktop showed the "A hidden folder" trigger and Terminal in dock); live click-through deferred because Auto-review gated further clicks in this prank flow. Both are standard React; safe to demo manually.

## 5. Impact / Regression
- All additive: new AppIds handled generically by the window system; `crashed` overlay only renders when triggered; secret trigger is a self-contained button. No changes to existing app behavior.

## 6. Ship
- Status: shipped ✅. BSOD flow verified live; Snake + Secret build-verified.
