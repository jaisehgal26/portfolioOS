# Task: System Monitor → Activity Monitor (skills as system)

- **Slug:** system-monitor
- **Status:** implementing
- **One-line goal:** Reframe the System Monitor as a real activity monitor where Jai's skills are the running system — memory blocks, processes with load, a flagship hardware spec sheet, and a live session battery.

## 1. Scope
- Skills (TypeScript, React, shadcn, …) shown as **active memory blocks** with load.
- **Hardware breakdown** mimicking flagship device specs (chip, memory, display, storage, connectivity).
- **Session "battery"** indicator (live, drains gently over the session) + uptime.
- Acceptance:
  - [ ] Skills render as memory/process rows with filled "block" load meters.
  - [ ] Stacked memory-allocation bar by skill group with legend.
  - [ ] Hardware spec sheet section.
  - [ ] Live session battery % + uptime that tick.
  - [ ] Matches the refreshed design system (single accent, ceramic cards, mono numerals); light + dark.

## 2. Plan
- Rewrite `components/apps/SystemMonitorApp.tsx` (client). Deterministic hand-picked load values (no random → no hydration mismatch). Local helpers: `Battery`, `BlockMeter`, `AllocationBar`, `SpecRow`. Animate bar/blocks on mount (reduced-motion aware). Session state via `useState` + `setInterval`.

## 3. Implementation
- Rewrote `SystemMonitorApp.tsx`: header with live session **Battery**; **Memory** card (stacked accent-tier allocation bar + legend by skill group); **Processes** list (skills as `BlockMeter` 10-square load meters + %); **Hardware** spec sheet (Chip/Memory/Neural/Display/Storage/Connectivity); **Session** tiles (uptime/theme/open apps/active). Deterministic values; battery+uptime derived from a 1s session counter.

## 4. Testing
- typecheck + lint: pass. Live (light): all sections render; battery 100%→ticks, block meters fill per load, allocation bar + legend correct, hardware sheet + session present. ✅

## 5. Impact / Regression
- Only `SystemMonitorApp.tsx` changed (self-contained). Still reads `theme/windows/focusedId` from store (read-only). No other consumers. ✅ no regressions.

## 6. Ship
- Status: shipped ✅.
