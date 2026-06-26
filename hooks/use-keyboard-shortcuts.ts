"use client";

import { useEffect } from "react";
import { useOSStore, type AppId } from "@/store/os-store";

const NUMBER_APPS: Record<string, AppId> = {
  "1": "quick-hire",
  "2": "projects",
  "3": "resume",
  "4": "contact",
};

/**
 * Global OS keyboard shortcuts (registered once from the OS root):
 *  - Cmd/Ctrl + K → toggle Spotlight
 *  - Cmd/Ctrl + 1..4 → open Quick Hire / Projects / Resume / Contact
 */
export function useGlobalShortcuts() {
  const toggleSpotlight = useOSStore((s) => s.toggleSpotlight);
  const openApp = useOSStore((s) => s.openApp);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta) return;
      const key = e.key.toLowerCase();
      if (key === "k") {
        e.preventDefault();
        toggleSpotlight();
        return;
      }
      if (NUMBER_APPS[e.key]) {
        e.preventDefault();
        openApp(NUMBER_APPS[e.key]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleSpotlight, openApp]);
}
