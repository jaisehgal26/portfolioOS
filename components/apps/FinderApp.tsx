"use client";

import { useMemo, useState } from "react";
import { ChevronRight, LayoutGrid, List, Search, Star } from "lucide-react";
import { AppTwoPane } from "@/components/ui/AppShell";
import { APPS, type AppCategory } from "@/data/apps";
import { useOSStore } from "@/store/os-store";
import { AppIcon } from "@/components/os/AppIcon";
import { cn } from "@/lib/utils";

const GROUPS: { id: AppCategory | "all"; label: string }[] = [
  { id: "all", label: "All Items" },
  { id: "favorites", label: "Favorites" },
  { id: "career", label: "Career" },
  { id: "case-studies", label: "Case Studies" },
  { id: "lab", label: "Lab" },
  { id: "system", label: "System" },
];

export function FinderApp() {
  const openApp = useOSStore((s) => s.openApp);
  const [group, setGroup] = useState<AppCategory | "all">("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const base = group === "all" ? APPS : APPS.filter((a) => a.category === group);
    const q = query.trim().toLowerCase();
    return q ? base.filter((a) => `${a.name} ${a.description}`.toLowerCase().includes(q)) : base;
  }, [group, query]);

  const groupLabel = GROUPS.find((g) => g.id === group)?.label ?? "All Items";

  return (
    <AppTwoPane
      sidebar={
        <div className="flex gap-1 p-2 md:flex-col">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroup(g.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors",
                group === g.id ? "bg-ink/[0.06] text-ink" : "text-muted hover:bg-ink/[0.04] hover:text-ink",
              )}
            >
              {g.id === "favorites" && <Star className="h-3.5 w-3.5 text-amber" />}
              {g.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="flex h-full flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-1 text-sm text-muted">
            <span>Portfolio</span>
            <ChevronRight className="h-3.5 w-3.5 text-faint" />
            <span className="truncate font-medium text-ink">{groupLabel}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1">
              <Search className="h-3.5 w-3.5 text-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search files"
                className="w-24 bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none sm:w-32"
              />
            </div>
            <div className="flex rounded-full border border-line bg-surface-2 p-0.5">
              <button type="button" onClick={() => setView("grid")} aria-label="Grid view" className={cn("grid h-7 w-7 place-items-center rounded-full", view === "grid" ? "bg-ink text-bg" : "text-muted")}>
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => setView("list")} aria-label="List view" className={cn("grid h-7 w-7 place-items-center rounded-full", view === "list" ? "bg-ink text-bg" : "text-muted")}>
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Files */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="py-12 text-center text-sm text-faint">No items match “{query}”.</p>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => openApp(app.id)}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-transparent p-3 text-center transition-colors hover:border-line hover:bg-surface-2/60"
                >
                  <AppIcon app={app} size="md" />
                  <span className="line-clamp-1 text-sm font-medium text-ink">{app.name}</span>
                  <span className="line-clamp-2 text-xs text-muted">{app.description}</span>
                </button>
              ))}
            </div>
          ) : (
            <ul className="space-y-1">
              {items.map((app) => (
                <li key={app.id}>
                  <button
                    type="button"
                    onClick={() => openApp(app.id)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-surface-2/60"
                  >
                    <AppIcon app={app} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">{app.name}</span>
                      <span className="block truncate text-xs text-muted">{app.description}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-faint" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppTwoPane>
  );
}
