"use client";

import { create } from "zustand";
import { playSound } from "../lib/sounds";

export const HOME_URL = "jai://home";
/** Most tabs we let the strip hold before hiding the new-tab button. */
export const MAX_TABS = 8;

export interface BrowserTab {
  id: string;
  /** Per-tab navigation stack; current url = history[historyIndex]. */
  history: string[];
  historyIndex: number;
}

export interface Bookmark {
  id: string;
  label: string;
  url: string;
  /** Optional explicit favicon URL (external sites); internal pages use the brand mark. */
  favicon?: string;
}

export interface DownloadItem {
  id: string;
  name: string;
  status: "in-progress" | "completed";
  at: number;
}

export interface HistoryEntry {
  url: string;
  at: number;
}

export type DevToolsTab = "elements" | "console" | "network" | "sources" | "application" | "lighthouse";

interface DevToolsState {
  open: boolean;
  side: "bottom" | "right";
  size: number;
  tab: DevToolsTab;
}

const SESSION_KEY = "jaios-browser";
const BOOKMARKS_KEY = "jaios-browser-bookmarks";
const HISTORY_KEY = "jaios-browser-history";

const FIRST_TAB: BrowserTab = { id: "tab-1", history: [HOME_URL], historyIndex: 0 };

let tabSeq = 1;
function nextTabId(): string {
  tabSeq += 1;
  return `tab-${tabSeq}-${Date.now().toString(36)}`;
}

export interface BrowserState {
  tabs: BrowserTab[];
  activeTabId: string;
  bookmarks: Bookmark[];
  globalHistory: HistoryEntry[];
  downloads: DownloadItem[];
  devtools: DevToolsState;
  bookmarksBarVisible: boolean;
  incognito: boolean;
  /** Bumped to force a reload of the active tab's page. */
  reloadKey: number;
  hydrated: boolean;
  soundEnabled: boolean;

  newTab: (url?: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  reorderTab: (from: number, to: number) => void;
  navigate: (url: string) => void;
  goBack: () => void;
  goForward: () => void;
  reload: () => void;

  seedBookmarks: (b: Bookmark[]) => void;
  addBookmark: (b: Omit<Bookmark, "id">) => void;
  removeBookmark: (id: string) => void;
  renameBookmark: (id: string, label: string) => void;
  reorderBookmark: (from: number, to: number) => void;
  toggleBookmarksBar: () => void;

  toggleDevtools: () => void;
  setDevtoolsTab: (t: DevToolsTab) => void;
  setDevtoolsSide: (s: "bottom" | "right") => void;
  setDevtoolsSize: (n: number) => void;

  pushDownload: (name: string) => string;
  completeDownload: (id: string) => void;

  clearHistory: () => void;
  toggleIncognito: () => void;
  setSoundEnabled: (on: boolean) => void;

  hydrate: () => void;
}

/** Current url of a tab. */
export function tabUrl(tab: BrowserTab): string {
  return tab.history[tab.historyIndex] ?? HOME_URL;
}

function persistSession(state: BrowserState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ tabs: state.tabs, activeTabId: state.activeTabId, devtools: state.devtools, bookmarksBarVisible: state.bookmarksBarVisible }),
    );
  } catch {
    /* ignore */
  }
}

function persistBookmarks(state: BrowserState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(state.bookmarks));
  } catch {
    /* ignore */
  }
}

function persistHistory(state: BrowserState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(state.globalHistory.slice(0, 200)));
  } catch {
    /* ignore */
  }
}

function beep(state: BrowserState, sound: Parameters<typeof playSound>[0]) {
  if (state.soundEnabled) playSound(sound);
}

