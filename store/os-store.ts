"use client";

import { create } from "zustand";
import { APPS, type AppId } from "@/data/apps";
import { initialNotifications, type OSNotification } from "@/data/notifications";

export type { AppId, OSNotification };
export type Theme = "light" | "dark";

export interface WindowRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface OSWindow extends WindowRect {
  id: AppId;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
}

export interface Toast {
  id: string;
  message: string;
}

/** A file the user dragged onto the desktop (positioned at the drop point). */
export interface DesktopFile {
  id: string;
  x: number;
  y: number;
}

interface ContextMenuState {
  open: boolean;
  x: number;
  y: number;
}

const STORAGE_KEY = "jaios-prefs";
const TOP_BAR = 44;

interface Persisted {
  theme: Theme;
  wallpaper: string;
  accent: string;
  reducedMotionPref: boolean;
}

interface OSState extends Persisted {
  hasBooted: boolean;
  isLoggedIn: boolean;
  hydrated: boolean;
  /** Fake "system crash" (BSOD) easter egg. */
  crashed: boolean;

  windows: OSWindow[];
  focusedId: AppId | null;
  zCounter: number;

  spotlightOpen: boolean;
  notificationCenterOpen: boolean;
  helpOpen: boolean;
  contextMenu: ContextMenuState;

  notifications: OSNotification[];
  toasts: Toast[];
  /** A URL requested to open inside the in-OS Browser app (consumed by BrowserApp). */
  browserUrl: string | null;
  /** A file requested to open in the Text Viewer (consumed by TextViewerApp). */
  openFileId: string | null;
  /** Files the user dragged onto the desktop (session only). */
  desktopFiles: DesktopFile[];

  boot: () => void;
  login: () => void;
  restart: () => void;
  crash: () => void;
  reboot: () => void;

  openApp: (appId: AppId) => void;
  openUrlInBrowser: (url: string) => void;
  clearBrowserUrl: () => void;
  openFile: (id: string) => void;
  clearOpenFile: () => void;
  addDesktopFile: (id: string, x: number, y: number) => void;
  removeDesktopFile: (id: string) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  setWindowRect: (id: AppId, rect: Partial<WindowRect>) => void;

  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setWallpaper: (w: string) => void;
  setAccent: (a: string) => void;
  setReducedMotionPref: (b: boolean) => void;

  closeSpotlight: () => void;
  toggleSpotlight: () => void;
  toggleNotificationCenter: () => void;
  closeNotificationCenter: () => void;
  setHelpOpen: (open: boolean) => void;
  openContextMenu: (x: number, y: number) => void;
  closeContextMenu: () => void;

  addNotification: (n: Omit<OSNotification, "id"> & { id?: string }) => void;
  markNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  pushToast: (message: string) => void;
  removeToast: (id: string) => void;

  hydrate: () => void;
}

