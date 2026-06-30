"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOSStore, type AppId } from "@jaios/kernel/store";
import { getApp } from "@jaios/kernel/data/apps";
import { usePrefersReducedMotion } from "@jaios/kernel/hooks/use-reduced-motion";
import { AppIcon } from "./AppIcon";
import { cn } from "@/lib/utils";

/**
 * ⌘/Ctrl + Tab window switcher. Hold the modifier and press Tab to cycle
 * (Shift+Tab to go back); release the modifier to commit.
 *
 * Note: some browsers reserve Ctrl/⌘+Tab for switching browser tabs, in which
 * case the keystroke never reaches the page. The TopBar "Window" menu offers a
 * reliable fallback.
 */
export function AppSwitcher() {
  const focusWindow = useOSStore((s) => s.focusWindow);
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const openRef = useRef(false);
  const idxRef = useRef(0);
  const orderRef = useRef<AppId[]>([]);

  useEffect(() => {
    function onDown(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === "Tab") {
        const wins = useOSStore.getState().windows;
        if (wins.length === 0) return;
        e.preventDefault();
        if (!openRef.current) {
          orderRef.current = [...wins].sort((a, b) => b.zIndex - a.zIndex).map((w) => w.id);
          idxRef.current = orderRef.current.length > 1 ? 1 : 0;
          openRef.current = true;
          setOpen(true);
        } else {
          const n = orderRef.current.length;
          idxRef.current = e.shiftKey ? (idxRef.current - 1 + n) % n : (idxRef.current + 1) % n;
        }
        setIdx(idxRef.current);
      } else if (e.key === "Escape" && openRef.current) {
        openRef.current = false;
        setOpen(false);
      }
    }
    function onUp(e: KeyboardEvent) {
      if ((e.key === "Meta" || e.key === "Control") && openRef.current) {
        const id = orderRef.current[idxRef.current];
        if (id) focusWindow(id);
        openRef.current = false;
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [focusWindow]);

  return (
    <AnimatePresence>
      {open && orderRef.current.length > 0 && (
        <motion.div
          aria-label="Window switcher"
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.12 }}
          className="fixed inset-0 z-[120] grid place-items-center"
        >
          <div className="glass-strong flex max-w-[90vw] gap-2 overflow-x-auto rounded-3xl p-3 shadow-window">
            {orderRef.current.map((id, i) => {
              const app = getApp(id);
              return (
                <div
                  key={id}
                  className={cn(
                    "flex w-24 shrink-0 flex-col items-center gap-2 rounded-2xl p-3 transition-colors",
                    i === idx ? "bg-ink/[0.08]" : "",
                  )}
                >
                  <AppIcon app={app} size="lg" active={i === idx} />
                  <span className="line-clamp-1 text-center text-xs font-medium text-ink">{app.shortName}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
