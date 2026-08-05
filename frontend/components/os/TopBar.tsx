"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Search, SlidersHorizontal, WifiOff } from "lucide-react";
import { useOSStore } from "@/store/os-store";
import { getApp } from "@/data/apps";
import { FINDER_SECTIONS } from "@/data/sections";
import { useOnline } from "@/hooks/use-online";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useCurrentTime } from "@/hooks/use-current-time";
import { useDismissOnOutside } from "@/hooks/use-dismiss-on-outside";
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
  const ref = useDismissOnOutside<HTMLDivElement>(open, () => setOpen(false));
  const reduced = usePrefersReducedMotion();

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
  const online = useOnline();
  const openApp = useOSStore((s) => s.openApp);
  const openFinderAt = useOSStore((s) => s.openFinderAt);
  const lock = useOSStore((s) => s.lock);
  const toggleMissionControl = useOSStore((s) => s.toggleMissionControl);
  const setHelpOpen = useOSStore((s) => s.setHelpOpen);
  const startTour = useOSStore((s) => s.startTour);
  const toggleSpotlight = useOSStore((s) => s.toggleSpotlight);
  const toggleNC = useOSStore((s) => s.toggleNotificationCenter);
  const toggleControlCenter = useOSStore((s) => s.toggleControlCenter);
  const toggleCalendar = useOSStore((s) => s.toggleCalendar);
  const focusedId = useOSStore((s) => s.focusedId);
  const windows = useOSStore((s) => s.windows);
  const closeWindow = useOSStore((s) => s.closeWindow);
  const minimizeWindow = useOSStore((s) => s.minimizeWindow);
  const toggleMaximize = useOSStore((s) => s.toggleMaximize);
  const focusWindow = useOSStore((s) => s.focusWindow);
  const notifications = useOSStore((s) => s.notifications);
  const hour12 = useOSStore((s) => s.hour12);
  const now = useCurrentTime(1000);

  const focusedApp = focusedId ? getApp(focusedId) : null;
  const unread = notifications.filter((n) => !n.read).length;

  const date = now ? now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }) : "";
  const time = now
    ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12 })
    : "";

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
            { label: "About", onClick: () => openFinderAt("about") },
            { label: "—" },
            { label: "System Settings", onClick: () => openApp("settings") },
            { label: "—" },
            { label: "Lock Screen", onClick: lock, danger: true },
          ]}
        />

        <span className="hidden sm:block">
          <MenuButton
            bold
            label={focusedApp ? focusedApp.name : "Desktop"}
            items={
              focusedId
                ? [
                    { label: `Close ${focusedApp?.shortName}`, onClick: () => closeWindow(focusedId) },
                    { label: "Minimize", onClick: () => minimizeWindow(focusedId) },
                    { label: "Maximize / Restore", onClick: () => toggleMaximize(focusedId) },
                  ]
                : [{ label: "No window open", disabled: true }]
            }
          />
        </span>

        <span className="hidden md:flex items-center">
          {focusedId === "finder" && (
            <MenuButton
              label="Go"
              items={FINDER_SECTIONS.map((s) => ({ label: s.label, onClick: () => openFinderAt(s.id) }))}
            />
          )}
          <MenuButton
            label="Window"
            items={[
              { label: "Mission Control (F3)", onClick: toggleMissionControl },
              { label: "—" },
              ...(windows.length
                ? windows.map((w) => ({ label: getApp(w.id).name, onClick: () => focusWindow(w.id) }))
                : [{ label: "No open windows", disabled: true }]),
            ]}
          />
          <MenuButton
            label="Help"
            items={[
              { label: "Take a tour", onClick: startTour },
              { label: "Keyboard shortcuts", onClick: () => setHelpOpen(true) },
              { label: "Search (⌘K)", onClick: toggleSpotlight },
            ]}
          />
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 text-muted">
        {!online && (
          <span className="mr-1 hidden items-center gap-1 rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted sm:inline-flex">
            <WifiOff className="h-3 w-3" />
            Offline
          </span>
        )}
        <button
          type="button"
          onClick={toggleSpotlight}
          data-tour="spotlight"
          aria-label="Open search"
          className="grid h-7 w-7 place-items-center rounded-md transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <Search className="h-[15px] w-[15px]" />
        </button>
        <button
          type="button"
          onClick={toggleControlCenter}
          aria-label="Control center"
          className="grid h-7 w-7 place-items-center rounded-md transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <SlidersHorizontal className="h-[15px] w-[15px]" aria-hidden />
        </button>
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
          onClick={toggleCalendar}
          aria-label="Date and calendar"
          className="ml-1 flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium text-ink transition-colors hover:bg-ink/5"
          suppressHydrationWarning
        >
          <span className="hidden sm:inline">{date}</span>
          <span className="tabular-nums">{time}</span>
        </button>
      </div>
    </div>
  );
}