export const useBrowserStore = create<BrowserState>((set, get) => ({
  tabs: [FIRST_TAB],
  activeTabId: FIRST_TAB.id,
  bookmarks: [],
  globalHistory: [],
  downloads: [],
  devtools: { open: false, side: "bottom", size: 320, tab: "console" },
  bookmarksBarVisible: true,
  incognito: false,
  reloadKey: 0,
  hydrated: false,
  soundEnabled: true,

  newTab: (url = HOME_URL) => {
    if (get().tabs.length >= MAX_TABS) return;
    beep(get(), "open");
    const tab: BrowserTab = { id: nextTabId(), history: [url], historyIndex: 0 };
    set((s) => ({ tabs: [...s.tabs, tab], activeTabId: tab.id }));
    persistSession(get());
  },

  closeTab: (id) => {
    beep(get(), "close");
    set((s) => {
      const idx = s.tabs.findIndex((t) => t.id === id);
      if (idx === -1) return {};
      const tabs = s.tabs.filter((t) => t.id !== id);
      if (tabs.length === 0) {
        const fresh: BrowserTab = { id: nextTabId(), history: [HOME_URL], historyIndex: 0 };
        return { tabs: [fresh], activeTabId: fresh.id };
      }
      let activeTabId = s.activeTabId;
      if (activeTabId === id) {
        activeTabId = (tabs[idx] ?? tabs[idx - 1] ?? tabs[0]).id;
      }
      return { tabs, activeTabId };
    });
    persistSession(get());
  },

  setActiveTab: (id) => {
    set({ activeTabId: id });
    persistSession(get());
  },

  reorderTab: (from, to) => {
    set((s) => {
      const tabs = [...s.tabs];
      const [moved] = tabs.splice(from, 1);
      if (!moved) return {};
      tabs.splice(to, 0, moved);
      return { tabs };
    });
    persistSession(get());
  },

  navigate: (url) => {
    if (!url) return;
    beep(get(), "toggle");
    set((s) => {
      const tabs = s.tabs.map((t) => {
        if (t.id !== s.activeTabId) return t;
        if (tabUrl(t) === url) return t;
        const history = [...t.history.slice(0, t.historyIndex + 1), url];
        return { ...t, history, historyIndex: history.length - 1 };
      });
      const globalHistory = s.incognito ? s.globalHistory : [{ url, at: Date.now() }, ...s.globalHistory];
      return { tabs, globalHistory };
    });
    persistSession(get());
    if (!get().incognito) persistHistory(get());
  },

  goBack: () => {
    set((s) => ({
      tabs: s.tabs.map((t) =>
        t.id === s.activeTabId && t.historyIndex > 0 ? { ...t, historyIndex: t.historyIndex - 1 } : t,
      ),
    }));
    persistSession(get());
  },

  goForward: () => {
    set((s) => ({
      tabs: s.tabs.map((t) =>
        t.id === s.activeTabId && t.historyIndex < t.history.length - 1
          ? { ...t, historyIndex: t.historyIndex + 1 }
          : t,
      ),
    }));
    persistSession(get());
  },

  reload: () => set((s) => ({ reloadKey: s.reloadKey + 1 })),

  seedBookmarks: (b) => {
    if (get().bookmarks.length > 0) return;
    set({ bookmarks: b });
    persistBookmarks(get());
  },
  addBookmark: (b) => {
    set((s) => ({ bookmarks: [...s.bookmarks, { ...b, id: `bm-${Date.now().toString(36)}` }] }));
    persistBookmarks(get());
  },
  removeBookmark: (id) => {
    set((s) => ({ bookmarks: s.bookmarks.filter((x) => x.id !== id) }));
    persistBookmarks(get());
  },
  renameBookmark: (id, label) => {
    set((s) => ({ bookmarks: s.bookmarks.map((x) => (x.id === id ? { ...x, label } : x)) }));
    persistBookmarks(get());
  },
  reorderBookmark: (from, to) => {
    set((s) => {
      const bookmarks = [...s.bookmarks];
      const [moved] = bookmarks.splice(from, 1);
      if (!moved) return {};
      bookmarks.splice(to, 0, moved);
      return { bookmarks };
    });
    persistBookmarks(get());
  },
  toggleBookmarksBar: () => {
    set((s) => ({ bookmarksBarVisible: !s.bookmarksBarVisible }));
    persistSession(get());
  },

  toggleDevtools: () => {
    set((s) => ({ devtools: { ...s.devtools, open: !s.devtools.open } }));
    persistSession(get());
  },
  setDevtoolsTab: (tab) => {
    set((s) => ({ devtools: { ...s.devtools, tab, open: true } }));
    persistSession(get());
  },
  setDevtoolsSide: (side) => {
    set((s) => ({ devtools: { ...s.devtools, side } }));
    persistSession(get());
  },
  setDevtoolsSize: (size) => {
    set((s) => ({ devtools: { ...s.devtools, size } }));
    persistSession(get());
  },

  pushDownload: (name) => {
    const id = `dl-${Date.now().toString(36)}`;
    set((s) => ({ downloads: [{ id, name, status: "in-progress", at: Date.now() }, ...s.downloads] }));
    return id;
  },
  completeDownload: (id) => {
    set((s) => ({ downloads: s.downloads.map((d) => (d.id === id ? { ...d, status: "completed" } : d)) }));
  },

  clearHistory: () => {
    set({ globalHistory: [] });
    persistHistory(get());
  },
  toggleIncognito: () => set((s) => ({ incognito: !s.incognito })),
  setSoundEnabled: (on) => set({ soundEnabled: on }),

  hydrate: () => {
    if (typeof window === "undefined" || get().hydrated) return;
    const patch: Partial<BrowserState> = { hydrated: true };
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) {
        const s = JSON.parse(raw) as Partial<Pick<BrowserState, "tabs" | "activeTabId" | "devtools" | "bookmarksBarVisible">>;
        if (Array.isArray(s.tabs) && s.tabs.length > 0) {
          const tabs = s.tabs.filter(
            (t): t is BrowserTab => !!t && Array.isArray(t.history) && typeof t.historyIndex === "number",
          );
          if (tabs.length > 0) {
            patch.tabs = tabs;
            patch.activeTabId = tabs.some((t) => t.id === s.activeTabId) ? (s.activeTabId as string) : tabs[0].id;
          }
        }
        if (s.devtools) {
          const d = s.devtools;
          patch.devtools = {
            open: Boolean(d.open),
            side: d.side === "right" ? "right" : "bottom",
            size: typeof d.size === "number" ? d.size : 320,
            tab: d.tab ?? "console",
          };
        }
        if (typeof s.bookmarksBarVisible === "boolean") patch.bookmarksBarVisible = s.bookmarksBarVisible;
      }
    } catch {
      /* ignore malformed session */
    }
    try {
      const rawB = window.localStorage.getItem(BOOKMARKS_KEY);
      if (rawB) {
        const b = JSON.parse(rawB) as Bookmark[];
        if (Array.isArray(b)) patch.bookmarks = b;
      }
    } catch {
      /* ignore */
    }
    try {
      const rawH = window.localStorage.getItem(HISTORY_KEY);
      if (rawH) {
        const h = JSON.parse(rawH) as HistoryEntry[];
        if (Array.isArray(h)) patch.globalHistory = h;
      }
    } catch {
      /* ignore */
    }
    set(patch);
  },
}));
