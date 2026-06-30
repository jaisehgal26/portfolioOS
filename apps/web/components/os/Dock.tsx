"use client";

import { Fragment, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOSStore } from "@jaios/kernel/store";
import { APPS, type AppId } from "@jaios/kernel/data/apps";
import { usePrefersReducedMotion } from "@jaios/kernel/hooks/use-reduced-motion";
import { useIsMobile } from "@jaios/kernel/hooks/use-media-query";
import { useDismissOnOutside } from "@jaios/kernel/hooks/use-dismiss-on-outside";
import { AppIcon } from "./AppIcon";
import { cn } from "@/lib/utils";

// Apps launcher always leads the dock; the rest follow their natural order.
const dockApps = APPS.filter((a) => a.inDock).sort(
  (a, b) => (b.id === "launchpad" ? 1 : 0) - (a.id === "launchpad" ? 1 : 0),
);

interface DockMenu {
  appId: AppId;
  x: number;
  y: number;
}

export function Dock() {
  const openApp = useOSStore((s) => s.openApp);
  const closeWindow = useOSStore((s) => s.closeWindow);
  const minimizeWindow = useOSStore((s) => s.minimizeWindow);
  const windows = useOSStore((s) => s.windows);
  const focusedId = useOSStore((s) => s.focusedId);

  /** Taskbar-style toggle: focused window minimizes; otherwise open/restore/focus. */
  function onDockClick(appId: AppId) {
    const win = windows.find((w) => w.id === appId);
    if (win && !win.minimized && focusedId === appId) {
      minimizeWindow(appId);
    } else {
      openApp(appId);
    }
  }
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const [menu, setMenu] = useState<DockMenu | null>(null);
  const menuRef = useDismissOnOutside<HTMLDivElement>(menu !== null, () => setMenu(null));
  const iconRefs = useRef<(HTMLButtonElement | null)[]>([]);
  /** True icon centers captured before any transform, so magnification doesn't feed back on itself. */
  const baseCentersRef = useRef<number[]>([]);

  const openIds = new Set(windows.map((w) => w.id));

  function captureBases() {
    baseCentersRef.current = iconRefs.current.map((el) => {
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      return r.left + r.width / 2;
    });
  }

  // macOS-style magnification: scale icons by cursor proximity (smooth falloff).
  function onDockMove(e: React.MouseEvent) {
    if (reduced || isMobile) return;
    if (baseCentersRef.current.length === 0) captureBases();
    const mx = e.clientX;
    iconRefs.current.forEach((el, i) => {
      if (!el) return;
      const center = baseCentersRef.current[i] || el.getBoundingClientRect().left + el.offsetWidth / 2;
      const d = Math.abs(mx - center);
      let f = Math.max(0, 1 - d / 95);
      f = f * f * (3 - 2 * f); // smoothstep for a soft bell curve
      el.style.transform = `translateY(${-8 * f}px) scale(${1 + 0.3 * f})`;
    });
  }
  function onDockLeave() {
    baseCentersRef.current = [];
    for (const el of iconRefs.current) if (el) el.style.transform = "";
  }

  // On mobile, apps live on the home grid — the dock is redundant.
  if (isMobile) return null;

  return (
    <>
      <div
        className={cn(
          "fixed inset-x-0 z-30 flex justify-center",
          isMobile ? "bottom-1.5" : "bottom-1",
        )}
      >
        <motion.nav
          aria-label="Dock"
          onMouseEnter={captureBases}
          onMouseMove={onDockMove}
          onMouseLeave={onDockLeave}
          initial={reduced ? false : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1], delay: reduced ? 0 : 0.2 }}
          className={cn(
            "flex items-end gap-3 rounded-2xl border border-line/60 bg-surface/55 px-3 py-1.5 shadow-soft backdrop-blur-xl",
            isMobile && "max-w-[calc(100vw-1.5rem)] overflow-x-auto",
          )}
        >
          {dockApps.map((app, i) => {
            const isOpen = openIds.has(app.id);
            const isFocused = focusedId === app.id;
            return (
              <Fragment key={app.id}>
                <div className="group relative flex shrink-0 flex-col items-center">
                  {/* Tooltip */}
                  {!isMobile && (
                    <span className="pointer-events-none absolute -top-10 whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink opacity-0 shadow-card transition-opacity duration-150 group-hover:opacity-100">
                      {app.name}
                    </span>
                  )}
                  <button
                    ref={(el) => {
                      iconRefs.current[i] = el;
                    }}
                    type="button"
                    onClick={() => onDockClick(app.id)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setMenu({ appId: app.id, x: e.clientX, y: e.clientY });
                    }}
                    aria-label={isOpen ? `${app.name} (open)` : `Open ${app.name}`}
                    className={cn(
                      "origin-bottom transition-transform duration-200 ease-out [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
                      !reduced && isMobile && "hover:-translate-y-1.5 hover:scale-110",
                    )}
                  >
                    <AppIcon app={app} size={isMobile ? "sm" : "md"} active={isFocused} />
                  </button>
                  {/* Active dot */}
                  <span
                    className={cn(
                      "mt-1 h-1 w-1 rounded-full transition-colors",
                      isOpen ? (isFocused ? "bg-accent" : "bg-muted/60") : "bg-transparent",
                    )}
                    aria-hidden
                  />
                </div>
              </Fragment>
            );
          })}
        </motion.nav>
      </div>

      {/* Dock right-click menu */}
      <AnimatePresence>
        {menu && (
          <motion.div
            ref={menuRef}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.12 }}
            style={{ left: Math.min(menu.x, (typeof window !== "undefined" ? window.innerWidth : 9999) - 180), top: menu.y - 130 }}
            className="glass-strong fixed z-50 w-44 rounded-xl p-1.5 shadow-card"
            role="menu"
          >
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                openApp(menu.appId);
                setMenu(null);
              }}
              className="flex w-full rounded-lg px-3 py-1.5 text-left text-sm text-ink hover:bg-ink/5"
            >
              Open
            </button>
            {openIds.has(menu.appId) && (
              <>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    minimizeWindow(menu.appId);
                    setMenu(null);
                  }}
                  className="flex w-full rounded-lg px-3 py-1.5 text-left text-sm text-ink hover:bg-ink/5"
                >
                  Minimize
                </button>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    closeWindow(menu.appId);
                    setMenu(null);
                  }}
                  className="flex w-full rounded-lg px-3 py-1.5 text-left text-sm text-danger hover:bg-danger/10"
                >
                  Close
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
