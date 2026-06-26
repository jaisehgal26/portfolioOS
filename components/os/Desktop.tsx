"use client";

import { useOSStore } from "@/store/os-store";
import { APPS } from "@/data/apps";
import { profile } from "@/data/profile";
import { useIsMobile } from "@/hooks/use-media-query";
import { AppIcon } from "./AppIcon";
import { DesktopWidgets } from "./DesktopWidgets";

const desktopApps = APPS.filter((a) => a.onDesktop);

export function Desktop() {
  const openApp = useOSStore((s) => s.openApp);
  const openContextMenu = useOSStore((s) => s.openContextMenu);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="relative h-full overflow-y-auto px-5 pb-28 pt-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-accent to-amber font-display text-lg font-semibold text-white shadow-soft">
            JS
          </span>
          <div>
            <p className="font-display text-xl font-semibold tracking-tight text-ink">{profile.name}</p>
            <p className="text-sm text-muted">{profile.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-x-2 gap-y-5">
          {APPS.map((app) => (
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

        <div className="mt-8 glass rounded-3xl p-4 shadow-soft">
          <p className="text-xs font-medium uppercase tracking-wider text-faint">Latest focus</p>
          <p className="mt-1 text-sm leading-relaxed text-ink">
            Building real-time, AI-assisted frontend systems — dashboards, chat, payments and AI UIs.
          </p>
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
    </div>
  );
}