function persist(state: OSState) {
  if (typeof window === "undefined") return;
  try {
    const data: Persisted = {
      theme: state.theme,
      wallpaper: state.wallpaper,
      accent: state.accent,
      reducedMotionPref: state.reducedMotionPref,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

/** Default window placement, centered with a gentle cascade. */
function defaultRect(appId: AppId, openCount: number): WindowRect {
  const meta = APPS.find((a) => a.id === appId);
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const w = Math.min(meta?.defaultSize.w ?? 720, vw - 48);
  const h = Math.min(meta?.defaultSize.h ?? 520, vh - TOP_BAR - 120);
  const cascade = (openCount % 6) * 26;
  const x = Math.max(16, Math.round((vw - w) / 2) + cascade - 70);
  const y = Math.max(TOP_BAR + 16, Math.round((vh - TOP_BAR - h) / 2) + TOP_BAR / 2 + cascade - 40);
  return { x, y, w, h };
}

export const useOSStore = create<OSState>((set, get) => ({
  hasBooted: false,
  isLoggedIn: false,
  hydrated: false,
  crashed: false,

  theme: "light",
  wallpaper: "aurora",
  accent: "terracotta",
  reducedMotionPref: false,

  windows: [],
  focusedId: null,
  zCounter: 10,

  spotlightOpen: false,
  notificationCenterOpen: false,
  helpOpen: false,
  contextMenu: { open: false, x: 0, y: 0 },

  notifications: initialNotifications,
  toasts: [],
  browserUrl: null,
  openFileId: null,
  desktopFiles: [],

  boot: () => set({ hasBooted: true }),

  login: () => set({ isLoggedIn: true }),

  restart: () =>
    set({
      hasBooted: false,
      isLoggedIn: false,
      windows: [],
      focusedId: null,
      spotlightOpen: false,
      notificationCenterOpen: false,
    }),

  crash: () => set({ crashed: true }),
  reboot: () => {
    set({ crashed: false });
    get().restart();
  },

  openApp: (appId) =>
    set((s) => {
      const z = s.zCounter + 1;
      const existing = s.windows.find((w) => w.id === appId);
      if (existing) {
        return {
          windows: s.windows.map((w) =>
            w.id === appId ? { ...w, minimized: false, zIndex: z } : w,
          ),
          focusedId: appId,
          zCounter: z,
          spotlightOpen: false,
        };
      }
      const rect = defaultRect(appId, s.windows.length);
      const win: OSWindow = { id: appId, zIndex: z, minimized: false, maximized: false, ...rect };
      return {
        windows: [...s.windows, win],
        focusedId: appId,
        zCounter: z,
        spotlightOpen: false,
      };
    }),

  openUrlInBrowser: (url) => {
    set({ browserUrl: url });
    get().openApp("browser");
  },
  clearBrowserUrl: () => set({ browserUrl: null }),

  openFile: (id) => {
    set({ openFileId: id });
    get().openApp("text-viewer");
  },
  clearOpenFile: () => set({ openFileId: null }),
  addDesktopFile: (id, x, y) =>
    set((s) => ({
      desktopFiles: [...s.desktopFiles.filter((f) => f.id !== id), { id, x, y }],
    })),
  removeDesktopFile: (id) =>
    set((s) => ({ desktopFiles: s.desktopFiles.filter((f) => f.id !== id) })),

  closeWindow: (id) =>
    set((s) => {
      const windows = s.windows.filter((w) => w.id !== id);
      const focusedId =
        s.focusedId === id
          ? windows.filter((w) => !w.minimized).sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null
          : s.focusedId;
      return { windows, focusedId };
    }),

  minimizeWindow: (id) =>
    set((s) => {
      const windows = s.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w));
      const focusedId =
        s.focusedId === id
          ? windows.filter((w) => !w.minimized).sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null
          : s.focusedId;
      return { windows, focusedId };
    }),

  toggleMaximize: (id) =>
    set((s) => {
      const z = s.zCounter + 1;
      return {
        windows: s.windows.map((w) =>
          w.id === id ? { ...w, maximized: !w.maximized, minimized: false, zIndex: z } : w,
        ),
        focusedId: id,
        zCounter: z,
      };
    }),

  focusWindow: (id) =>
    set((s) => {
      if (s.focusedId === id && !s.windows.find((w) => w.id === id)?.minimized) return {};
      const z = s.zCounter + 1;
      return {
        windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: false, zIndex: z } : w)),
        focusedId: id,
        zCounter: z,
      };
    }),

  setWindowRect: (id, rect) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, ...rect } : w)),
    })),

  setTheme: (theme) => {
    set({ theme });
    persist(get());
  },
  toggleTheme: () => {
    set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" }));
    persist(get());
  },
  setWallpaper: (wallpaper) => {
    set({ wallpaper });
    persist(get());
  },
  setAccent: (accent) => {
    set({ accent });
    persist(get());
  },
  setReducedMotionPref: (reducedMotionPref) => {
    set({ reducedMotionPref });
    persist(get());
  },

  closeSpotlight: () => set({ spotlightOpen: false }),
  toggleSpotlight: () => set((s) => ({ spotlightOpen: !s.spotlightOpen })),
  toggleNotificationCenter: () =>
    set((s) => ({ notificationCenterOpen: !s.notificationCenterOpen })),
  closeNotificationCenter: () => set({ notificationCenterOpen: false }),
  setHelpOpen: (open) => set({ helpOpen: open }),
  openContextMenu: (x, y) => set({ contextMenu: { open: true, x, y } }),
  closeContextMenu: () => set((s) => ({ contextMenu: { ...s.contextMenu, open: false } })),

  addNotification: (n) =>
    set((s) => ({
      notifications: [
        { id: n.id ?? `n-${s.zCounter}-${s.notifications.length}`, read: false, time: "now", ...n },
        ...s.notifications,
      ],
    })),
  markNotificationsRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  removeNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
  clearNotifications: () => set({ notifications: [] }),

  pushToast: (message) =>
    set((s) => {
      const id = `t-${Date.now()}-${s.toasts.length}`;
      return { toasts: [...s.toasts, { id, message }] };
    }),
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  hydrate: () => {
    if (typeof window === "undefined" || get().hydrated) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<Persisted>;
        set({
          theme: p.theme === "dark" ? "dark" : "light",
          wallpaper: typeof p.wallpaper === "string" ? p.wallpaper : "aurora",
          accent: typeof p.accent === "string" ? p.accent : "terracotta",
          reducedMotionPref: Boolean(p.reducedMotionPref),
          hydrated: true,
        });
        return;
      }
    } catch {
      /* ignore malformed storage */
    }
    set({ hydrated: true });
  },
}));
