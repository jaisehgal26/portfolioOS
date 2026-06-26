"use client";

import { FileText, Sparkles, X } from "lucide-react";
import { useOSStore } from "@/store/os-store";
import { APPS } from "@/data/apps";
import { profile } from "@/data/profile";
import { FILE_DRAG_TYPE, getFile } from "@/data/files";
import { useIsMobile } from "@/hooks/use-media-query";
import { AppIcon } from "./AppIcon";
import { Monogram } from "./Monogram";
import { DesktopWidgets } from "./DesktopWidgets";
import { clamp } from "@/lib/utils";

const desktopApps = APPS.filter((a) => a.onDesktop);

export function Desktop() {
  const openApp = useOSStore((s) => s.openApp);
  const openContextMenu = useOSStore((s) => s.openContextMenu);
  const openFile = useOSStore((s) => s.openFile);
  const desktopFiles = useOSStore((s) => s.desktopFiles);
  const addDesktopFile = useOSStore((s) => s.addDesktopFile);
  const removeDesktopFile = useOSStore((s) => s.removeDesktopFile);
  const isMobile = useIsMobile();

  function onDrop(e: React.DragEvent) {
    const id = e.dataTransfer.getData(FILE_DRAG_TYPE) || e.dataTransfer.getData("text/plain");
    if (!id || !getFile(id)) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left - 40, 8, rect.width - 88);
    const y = clamp(e.clientY - rect.top - 24, 60, rect.height - 110);
    addDesktopFile(id, x, y);
  }

  if (isMobile) {
    return (
      <div className="relative h-full overflow-y-auto px-5 pb-28 pt-16">
        <div className="mb-6 flex items-center gap-3">
          <Monogram size="md" className="rounded-2xl" />
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
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }}
      onDrop={onDrop}
    >
      {/* Files dragged onto the desktop */}
      {desktopFiles.map((df) => {
        const file = getFile(df.id);
        if (!file) return null;
        return (
          <div
            key={df.id}
            className="group absolute z-10 w-20"
            style={{ left: df.x, top: df.y }}
          >
            <button
              type="button"
              onClick={() => openFile(df.id)}
              className="flex w-full flex-col items-center gap-1.5 rounded-2xl p-1.5 transition-colors hover:bg-ink/5"
              aria-label={`Open ${file.title}`}
            >
              <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-gradient-to-b from-surface to-surface-2 text-ink/70 shadow-soft ring-1 ring-line">
                <FileText className="h-[22px] w-[22px]" />
              </span>
              <span className="line-clamp-1 text-center text-[11px] font-medium text-ink drop-shadow-sm">
                {file.title}
              </span>
            </button>
            <button
              type="button"
              onClick={() => removeDesktopFile(df.id)}
              aria-label={`Remove ${file.title} from desktop`}
              className="absolute -right-0.5 -top-0.5 hidden h-5 w-5 place-items-center rounded-full border border-line bg-surface text-muted shadow-soft hover:text-ink group-hover:grid"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}

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
