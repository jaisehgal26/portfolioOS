"use client";

import { Clock, Trash2 } from "lucide-react";
import { useBrowserStore } from "@jaios/kernel/browser-store";
import { isInternalUrl, resolveTitle } from "../lib/routes";
import { hostOf } from "@jaios/kernel/lib/url";

function dayLabel(at: number): string {
  const d = new Date(at);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const yest = new Date(today);
  yest.setDate(today.getDate() - 1);
  const isYest = d.toDateString() === yest.toDateString();
  if (isToday) return "Today";
  if (isYest) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
}

export function HistoryPage() {
  const history = useBrowserStore((s) => s.globalHistory);
  const navigate = useBrowserStore((s) => s.navigate);
  const clearHistory = useBrowserStore((s) => s.clearHistory);

  // Group consecutive entries by day label.
  const groups: { label: string; items: typeof history }[] = [];
  for (const entry of history) {
    const label = dayLabel(entry.at);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(entry);
    else groups.push({ label, items: [entry] });
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">History</h1>
        {history.length > 0 && (
          <button
            type="button"
            onClick={clearHistory}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear history
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="mt-8 text-center text-sm text-faint">No history yet.</p>
      ) : (
        <div className="mt-6 space-y-6">
          {groups.map((g, gi) => (
            <section key={`${g.label}-${gi}`}>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">{g.label}</h2>
              <ul className="mt-2 divide-y divide-line rounded-2xl border border-line bg-surface">
                {g.items.map((h, i) => (
                  <li key={`${h.url}-${i}`}>
                    <button
                      type="button"
                      onClick={() => navigate(h.url)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-ink/[0.04]"
                    >
                      <Clock className="h-3.5 w-3.5 shrink-0 text-faint" />
                      <span className="min-w-0 flex-1 truncate text-sm text-ink">{resolveTitle(h.url)}</span>
                      <span className="shrink-0 text-xs text-faint">
                        {isInternalUrl(h.url) ? h.url : hostOf(h.url)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
