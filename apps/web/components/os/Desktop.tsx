"use client";

import { Sparkles } from "lucide-react";
import { useOSStore } from "@jaios/kernel/store";
import { APPS } from "@jaios/kernel/data/apps";
import { useIsMobile } from "@jaios/kernel/hooks/use-media-query";
import { AppIcon } from "@jaios/ui/AppIcon";
import { DesktopWidgets, ClockWidget, QuoteWidget } from "./DesktopWidgets";

const desktopApps = APPS.filter((a) => a.onDesktop);

export function Desktop() {
  const openApp = useOSStore((s) => s.openApp);
  const openContextMenu = useOSStore((s) => s.openContextMenu);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="relative flex h-full flex-col overflow-y-auto px-5 pb-10 pt-16">
        <div className="grid grid-cols-4 gap-x-2 gap-y-5">
          {APPS.filter((a) => a.inDock || a.onDesktop).map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => openApp(app.id)}
              className="flex flex-col items-center gap-1.5"
              aria-label={`Open ${app.name}`}
            >
              <AppIcon app={app} size="md" />
              <span className="line-clamp-1 text-center text-[11px] font-medium text-ink">
                {app.shortName}
              </span>
            </button>
          ))}
        </div>

        {/* Widgets pinned to the bottom: clock above the thought of the day. */}
        <div className="mt-auto space-y-3 pt-8">
          <ClockWidget />
          <QuoteWidget />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full"
      onContextMenu={(e) => {
        e.preventDefault();
        openContextMenu(e.clientX, e.clientY);
      }}
    >
      {/* Desktop icons */}
      <div className="absolute left-4 top-16 grid grid-cols-2 gap-x-1 gap-y-3 sm:left-6">
        {desktopApps.map((app) => (
          <button
            key={app.id}
            type="button"
            onClick={() => openApp(app.id)}
            className="group flex w-20 flex-col items-center gap-1.5 rounded-2xl p-1.5 transition-colors hover:bg-ink/5"
            aria-label={`Open ${app.name}`}
          >
            <AppIcon app={app} size="md" className="transition-transform duration-200 group-hover:scale-105" />
            <span className="line-clamp-1 text-center text-[11px] font-medium text-ink drop-shadow-sm">
              {app.shortName}
            </span>
          </button>
        ))}
      </div>

      {/* Widgets */}
      <div className="absolute right-5 top-16 hidden lg:block">
        <DesktopWidgets />
      </div>

      {/* Camouflaged secret folder — barely visible until you go looking. */}
      <button
        type="button"
        onClick={() => openApp("secret")}
        aria-label="A hidden folder"
        title="?"
        className="group absolute bottom-6 left-6 z-10 grid h-9 w-9 place-items-center rounded-lg text-ink/[0.07] transition-all duration-200 hover:bg-ink/5 hover:text-accent"
      >
        <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" />
      </button>
    </div>
  );
}
