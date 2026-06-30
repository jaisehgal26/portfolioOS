"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { useOSStore } from "@jaios/kernel/store";
import { useBrowserStore } from "@jaios/kernel/browser-store";
import { usePrefersReducedMotion } from "@jaios/kernel/hooks/use-reduced-motion";
import { cn } from "@jaios/ui/utils";
import { TabStrip } from "./TabStrip";
import { NavControls } from "./NavControls";
import { Omnibox } from "./Omnibox";
import { BookmarksBar } from "./BookmarksBar";
import { BrowserMenu } from "./BrowserMenu";
import { Viewport } from "./Viewport";
import { DEFAULT_BOOKMARKS } from "./data/default-bookmarks";

/** JaiBrowser — the browser-themed shell (tabs, omnibox, pages, DevTools). */
export function BrowserShell() {
  const reduced = usePrefersReducedMotion();
  const hydrate = useBrowserStore((s) => s.hydrate);
  const seedBookmarks = useBrowserStore((s) => s.seedBookmarks);
  const setSoundEnabled = useBrowserStore((s) => s.setSoundEnabled);
  const navigate = useBrowserStore((s) => s.navigate);
  const downloads = useBrowserStore((s) => s.downloads);
  const incognito = useBrowserStore((s) => s.incognito);
  const soundEnabled = useOSStore((s) => s.soundEnabled);

  useEffect(() => {
    hydrate();
    seedBookmarks(DEFAULT_BOOKMARKS);
  }, [hydrate, seedBookmarks]);

  useEffect(() => {
    setSoundEnabled(soundEnabled);
  }, [soundEnabled, setSoundEnabled]);

  return (
    <motion.div
      key="browser"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0 : 0.3 }}
      className={cn("fixed inset-0 flex flex-col overflow-hidden bg-surface-2/40", incognito && "dark")}
    >
      <TabStrip />
      <div className="flex shrink-0 items-center gap-1.5 border-b border-line bg-surface px-2.5 py-2">
        <NavControls />
        <Omnibox />
        <button
          type="button"
          onClick={() => navigate("jai://downloads")}
          aria-label="Downloads"
          className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full text-faint transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <Download className="h-4 w-4" />
          {downloads.length > 0 && (
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-accent" />
          )}
        </button>
        <BrowserMenu />
      </div>
      <BookmarksBar />
      <Viewport />
    </motion.div>
  );
}
