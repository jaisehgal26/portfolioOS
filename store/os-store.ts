"use client";

import { create } from "zustand";
import { APPS, type AppId } from "@/data/apps";
import { initialNotifications, type OSNotification } from "@/data/notifications";
import { playSound } from "@/lib/sounds";

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
const SESSION_KEY = "jaios-session";
const TOP_BAR = 44;
const APP_IDS = new Set<AppId>(APPS.map((a) => a.id));

interface Persisted {
  theme: Theme;
  wallpaper: string;
  accent: string;
  reducedMotionPref: boolean;
  soundEnabled: boolean;
  brightness: number;
  dnd: boolean;
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
  controlCenterOpen: boolean;
  missionControlOpen: boolean;
  calendarOpen: boolean;
  helpOpen: boolean;
  contextMenu: ContextMenuState;

  notifications: OSNotification[];
  toasts: Toast[];
  /** A URL requested to open inside the in-OS Browser app (consumed by BrowserApp). */
  browserUrl: string | null;
  /** A file requested to open in the Text Viewer (consumed by TextViewerApp). */
  openFileId: string | null;
  /** A section requested in the Finder hub (consumed by FinderApp). */
  finderSection: string | null;
  /** Files the user dragged onto the desktop (session only). */
  desktopFiles: DesktopFile[];
  /** Files moved to the Trash (session only). */
  trash: DesktopFile[];

  boot: () => void;
  login: () => void;
  lock: () => void;
  restart: () => void;
  crash: () => void;
  reboot: () => void;

