"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FolderKanban, FileText, Mail, Image, MoonStar, Info } from "lucide-react";
import { useOSStore } from "@jaios/kernel/store";
import { usePrefersReducedMotion } from "@jaios/kernel/hooks/use-reduced-motion";
import { useDismissOnOutside } from "@jaios/kernel/hooks/use-dismiss-on-outside";

export function ContextMenu() {
  const ctx = useOSStore((s) => s.contextMenu);
  const close = useOSStore((s) => s.closeContextMenu);
  const openApp = useOSStore((s) => s.openApp);
  const openFinderAt = useOSStore((s) => s.openFinderAt);
  const toggleTheme = useOSStore((s) => s.toggleTheme);
  const reduced = usePrefersReducedMotion();
  const menuRef = useDismissOnOutside<HTMLDivElement>(ctx.open, close);

  const items = [
    { label: "Open Work", icon: FolderKanban, onClick: () => openFinderAt("work") },
    { label: "Open Resume", icon: FileText, onClick: () => openFinderAt("resume") },
    { label: "Open Contact", icon: Mail, onClick: () => openFinderAt("contact") },
    { sep: true as const },
    { label: "Change Wallpaper", icon: Image, onClick: () => openApp("settings") },
    { label: "Toggle Dark Mode", icon: MoonStar, onClick: toggleTheme },
    { sep: true as const },
    { label: "About", icon: Info, onClick: () => openFinderAt("about") },
  ];

  const x = Math.min(ctx.x, (typeof window !== "undefined" ? window.innerWidth : 9999) - 220);
  const y = Math.min(ctx.y, (typeof window !== "undefined" ? window.innerHeight : 9999) - 280);

  return (
    <AnimatePresence>
      {ctx.open && (
        <motion.div
          ref={menuRef}
          role="menu"
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
          style={{ left: x, top: y, transformOrigin: "top left" }}
          className="glass-strong fixed z-[90] w-52 rounded-xl p-1.5 shadow-card"
        >
          {items.map((item, i) =>
            "sep" in item ? (
              <div key={i} className="my-1 h-px bg-line" />
            ) : (
              <button
                key={i}
                role="menuitem"
                type="button"
                onClick={() => {
                  item.onClick?.();
                  close();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-left text-sm text-ink transition-colors hover:bg-ink/5"
              >
                <item.icon className="h-4 w-4 text-muted" />
                {item.label}
              </button>
            ),
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
