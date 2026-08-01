export type ShortcutCategory = "Navigation" | "Windows" | "Apps" | "System";

export interface ShortcutDef {
  id: string;
  label: string;
  category: ShortcutCategory;
  /** Use `mod` for ⌘ on macOS / Ctrl on Windows & Linux. */
  keys: string[];
  searchTerms?: string;
}

export const SHORTCUT_CATEGORIES: ShortcutCategory[] = [
  "Navigation",
  "Windows",
  "Apps",
  "System",
];

export const SHORTCUTS: ShortcutDef[] = [
  {
    id: "spotlight",
    label: "Open Spotlight search",
    category: "Navigation",
    keys: ["mod", "K"],
    searchTerms: "search command palette",
  },
  {
    id: "spotlight-arrows",
    label: "Navigate Spotlight results",
    category: "Navigation",
    keys: ["↑", "↓"],
    searchTerms: "spotlight list",
  },
  {
    id: "spotlight-enter",
    label: "Run Spotlight command",
    category: "Navigation",
    keys: ["Enter"],
    searchTerms: "spotlight select",
  },
  {
    id: "mission-control",
    label: "Mission Control",
    category: "Navigation",
    keys: ["F3"],
    searchTerms: "expose windows overview",
  },
  {
    id: "app-switcher",
    label: "Cycle open windows (release to focus)",
    category: "Navigation",
    keys: ["mod", "Tab"],
    searchTerms: "switcher alt tab",
  },
  {
    id: "app-switcher-back",
    label: "Cycle windows backward",
    category: "Navigation",
    keys: ["mod", "Shift", "Tab"],
    searchTerms: "switcher reverse",
  },
  {
    id: "escape",
    label: "Close Spotlight, Mission Control, or dialogs",
    category: "Navigation",
    keys: ["Esc"],
    searchTerms: "dismiss cancel",
  },
  {
    id: "close-window",
    label: "Close focused window",
    category: "Windows",
    keys: ["mod", "W"],
    searchTerms: "quit exit",
  },
  {
    id: "minimize-window",
    label: "Minimize focused window",
    category: "Windows",
    keys: ["mod", "M"],
    searchTerms: "hide",
  },
  {
    id: "maximize-titlebar",
    label: "Maximize / restore window",
    category: "Windows",
    keys: ["Double-click title bar"],
    searchTerms: "fullscreen expand",
  },
  {
    id: "finder-about",
    label: "Finder → About",
    category: "Apps",
    keys: ["mod", "1"],
    searchTerms: "dossier bio",
  },
  {
    id: "finder-work",
    label: "Finder → Use cases",
    category: "Apps",
    keys: ["mod", "2"],
    searchTerms: "projects case studies portfolio",
  },
  {
    id: "finder-resume",
    label: "Finder → Resume",
    category: "Apps",
    keys: ["mod", "3"],
    searchTerms: "cv pdf",
  },
  {
    id: "finder-contact",
    label: "Finder → Contact",
    category: "Apps",
    keys: ["mod", "4"],
    searchTerms: "email reach",
  },
  {
    id: "settings",
    label: "Open Settings",
    category: "Apps",
    keys: ["mod", ","],
    searchTerms: "preferences theme wallpaper",
  },
  {
    id: "context-menu",
    label: "Desktop context menu",
    category: "System",
    keys: ["Right-click"],
    searchTerms: "mouse desktop",
  },
  {
    id: "shortcuts-help",
    label: "Keyboard shortcuts (this panel)",
    category: "System",
    keys: ["Help menu"],
    searchTerms: "help cheatsheet",
  },
  {
    id: "guided-tour",
    label: "Start guided tour",
    category: "System",
    keys: ["Help menu → Take a tour"],
    searchTerms: "onboarding recruiter",
  },
];

export function isMacPlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  return /mac|iphone|ipad|ipod/i.test(navigator.platform) || /mac/i.test(navigator.userAgent);
}

export function displayKeys(keys: string[], isMac: boolean): string[] {
  return keys.map((k) => {
    if (k === "mod") return isMac ? "⌘" : "Ctrl";
    return k;
  });
}

export function filterShortcuts(query: string, shortcuts = SHORTCUTS): ShortcutDef[] {
  const q = query.trim().toLowerCase();
  if (!q) return shortcuts;
  return shortcuts.filter((s) => {
    const haystack = `${s.label} ${s.category} ${s.searchTerms ?? ""} ${s.keys.join(" ")}`.toLowerCase();
    return haystack.includes(q);
  });
}

export function groupShortcuts(shortcuts: ShortcutDef[]): { category: ShortcutCategory; items: ShortcutDef[] }[] {
  return SHORTCUT_CATEGORIES.map((category) => ({
    category,
    items: shortcuts.filter((s) => s.category === category),
  })).filter((g) => g.items.length > 0);
}
