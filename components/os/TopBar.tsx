"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BatteryMedium, Bell, Briefcase, Code2, Moon, Search, Sun, Wifi } from "lucide-react";
import { useOSStore } from "@/store/os-store";
import { getApp } from "@/data/apps";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { JaiLogo } from "./JaiLogo";
import { cn } from "@/lib/utils";

interface MenuEntry {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

function MenuButton({
  label,
  items,
  bold,
  brand,
}: {
  label: React.ReactNode;
  items: MenuEntry[];
  bold?: boolean;
  brand?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "rounded-md px-2 py-1 text-sm transition-colors hover:bg-ink/5",
          open && "bg-ink/5",
          bold ? "font-semibold text-ink" : "text-muted hover:text-ink",
          brand && "font-semibold text-ink",
        )}
      >
        {label}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: reduced ? 0 : 0.15 }}
            className="glass-strong absolute left-0 top-full z-50 mt-1.5 w-56 rounded-2xl p-1.5 shadow-card"
          >
            {items.map((item, i) =>
              item.label === "—" ? (
                <div key={i} className="my-1 h-px bg-line" />
              ) : (
                <button
                  key={i}
                  role="menuitem"
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center rounded-lg px-3 py-1.5 text-left text-sm transition-colors",
                    item.disabled
                      ? "cursor-default text-faint"
                      : item.danger
                        ? "text-danger hover:bg-danger/10"
                        : "text-ink hover:bg-ink/5",
                  )}
                >
                  {item.label}
                </button>
              ),
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TopBar() {
  const openApp = useOSStore((s) => s.openApp);
  const restart = useOSStore((s) => s.restart);
  const theme = useOSStore((s) => s.theme);
  const toggleTheme = useOSStore((s) => s.toggleTheme);
  const mode = useOSStore((s) => s.mode);
  const setMode = useOSStore((s) => s.setMode);
  const setHelpOpen = useOSStore((s) => s.setHelpOpen);
  const pushToast = useOSStore((s) => s.pushToast);
  const toggleSpotlight = useOSStore((s) => s.toggleSpotlight);
  const toggleNC = useOSStore((s) => s.toggleNotificationCenter);
  const focusedId = useOSStore((s) => s.focusedId);
  const windows = useOSStore((s) => s.windows);
  const closeWindow = useOSStore((s) => s.closeWindow);
  const minimizeWindow = useOSStore((s) => s.minimizeWindow);
  const focusWindow = useOSStore((s) => s.focusWindow);
  const notifications = useOSStore((s) => s.notifications);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const focusedApp = focusedId ? getApp(focusedId) : null;
  const unread = notifications.filter((n) => !n.read).length;

  const time = now ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
  const date = now ? now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }) : "";

  return (
    <div className="glass fixed inset-x-0 top-0 z-40 flex h-11 items-center justify-between px-2.5 sm:px-3.5">
      {/* Left */}
      <div className="flex items-center gap-0.5">
        <MenuButton
          brand
          label={
            <span className="flex items-center gap-1.5">
              <JaiLogo className="h-[18px] w-[18px]" />
              JaiOS
            </span>
          }
          items={[
            { label: "About JaiOS", onClick: () => openApp("about") },
            { label: "Quick Hire", onClick: () => openApp("quick-hire") },
            { label: "Resume", onClick: () => openApp("resume") },
            { label: "Projects", onClick: () => openApp("projects") },
            { label: "Contact", onClick: () => openApp("contact") },
            { label: "—" },
            { label: "System Settings", onClick: () => openApp("settings") },
            { label: "—" },
            { label: "Restart Experience", onClick: restart, danger: true },
          ]}
        />

        <span className="hidden sm:block">
          <MenuButton
            bold
            label={focusedApp ? focusedApp.name : "Desktop"}
            items={[
              { label: focusedApp ? `Close ${focusedApp.shortName}` : "No window open", onClick: focusedId ? () => closeWindow(focusedId) : undefined, disabled: !focusedId },
              { label: "Minimize", onClick: focusedId ? () => minimizeWindow(focusedId) : undefined, disabled: !focusedId },
            ]}
          />
        </span>

        <span className="hidden md:flex items-center">
          <MenuButton
            label="Window"
            items={
              windows.length
                ? windows.map((w) => ({ label: getApp(w.id).name, onClick: () => focusWindow(w.id) }))
                : [{ label: "No open windows", disabled: true }]
            }
          />
          <MenuButton
            label="Help"
            items={[
              { label: "About this portfolio", onClick: () => openApp("about") },
              { label: "Keyboard shortcuts", onClick: () => setHelpOpen(true) },
              { label: "Search (⌘K)", onClick: toggleSpotlight },
            ]}
          />
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 text-muted">
        <button
          type="button"
          onClick={toggleSpotlight}
          aria-label="Open search"
          className="grid h-7 w-7 place-items-center rounded-md transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <Search className="h-[15px] w-[15px]" />
        </button>
        <button
          type="button"
          onClick={() => {
            const next = mode === "recruiter" ? "engineer" : "recruiter";
            setMode(next);
            pushToast(next === "recruiter" ? "Recruiter mode" : "Engineer mode");
          }}
          aria-label={`Switch view mode, currently ${mode}`}
          className="hidden items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:border-line-strong sm:inline-flex"
        >
          {mode === "recruiter" ? (
            <Briefcase className="h-3.5 w-3.5 text-accent" />
          ) : (
            <Code2 className="h-3.5 w-3.5 text-violet" />
          )}
          <span className="capitalize">{mode}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            toggleTheme();
            pushToast(theme === "dark" ? "Light theme" : "Dark theme");
          }}
          aria-label="Toggle theme"
          className="grid h-7 w-7 place-items-center rounded-md transition-colors hover:bg-ink/5 hover:text-ink"
        >
          {theme === "dark" ? <Sun className="h-[15px] w-[15px]" /> : <Moon className="h-[15px] w-[15px]" />}
        </button>
        <Wifi className="hidden h-[15px] w-[15px] sm:block" aria-hidden />
        <BatteryMedium className="hidden h-[18px] w-[18px] sm:block" aria-hidden />
        <button
          type="button"
          onClick={toggleNC}
          aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
          className="relative grid h-7 w-7 place-items-center rounded-md transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <Bell className="h-[15px] w-[15px]" />
          {unread > 0 && (
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-accent" />
          )}
        </button>
        <button
          type="button"
          onClick={toggleNC}
          className="ml-1 rounded-md px-2 py-1 text-xs font-medium text-ink transition-colors hover:bg-ink/5"
          suppressHydrationWarning
        >
          <span className="hidden sm:inline">{date} </span>
          {time}
        </button>
      </div>
    </div>
  );
}
