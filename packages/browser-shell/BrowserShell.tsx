"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useOSStore } from "@jaios/kernel/store";
import { useBrowserStore } from "@jaios/kernel/browser-store";
import { usePrefersReducedMotion } from "@jaios/kernel/hooks/use-reduced-motion";
import { TabStrip } from "./TabStrip";
import { NavControls } from "./NavControls";
import { Omnibox } from "./Omnibox";
import { Viewport } from "./Viewport";

/** JaiBrowser — the browser-themed shell (tabs, omnibox, pages, DevTools). */
export function BrowserShell() {
  const reduced = usePrefersReducedMotion();
  const hydrate = useBrowserStore((s) => s.hydrate);
  const setSoundEnabled = useBrowserStore((s) => s.setSoundEnabled);
  const soundEnabled = useOSStore((s) => s.soundEnabled);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Honor the OS-wide sound preference.
  useEffect(() => {
    setSoundEnabled(soundEnabled);
  }, [soundEnabled, setSoundEnabled]);

  return (
    <motion.div
      key="browser"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0 : 0.3 }}
      className="fixed inset-0 flex flex-col overflow-hidden bg-surface-2/40"
    >
      <TabStrip />
      <div className="flex shrink-0 items-center gap-1.5 border-b border-line bg-surface px-2.5 py-2">
        <NavControls />
        <Omnibox />
      </div>
      <Viewport />
    </motion.div>
  );
}
