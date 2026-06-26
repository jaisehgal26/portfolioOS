"use client";

import { Fragment, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOSStore } from "@/store/os-store";
import { APPS, type AppId } from "@/data/apps";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useIsMobile } from "@/hooks/use-media-query";
import { useDismissOnOutside } from "@/hooks/use-dismiss-on-outside";
import { AppIcon } from "./AppIcon";
import { cn } from "@/lib/utils";

const dockApps = APPS.filter((a) => a.inDock);
const firstSystemAppId = dockApps.find((a) => a.category === "system")?.id;

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

  const openIds = new Set(windows.map((w) => w.id));

  return (
    <>
      <div
        className={cn(
          "fixed inset-x-0 z-30 flex justify-center",
          isMobile ? "bottom-0" : "bottom-2.5",
        )}
      >
        <motion.nav
          aria-label="Dock"
          initial={reduced ? false : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1], delay: reduced ? 0 : 0.2 }}
          className={cn(
            "glass-strong flex items-end gap-1.5 px-2.5 shadow-card",
            isMobile
              ? "w-full max-w-full justify-start overflow-x-auto rounded-none border-x-0 border-b-0 py-2"
              : "rounded-3xl py-2",
          )}
        >
          {dockApps.map((app) => {
            const isOpen = openIds.has(app.id);
            const isFocused = focusedId === app.id;
            return (
              <Fragment key={app.id}>
                {!isMobile && app.id === firstSystemAppId && (
                  <span aria-hidden className="mx-1 h-9 w-px self-center bg-line/70" />
                )}
                <div className="group relative flex shrink-0 flex-col items-center">
                  {/* Tooltip */}
                  {!isMobile && (
                    <span className="pointer-events-none absolute -top-10 whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink opacity-0 shadow-card transition-opacity duration-150 group-hover:opacity-100">
                      {app.name}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onDockClick(app.id)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setMenu({ appId: app.id, x: e.clientX, y: e.clientY });
                    }}
                    aria-label={isOpen ? `${app.name} (open)` : `Open ${app.name}`}
                    className={cn(
                      "origin-bottom transition-transform duration-200 ease-spring",
                      !reduced && "hover:-translate-y-1.5 hover:scale-110",
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
