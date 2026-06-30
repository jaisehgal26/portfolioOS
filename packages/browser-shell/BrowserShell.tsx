"use client";

import { motion } from "framer-motion";
import { Globe, Monitor } from "lucide-react";
import { useOSStore } from "@jaios/kernel/store";
import { usePrefersReducedMotion } from "@jaios/kernel/hooks/use-reduced-motion";

/**
 * JaiBrowser — the browser-themed shell. Phase 0 stub; the chrome, tabs,
 * omnibox, pages and DevTools are built up in later phases.
 */
export function BrowserShell() {
  const reduced = usePrefersReducedMotion();
  const setShellMode = useOSStore((s) => s.setShellMode);

  return (
    <motion.div
      key="browser"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0 : 0.4 }}
      className="fixed inset-0 grid place-items-center overflow-hidden bg-bg"
    >
      <div className="text-center">
        <Globe className="mx-auto h-10 w-10 text-accent" />
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">JaiBrowser</h1>
        <p className="mt-1 text-sm text-muted">Everything runs in the browser.</p>
        <button
          type="button"
          onClick={() => setShellMode("os")}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink shadow-soft transition-colors hover:bg-ink/5"
        >
          <Monitor className="h-4 w-4" /> Switch to OS
        </button>
      </div>
    </motion.div>
  );
}
