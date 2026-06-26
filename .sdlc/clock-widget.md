# Task: Custom analog watch clock widget

- **Slug:** clock-widget
- **Status:** implementing
- **One-line goal:** Replace the plain digital time with a refined mechanical-watch dial featuring a smooth sweeping second hand.

## 1. Scope
- Reusable `WatchDial` (SVG): bezel, sunburst dial, applied markers, slim hour/minute hands, accent sweeping second hand, center cap. Optional brand text on large sizes.
- Smooth (rAF) sweep; reduced-motion → 1s tick. Theme/accent aware.
- Use a compact dial in the TopBar (in place of digital time; keep date text) and a hero dial in the desktop widget rail.
- Acceptance:
  - [ ] Analog dial renders in light + dark, scales cleanly small (top bar) and large (widget).
  - [ ] Second hand sweeps continuously (ticks under reduced motion).
  - [ ] Hands show correct time; no hydration mismatch.
  - [ ] typecheck/lint/build pass.

## 2. Plan
- `components/os/WatchDial.tsx` (client): static SVG markup; rotate hand `<g>`s imperatively via refs in a rAF loop (or 1s interval when reduced). Colors via CSS tokens (`--ink`, `--accent`, surfaces) so it themes automatically.
- `TopBar.tsx`: swap the digital `{time}` for `<WatchDial>`, keep `{date}`.
- `DesktopWidgets.tsx`: first widget becomes a centered `WatchDial brand` + date line.

## 3. Implementation
- `components/os/WatchDial.tsx`: SVG mechanical-watch dial (case/bezel, sunburst face, 12 applied markers, ink hour/minute hands, accent sweeping second hand + lume + counterweight, center cap, optional `brand` text). Hands rotated imperatively via refs in a rAF loop (sweep); 1s interval when reduced motion. All colors from theme tokens.
- `TopBar.tsx`: digital time replaced by a compact `<WatchDial className="h-6 w-6">` next to the date; still toggles the notification center.
- `DesktopWidgets.tsx`: first widget is now a centered `<WatchDial brand className="h-28 w-28">` over a weekday + date line.

## 4. Testing
- typecheck + lint + `next build` (9/9): pass.
- Live: dial renders correctly in TopBar (24px) and as the desktop hero (112px); hands show correct time; second hand sweeps (rAF). Verified light **and** dark (themes via tokens). ✅

## 5. Impact / Regression
- Self-contained component; `WatchDial` runs its own timer. TopBar still uses `useCurrentTime` for the date; removed only the unused digital `time`. DesktopWidgets dropped its digital time. No store/data changes, no other consumers affected. ✅

## 6. Ship
- Status: shipped ✅.
