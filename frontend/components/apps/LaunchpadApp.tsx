"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useOSStore } from "@/store/os-store";
import { APPS, type AppId } from "@/data/apps";
import { AppIcon } from "@/components/os/AppIcon";

/** Built-in apps surfaced in the launcher. */
const LAUNCHER_IDS: AppId[] = [
  "finder",
  "calculator",
  "todo",
  "notepad",
  "clock",
  "unit-converter",
  "snake",
  "piano",
  "terminal",
  "browser",
  "system-monitor",
  "changelog",
  "knowledge",
  "music",
  "guestbook",
  "settings",
];

const LAUNCHER_APPS = LAUNCHER_IDS.map((id) => APPS.find((a) => a.id === id))
  .filter((a): a is (typeof APPS)[number] => Boolean(a))
  .sort((a, b) => a.name.localeCompare(b.name));

export function LaunchpadApp() {
  const openApp = useOSStore((s) => s.openApp);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LAUNCHER_APPS;
    return LAUNCHER_APPS.filter((a) => `${a.name} ${a.description}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-center px-4 pt-4">
        <div className="flex w-full max-w-xs items-center gap-2 rounded-full border border-line bg-surface-2 px-3.5 py-2">
          <Search className="h-4 w-4 text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps"
            className="w-full bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {visible.length === 0 ? (
          <p className="py-10 text-center text-sm text-faint">No apps match “{query}”.</p>
        ) : (
          <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
            {visible.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => openApp(app.id)}
                className="group flex flex-col items-center gap-2 rounded-2xl p-2 transition-transform hover:-translate-y-0.5"
                title={app.description}
              >
                <AppIcon app={app} size="lg" className="transition-shadow group-hover:shadow-card" />
                <span className="max-w-full truncate text-xs font-medium text-ink">{app.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
