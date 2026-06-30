"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  Download,
  EyeOff,
  History,
  Monitor,
  Moon,
  MoreVertical,
  PanelBottom,
  Plus,
  Sun,
  Wrench,
} from "lucide-react";
import { useOSStore } from "@jaios/kernel/store";
import { useBrowserStore } from "@jaios/kernel/browser-store";
import { useDismissOnOutside } from "@jaios/kernel/hooks/use-dismiss-on-outside";
import { usePrefersReducedMotion } from "@jaios/kernel/hooks/use-reduced-motion";

export function BrowserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useDismissOnOutside<HTMLDivElement>(open, () => setOpen(false));
  const reduced = usePrefersReducedMotion();

  const navigate = useBrowserStore((s) => s.navigate);
  const newTab = useBrowserStore((s) => s.newTab);
  const toggleBookmarksBar = useBrowserStore((s) => s.toggleBookmarksBar);
  const toggleDevtools = useBrowserStore((s) => s.toggleDevtools);
  const toggleIncognito = useBrowserStore((s) => s.toggleIncognito);
  const incognito = useBrowserStore((s) => s.incognito);
  const theme = useOSStore((s) => s.theme);
  const toggleTheme = useOSStore((s) => s.toggleTheme);
  const setShellMode = useOSStore((s) => s.setShellMode);

  type Item = { label: string; icon: typeof Plus; onClick: () => void };
  const groups: Item[][] = [
    [
      { label: "New tab", icon: Plus, onClick: () => newTab() },
      { label: "Bookmarks", icon: Bookmark, onClick: () => navigate("jai://bookmarks") },
      { label: "History", icon: History, onClick: () => navigate("jai://history") },
      { label: "Downloads", icon: Download, onClick: () => navigate("jai://downloads") },
    ],
    [
      { label: "Toggle bookmarks bar", icon: PanelBottom, onClick: toggleBookmarksBar },
      { label: theme === "dark" ? "Light theme" : "Dark theme", icon: theme === "dark" ? Sun : Moon, onClick: toggleTheme },
      { label: "Open DevTools", icon: Wrench, onClick: toggleDevtools },
      { label: incognito ? "Exit incognito" : "Incognito", icon: EyeOff, onClick: toggleIncognito },
    ],
    [{ label: "Switch to OS", icon: Monitor, onClick: () => setShellMode("os") }],
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Browser menu"
        className="grid h-8 w-8 place-items-center rounded-full text-faint transition-colors hover:bg-ink/5 hover:text-ink"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: reduced ? 0 : 0.15 }}
            className="glass-strong absolute right-0 top-full z-50 mt-1.5 w-56 rounded-2xl p-1.5 shadow-card"
          >
            {groups.map((group, gi) => (
              <div key={gi} className={gi > 0 ? "mt-1 border-t border-line pt-1" : ""}>
                {group.map((item) => (
                  <button
                    key={item.label}
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      item.onClick();
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-left text-sm text-ink transition-colors hover:bg-ink/5"
                  >
                    <item.icon className="h-4 w-4 text-muted" />
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