  openApp: (appId: AppId) => void;
  openUrlInBrowser: (url: string) => void;
  clearBrowserUrl: () => void;
  openFile: (id: string) => void;
  clearOpenFile: () => void;
  openFinderAt: (section: string) => void;
  setFinderSection: (section: string) => void;
  addDesktopFile: (id: string, x: number, y: number) => void;
  removeDesktopFile: (id: string) => void;
  trashDesktopFile: (id: string) => void;
  restoreFromTrash: (id: string) => void;
  emptyTrash: () => void;
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
  toggleControlCenter: () => void;
  closeControlCenter: () => void;
  toggleMissionControl: () => void;
  closeMissionControl: () => void;
  toggleCalendar: () => void;
  closeCalendar: () => void;
  setSoundEnabled: (on: boolean) => void;
  setBrightness: (v: number) => void;
  toggleDnd: () => void;
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
      soundEnabled: state.soundEnabled,
      brightness: state.brightness,
      dnd: state.dnd,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

interface SessionData {
  windows: OSWindow[];
  focusedId: AppId | null;
  zCounter: number;
  finderSection: string | null;
}

/** Persist the live desktop so a reload resumes open windows + section. */
function persistSession(state: OSState) {
  if (typeof window === "undefined") return;
  try {
    const data: SessionData = {
      windows: state.windows,
      focusedId: state.focusedId,
      zCounter: state.zCounter,
      finderSection: state.finderSection,
    };
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(data));
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
  soundEnabled: true,
  brightness: 1,
  dnd: false,

  windows: [],
  focusedId: null,
  zCounter: 10,

  spotlightOpen: false,
  notificationCenterOpen: false,
  controlCenterOpen: false,
  missionControlOpen: false,
  calendarOpen: false,
  helpOpen: false,
  contextMenu: { open: false, x: 0, y: 0 },

  notifications: initialNotifications,
  toasts: [],
  browserUrl: null,
  openFileId: null,
  finderSection: null,
  desktopFiles: [],
  trash: [],

  boot: () => set({ hasBooted: true }),

  login: () => {
    set({ isLoggedIn: true });
    if (get().soundEnabled) playSound("boot");
  },

  lock: () =>
    set({ isLoggedIn: false, spotlightOpen: false, missionControlOpen: false, controlCenterOpen: false }),

  restart: () => {
    set({
      hasBooted: false,
      isLoggedIn: false,
      windows: [],
      focusedId: null,
      spotlightOpen: false,
      notificationCenterOpen: false,
    });
    persistSession(get());
  },

  crash: () => {
    set({ crashed: true });
    if (get().soundEnabled) playSound("error");
  },
  reboot: () => {
    set({ crashed: false });
    get().restart();
  },

  openApp: (appId) => {
    if (get().soundEnabled) playSound("open");
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
    });
    persistSession(get());
  },

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
  openFinderAt: (section) => {
    set({ finderSection: section });
    get().openApp("finder");
  },
  setFinderSection: (section) => {
    set({ finderSection: section });
    persistSession(get());
  },
  addDesktopFile: (id, x, y) =>
    set((s) => ({
      desktopFiles: [...s.desktopFiles.filter((f) => f.id !== id), { id, x, y }],
    })),
  removeDesktopFile: (id) =>
    set((s) => ({ desktopFiles: s.desktopFiles.filter((f) => f.id !== id) })),
  trashDesktopFile: (id) =>
    set((s) => {
      const file = s.desktopFiles.find((f) => f.id === id);
      return {
        desktopFiles: s.desktopFiles.filter((f) => f.id !== id),
        trash: file ? [...s.trash.filter((t) => t.id !== id), file] : s.trash,
      };
    }),
  restoreFromTrash: (id) =>
    set((s) => {
      const file = s.trash.find((t) => t.id === id);
      return {
        trash: s.trash.filter((t) => t.id !== id),
        desktopFiles: file
          ? [...s.desktopFiles.filter((f) => f.id !== id), { ...file, x: 40, y: 80 }]
          : s.desktopFiles,
      };
    }),
  emptyTrash: () => set({ trash: [] }),

  closeWindow: (id) => {
    if (get().soundEnabled) playSound("close");
    set((s) => {
      const windows = s.windows.filter((w) => w.id !== id);
      const focusedId =
        s.focusedId === id
          ? windows.filter((w) => !w.minimized).sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null
          : s.focusedId;
      return { windows, focusedId };
    });
    persistSession(get());
  },

  minimizeWindow: (id) => {
    if (get().soundEnabled) playSound("minimize");
    set((s) => {
      const windows = s.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w));
      const focusedId =
        s.focusedId === id
          ? windows.filter((w) => !w.minimized).sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null
          : s.focusedId;
      return { windows, focusedId };
    });
    persistSession(get());
  },

  toggleMaximize: (id) => {
    set((s) => {
      const z = s.zCounter + 1;
      return {
        windows: s.windows.map((w) =>
          w.id === id ? { ...w, maximized: !w.maximized, minimized: false, zIndex: z } : w,
        ),
        focusedId: id,
        zCounter: z,
      };
    });
    persistSession(get());
  },

  focusWindow: (id) => {
    set((s) => {
      if (s.focusedId === id && !s.windows.find((w) => w.id === id)?.minimized) return {};
      const z = s.zCounter + 1;
      return {
        windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: false, zIndex: z } : w)),
        focusedId: id,
        zCounter: z,
      };
    });
    persistSession(get());
  },

  setWindowRect: (id, rect) => {
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, ...rect } : w)),
    }));
    persistSession(get());
  },

  setTheme: (theme) => {
    set({ theme });
    persist(get());
  },
  toggleTheme: () => {
    set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" }));
    persist(get());
    if (get().soundEnabled) playSound("toggle");
  },
  setWallpaper: (wallpaper) => {
    set({ wallpaper });
    persist(get());
    if (get().soundEnabled) playSound("toggle");
  },
  setAccent: (accent) => {
    set({ accent });
    persist(get());
    if (get().soundEnabled) playSound("toggle");
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
  toggleControlCenter: () => set((s) => ({ controlCenterOpen: !s.controlCenterOpen })),
  closeControlCenter: () => set({ controlCenterOpen: false }),
  toggleMissionControl: () => set((s) => ({ missionControlOpen: !s.missionControlOpen })),
  closeMissionControl: () => set({ missionControlOpen: false }),
  toggleCalendar: () => set((s) => ({ calendarOpen: !s.calendarOpen })),
  closeCalendar: () => set({ calendarOpen: false }),
  setSoundEnabled: (on) => {
    set({ soundEnabled: on });
    persist(get());
    if (on) playSound("toggle");
  },
  setBrightness: (v) => {
    set({ brightness: v });
    persist(get());
  },
  toggleDnd: () => {
    set((s) => ({ dnd: !s.dnd }));
    persist(get());
  },
  setHelpOpen: (open) => set({ helpOpen: open }),
  openContextMenu: (x, y) => set({ contextMenu: { open: true, x, y } }),
  closeContextMenu: () => set((s) => ({ contextMenu: { ...s.contextMenu, open: false } })),

  addNotification: (n) => {
    const st = get();
    if (st.soundEnabled && !st.dnd) playSound("notify");
    set((s) => ({
      notifications: [
        { id: n.id ?? `n-${s.zCounter}-${s.notifications.length}`, read: false, time: "now", ...n },
        ...s.notifications,
      ],
    }));
  },
  markNotificationsRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  removeNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
  clearNotifications: () => set({ notifications: [] }),

  pushToast: (message) => {
    const st = get();
    if (st.soundEnabled && !st.dnd) playSound("notify");
    set((s) => {
      const id = `t-${Date.now()}-${s.toasts.length}`;
      return { toasts: [...s.toasts, { id, message }] };
    });
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  hydrate: () => {
    if (typeof window === "undefined" || get().hydrated) return;
    const patch: Partial<OSState> = { hydrated: true };

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<Persisted>;
        patch.theme = p.theme === "dark" ? "dark" : "light";
        patch.wallpaper = typeof p.wallpaper === "string" ? p.wallpaper : "aurora";
        patch.accent = typeof p.accent === "string" ? p.accent : "terracotta";
        patch.reducedMotionPref = Boolean(p.reducedMotionPref);
        patch.soundEnabled = p.soundEnabled !== false;
        patch.brightness = typeof p.brightness === "number" ? Math.min(1, Math.max(0.4, p.brightness)) : 1;
        patch.dnd = Boolean(p.dnd);
      }
    } catch {
      /* ignore malformed prefs */
    }

    try {
      const rawSession = window.localStorage.getItem(SESSION_KEY);
      if (rawSession) {
        const s = JSON.parse(rawSession) as Partial<SessionData>;
        if (Array.isArray(s.windows)) {
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const wins = s.windows
            .filter((w): w is OSWindow => !!w && APP_IDS.has(w.id as AppId))
            .map((w) => ({
              ...w,
              x: Math.min(Math.max(-w.w + 120, w.x), vw - 120),
              y: Math.min(Math.max(TOP_BAR, w.y), vh - 80),
            }));
          patch.windows = wins;
          patch.zCounter = wins.reduce((m, w) => Math.max(m, w.zIndex), 10);
          patch.focusedId = wins.some((w) => w.id === s.focusedId) ? (s.focusedId as AppId) : null;
        }
        if (typeof s.finderSection === "string") patch.finderSection = s.finderSection;
      }
    } catch {
      /* ignore malformed session */
    }

    set(patch);
  },
}));
