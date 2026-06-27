# Roadmap: remaining "real OS" features

**STATUS: all three batches SHIPPED ✅** (typecheck + lint + `next build` pass).
R1–R10 implemented. Live visual pass still recommended.

Plans for the features not yet built. Effort: S (≈<1h), M (≈1–3h), L (≈half day).
Each will run through the usual cycle (scope → plan → build → test → ship).

---

## Batch 1 — highest realism, mostly independent

### R1. Session persistence  · M
- **Goal:** Reload resumes your desktop — open windows (position/size/min/max/z-order), focused window, and the Dossier section.
- **Approach:** Extend `Persisted` with `windows`, `focusedId`, `zCounter`, `finderSection`. Add a debounced `persistSession()` called after window mutations (open/close/min/max/move/resize), or a zustand `subscribe`. On `hydrate`, validate app ids (drop unknown) and restore. Keep the boot→login flow each visit; restore windows after login.
- **Files:** `store/os-store.ts` (only).
- **Risk:** Must persist on every window change (today persist only fires for prefs). Guard against stale/invalid ids. Medium.
- **Done when:** reload → same windows at same rects; Dossier on same section.

### R2. Dynamic menu bar  · M
- **Goal:** Menu bar reflects the focused app (macOS-style: bold app name + app-specific menus).
- **Approach:** A `data/appMenus.ts` map keyed by `AppId` → `{ menus: {label, items}[] }`. `TopBar` reads `focusedId` and renders the app name + its menus after the JaiOS menu. e.g. **Dossier → "Go"** (sections via `openFinderAt`), **Terminal → "Shell"** (Clear), **Browser → "View"**, default → Window/Help.
- **Files:** `TopBar.tsx`, new `data/appMenus.ts`.
- **Risk:** Low. Some items need app hooks (keep mostly navigational).
- **Done when:** focusing an app swaps the menu-bar title + menus.

### R3. Live notifications over time  · S
- **Goal:** A couple of notifications/toasts arrive on a timer after login; badge updates — feels "alive."
- **Approach:** A small effect (post-login) schedules 2–3 `addNotification`/`pushToast` once per session; respects DND.
- **Files:** small hook or effect in `JaiOS.tsx`.
- **Risk:** Low.
- **Done when:** after login a notification appears after ~Ns (and is silent under Focus).

---

## Batch 2 — interaction depth

### R4. Mission Control / Exposé  · M
- **Goal:** A key/hot-corner/button tiles all open windows to pick one.
- **Approach:** Overlay (`MissionControl.tsx`) showing a grid of open-window cards (app icon + title; live DOM thumbnails are out of scope). Trigger: a TopBar/dock control + `F3`/hot-corner. Click → focus + close. Store flag `missionControlOpen`.
- **Files:** new `MissionControl.tsx`, `JaiOS.tsx`, store flag, a trigger.
- **Risk:** True thumbnails are hard → use rich cards. Medium.
- **Done when:** trigger → grid; click focuses a window.

### R5. Lock screen + idle screensaver  · M
- **Goal:** Idle → dim to a clock screensaver; input wakes. Manual **Lock** (JaiOS menu) → login.
- **Approach:** `useIdle(ms)` resets on pointer/key; show `Screensaver.tsx` overlay (big clock) when idle; any input dismisses. `lock()` store action → `isLoggedIn=false`.
- **Files:** new `Screensaver.tsx` + idle hook, `store` (`lock`), `JaiOS.tsx`, `TopBar` (Lock item).
- **Risk:** Idle timer correctness; reduced-motion. Medium.
- **Done when:** idle shows screensaver; input wakes; Lock → login.

### R6. Dock magnification  · S–M
- **Goal:** macOS dock magnify — hovered icon + neighbors scale by cursor distance.
- **Approach:** Track pointer x over the dock; per-icon `scale`/`translateY` from distance with falloff. Disable under reduced motion.
- **Files:** `Dock.tsx`.
- **Risk:** Minor perf on mousemove (fine for ~12 icons). Low–medium.
- **Done when:** hovering the dock magnifies with smooth falloff.

---

## Batch 3 — polish / optional

### R7. Calendar popover + live status  · S–M
- Click the menu-bar date → a month calendar popover (today highlighted). Optionally richer Wi-Fi/battery detail.
- **Files:** new `Calendar.tsx` popover, `TopBar`.

### R8. Boot / login polish  · S–M
- Fake password / Touch-ID step on the login tile with a "wrong password" shake. (Boot chime already done.)
- **Files:** `LoginScreen.tsx` (+ maybe `BootScreen`).
- **Note:** adds a step — keep it skippable.

### R9. Trash / Bin  · M  *(has a dependency)*
- A dock Trash; drag desktop files in to delete; empty/put-back.
- **Dependency:** there's currently no way to put files on the desktop (the old Finder drag-to-desktop was removed in the hub rebuild). So pair this with **"drag a Dossier item (note/resume) onto the desktop"** to give Trash a purpose, or defer.

### R10. Desktop icon interaction  · M  *(low value now)*
- Click-select, marquee select, drag-reposition desktop icons. Currently only the Finder icon sits on the desktop, so impact is low until more lives there. Defer.

---

## Recommended order
**Batch 1** (R1 persistence, R2 dynamic menu bar, R3 live notifications) → biggest authenticity per effort and independent.
Then **Batch 2** (R4 Mission Control, R5 lock/screensaver, R6 dock magnify).
**Batch 3** as polish; revisit Trash/desktop-icons only if we re-introduce draggable desktop files.
