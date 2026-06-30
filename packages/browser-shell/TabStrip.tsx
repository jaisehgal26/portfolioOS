"use client";

import { Plus, X } from "lucide-react";
import { JaiLogo } from "@jaios/ui/JaiLogo";
import { useBrowserStore, tabUrl } from "@jaios/kernel/browser-store";
import { favicon } from "@jaios/kernel/lib/url";
import { isInternalUrl, resolveTitle } from "./lib/routes";
import { cn } from "@jaios/ui/utils";

export function TabStrip() {
  const tabs = useBrowserStore((s) => s.tabs);
  const activeTabId = useBrowserStore((s) => s.activeTabId);
  const setActiveTab = useBrowserStore((s) => s.setActiveTab);
  const closeTab = useBrowserStore((s) => s.closeTab);
  const newTab = useBrowserStore((s) => s.newTab);

  return (
    <div role="tablist" aria-label="Browser tabs" className="flex items-end gap-1 border-b border-line bg-surface-2/60 px-2 pt-1.5">
      <div className="flex min-w-0 flex-1 items-end gap-1 overflow-x-auto">
        {tabs.map((t) => {
          const url = tabUrl(t);
          const active = t.id === activeTabId;
          const internal = isInternalUrl(url);
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
                "group flex h-8 min-w-[44px] max-w-[190px] cursor-default select-none items-center gap-2 rounded-t-lg px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent",
                active ? "bg-bg text-ink" : "text-muted hover:bg-bg/50",
              )}
            >
              {internal ? (
                <JaiLogo className="h-3.5 w-3.5 shrink-0 text-ink" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={favicon(url)} alt="" width={14} height={14} className="h-3.5 w-3.5 shrink-0 rounded-sm" />
              )}
              <span className="min-w-0 flex-1 truncate">{resolveTitle(url)}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(t.id);
                }}
                aria-label="Close tab"
                className="grid h-5 w-5 shrink-0 place-items-center rounded opacity-0 transition-opacity hover:bg-ink/10 group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => newTab()}
        aria-label="New tab"
        className="mb-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
