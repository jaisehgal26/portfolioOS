"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOSStore } from "@/store/os-store";
import { APPS, type AppId } from "@/data/apps";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useIsMobile } from "@/hooks/use-media-query";
import { AppIcon } from "./AppIcon";
import { cn } from "@/lib/utils";

const dockApps = APPS.filter((a) => a.inDock);

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
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const [menu, setMenu] = useState<DockMenu | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const openIds = new Set(windows.map((w) => w.id));

  useEffect(() => {
    if (!menu) return;
    function onDoc(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menu]);

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
            return (
              <div key={app.id} className="group relative flex shrink-0 flex-col items-center">
                {/* Tooltip */}
                {!isMobile && (
                  <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-lg border border-line bg-surface px-2 py-1 text-xs font-medium text-ink opacity-0 shadow-soft transition-opacity duration-150 group-hover:opacity-100">
                    {app.name}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => openApp(app.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setMenu({ appId: app.id, x: e.clientX, y: e.clientY });
                  }}
                  aria-label={`Open ${app.name}`}
                  className={cn(
                    "origin-bottom transition-transform duration-200 ease-spring",
                    !reduced && "hover:-translate-y-1 hover:scale-110",
                  )}
                >
                  <AppIcon app={app} size={isMobile ? "sm" : "md"} />
                </button>
                {/* Active dot */}
                <span
                  className={cn(
                    "mt-1 h-1 w-1 rounded-full transition-colors",
                    isOpen ? (focusedId === app.id ? "bg-ink" : "bg-muted") : "bg-transparent",
                  )}
                  aria-hidden
                />
              </div>
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
            <div className="my-1 h-px bg-line" />
            <span className="flex items-center justify-between px-3 py-1 text-xs text-faint">
              Pin to Dock
              <span className="h-2 w-2 rounded-full bg-mint" />
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
