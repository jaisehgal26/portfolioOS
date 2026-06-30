"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useOSStore } from "@jaios/kernel/store";
import { getApp } from "@jaios/kernel/data/apps";
import { usePrefersReducedMotion } from "@jaios/kernel/hooks/use-reduced-motion";
import { AppIcon } from "./AppIcon";
import { cn } from "@/lib/utils";

/** Exposé-style overview: tiles every open window; click one to focus it. */
export function MissionControl() {
  const open = useOSStore((s) => s.missionControlOpen);
  const close = useOSStore((s) => s.closeMissionControl);
  const windows = useOSStore((s) => s.windows);
  const focusedId = useOSStore((s) => s.focusedId);
  const focusWindow = useOSStore((s) => s.focusWindow);
  const reduced = usePrefersReducedMotion();

  const ordered = [...windows].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          aria-label="Mission Control"
          initial={reduced ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.18 }}
          onClick={close}
          className="fixed inset-0 z-[110] flex flex-col items-center justify-center gap-8 bg-ink/30 p-10 backdrop-blur-xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-bg/90">Mission Control</p>

          {ordered.length === 0 ? (
            <p className="text-sm text-bg/80">No open windows.</p>
          ) : (
            <div className="flex max-w-5xl flex-wrap items-center justify-center gap-5">
              {ordered.map((w) => {
                const app = getApp(w.id);
                return (
                  <motion.button
                    key={w.id}
                    type="button"
                    initial={reduced ? false : { opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: reduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                    onClick={(e) => {
                      e.stopPropagation();
                      focusWindow(w.id);
                      close();
                    }}
                    className={cn(
                      "flex w-56 flex-col items-center gap-3 rounded-3xl border bg-surface/90 p-5 shadow-window transition-transform hover:-translate-y-1",
                      focusedId === w.id ? "border-accent/50 ring-2 ring-accent/30" : "border-line",
                    )}
                  >
                    <AppIcon app={app} size="lg" active={focusedId === w.id} />
                    <span className="text-sm font-medium text-ink">{app.name}</span>
                    <span className="text-xs text-muted">{w.minimized ? "Minimized" : "Open"}</span>
                  </motion.button>
                );
              })}
            </div>
          )}

          <p className="text-xs text-bg/70">Click a window to open it · Esc to close</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
