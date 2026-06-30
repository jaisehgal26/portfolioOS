"use client";

import { Plus, X } from "lucide-react";
import { JaiLogo } from "@jaios/ui/JaiLogo";
import { useBrowserStore, tabUrl, MAX_TABS } from "@jaios/kernel/browser-store";
import { favicon } from "@jaios/kernel/lib/url";
import { isInternalUrl, resolveTitle } from "./lib/routes";
import { cn } from "@jaios/ui/utils";

/** Deterministic hue per URL so every tab reads as distinct at a glance. */
function hueFor(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 360;
}

export function TabStrip() {
  const tabs = useBrowserStore((s) => s.tabs);
  const activeTabId = useBrowserStore((s) => s.activeTabId);
  const setActiveTab = useBrowserStore((s) => s.setActiveTab);
  const closeTab = useBrowserStore((s) => s.closeTab);
  const newTab = useBrowserStore((s) => s.newTab);

  const atMax = tabs.length >= MAX_TABS;

  return (
    <div role="tablist" aria-label="Browser tabs" className="flex items-end gap-1.5 border-b border-line bg-surface-2/70 px-2 pt-2">
      <div className="flex min-w-0 flex-1 items-end gap-1.5 overflow-hidden">
        {tabs.map((t) => {
          const url = tabUrl(t);
          const active = t.id === activeTabId;
          const internal = isInternalUrl(url);
          const color = `hsl(${hueFor(url)} 62% 52%)`;
          return (
            <div
              key={t.id}
              role="tab"
              aria-selected={active}
              tabIndex={0}
              onClick={() => setActiveTab(t.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveTab(t.id);
                }
              }}
              onAuxClick={(e) => {
                if (e.button === 1) closeTab(t.id);
              }}
              className={cn(
                "group relative flex h-9 min-w-0 flex-1 basis-0 max-w-[210px] cursor-default select-none items-center gap-2 rounded-t-lg pl-3 pr-2 text-sm outline-none transition-all focus-visible:ring-2 focus-visible:ring-accent",
                active
                  ? "z-10 -mb-px border border-b-0 border-line bg-bg text-ink shadow-[0_-2px_8px_-4px_rgba(0,0,0,0.18)]"
                  : "border border-line/60 bg-surface/40 text-muted hover:bg-surface hover:text-ink",
              )}
            >
              {/* Per-tab color: a top bar when active, a left rail when not. */}
              {active ? (
                <span aria-hidden className="absolute inset-x-2.5 top-0 h-[2px] rounded-full" style={{ background: color }} />
              ) : (
                <span aria-hidden className="absolute bottom-1.5 left-0 top-1.5 w-[2px] rounded-full opacity-80" style={{ background: color }} />
              )}

              <span
                className={cn(
                  "grid h-4 w-4 shrink-0 place-items-center rounded-[5px] transition-shadow",
                  active && "ring-1 ring-line",
                )}
                style={active ? undefined : { boxShadow: `inset 0 0 0 1px ${color}33` }}
              >
                {internal ? (
                  <JaiLogo className="h-3.5 w-3.5 text-ink" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={favicon(url)} alt="" width={14} height={14} className="h-3.5 w-3.5 rounded-sm" />
                )}
              </span>

              <span className="min-w-0 flex-1 truncate">{resolveTitle(url)}</span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(t.id);
                }}
                aria-label="Close tab"
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded transition-all hover:bg-ink/10",
                  active ? "opacity-70 hover:opacity-100" : "opacity-0 group-hover:opacity-100",
                )}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>
      {!atMax && (
        <button
          type="button"
          onClick={() => newTab()}
          aria-label="New tab"
          className="mb-1.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-ink/10 hover:text-ink"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
