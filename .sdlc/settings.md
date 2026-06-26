# Task: Settings personalization

- **Slug:** settings
- **Status:** shipped
- **One-line goal:** Let users personalize the OS: light/dark theme, desktop wallpaper, and UI accent color.

## 1. Scope
- Theme toggle, wallpaper picker, accent picker. Persist across reloads.

## 2. Plan
- Already implemented in `SettingsApp.tsx` (Appearance: Theme/Wallpaper/Accent) wired to store (`setTheme/setWallpaper/setAccent`), persisted via `STORAGE_KEY`, applied in `JaiOS.tsx` effects + FOUC script. Plan = verify live; change nothing unless broken (KISS/YAGNI).

## 3. Implementation
- No code change required — feature complete and consistent with the refreshed design system.

## 4. Testing
- Live: switched accent → Blue; theme cards, wallpaper selection border, dock active icon/dot, and the accent-driven wallpaper bloom all updated instantly. Reverted to Terracotta. Theme toggle verified earlier. ✅

## 5. Impact / Regression
- No changes made → no regression risk.

## 6. Ship
- Status: shipped ✅ (verified existing implementation meets the requirement).
