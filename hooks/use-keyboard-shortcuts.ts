"use client";

import { useEffect } from "react";
import { useOSStore } from "@/store/os-store";

const NUMBER_SECTIONS: Record<string, string> = {
  "1": "quick-hire",
  "2": "work",
  "3": "resume",
  "4": "contact",
};

/**
 * Global OS keyboard shortcuts (registered once from the OS root):
 *  - ⌘/Ctrl + K       → Spotlight
 *  - ⌘/Ctrl + ,       → Settings
 *  - ⌘/Ctrl + W       → close focused window
 *  - ⌘/Ctrl + M       → minimize focused window
 *  - ⌘/Ctrl + 1..4    → jump to a Dossier section
 * (⌘/Ctrl + Tab app switcher is handled by <AppSwitcher />.)
 */
export function useGlobalShortcuts() {
  const toggleSpotlight = useOSStore((s) => s.toggleSpotlight);
  const openApp = useOSStore((s) => s.openApp);
  const openFinderAt = useOSStore((s) => s.openFinderAt);
  const closeWindow = useOSStore((s) => s.closeWindow);
  const minimizeWindow = useOSStore((s) => s.minimizeWindow);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "F3") {
        e.preventDefault();
        useOSStore.getState().toggleMissionControl();
        return;
      }
      if (e.key === "Escape") {
        useOSStore.getState().closeMissionControl();
      }
      const meta = e.metaKey || e.ctrlKey;
      if (!meta) return;
      const key = e.key.toLowerCase();

      if (key === "k") {
        e.preventDefault();
        toggleSpotlight();
        return;
      }
      if (key === ",") {
        e.preventDefault();
        openApp("settings");
        return;
      }

      const focused = useOSStore.getState().focusedId;
      if (key === "w" && focused) {
        e.preventDefault();
        closeWindow(focused);
        return;
      }
      if (key === "m" && focused) {
        e.preventDefault();
        minimizeWindow(focused);
        return;
      }

      if (NUMBER_SECTIONS[e.key]) {
        e.preventDefault();
        openFinderAt(NUMBER_SECTIONS[e.key]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleSpotlight, openApp, openFinderAt, closeWindow, minimizeWindow]);
}
