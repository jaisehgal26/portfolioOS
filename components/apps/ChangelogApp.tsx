"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { AppScroll } from "@/components/ui/AppShell";
import { useOSStore } from "@/store/os-store";
import { getApp } from "@/data/apps";
import {
  CHANGELOG_FILTERS,
  getChangelogByFilter,
  type ChangelogEntry,
  type ChangelogFilter,
  type ChangelogTag,
} from "@/data/changelog";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const TAG_STYLES: Record<ChangelogTag, string> = {
  feature: "bg-accent/12 text-accent border-accent/25",
  fix: "bg-mint/12 text-mint border-mint/25",
  pwa: "bg-blue/12 text-blue border-blue/25",
  "easter-egg": "bg-violet/12 text-violet border-violet/25",
  polish: "bg-amber/12 text-amber border-amber/25",
  system: "bg-ink/8 text-muted border-line",
};

function formatDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function EntryCard({ entry, defaultOpen }: { entry: ChangelogEntry; defaultOpen: boolean }) {
  const openApp = useOSStore((s) => s.openApp);
  const [open, setOpen] = useState(defaultOpen);
  const reduced = usePrefersReducedMotion();
  const related = entry.relatedApp ? getApp(entry.relatedApp) : null;

  return (
    <article className="relative pl-8">
      <span
        className="absolute left-3 top-5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent bg-surface ring-4 ring-bg"
        aria-hidden
      />

      <div className="rounded-2xl border border-line bg-surface p-4 shadow-soft sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted">{formatDate(entry.date)}</p>
            <h2 className="mt-0.5 font-display text-lg font-semibold tracking-tight text-ink">{entry.title}</h2>
          </div>
          <span className="shrink-0 rounded-full border border-line bg-surface-2 px-2.5 py-0.5 font-mono text-[11px] text-muted">
            v{entry.version}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", TAG_STYLES[tag])}
            >
              {tag.replace("-", " ")}
            </span>
          ))}
        </div>

        <p className="mt-3 text-sm text-muted">{entry.summary}</p>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
        >
          {open ? "Show less" : "Show details"}
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
        </button>

        <div
          className={cn(
            "grid transition-all",
            open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            reduced && !open && "hidden",
          )}
        >
          <div className="overflow-hidden">
            <ul className="space-y-2 border-t border-line pt-3">
              {entry.body.map((line, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink/90">
                  <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            {entry.why && (
              <p className="mt-3 rounded-xl border border-line bg-surface-2/60 px-3 py-2.5 text-sm italic text-muted">
                {entry.why}
              </p>
            )}
            {related && (
              <button
                type="button"
                onClick={() => openApp(entry.relatedApp!)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-line-strong"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Open {related.name}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ChangelogApp() {
  const [filter, setFilter] = useState<ChangelogFilter>("all");
  const entries = useMemo(() => getChangelogByFilter(filter), [filter]);

  return (
    <AppScroll>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Changelog</h1>
        <p className="mt-1 text-sm text-muted">What shipped in JaiOS and when.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {CHANGELOG_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filter === f.id
                ? "border-ink bg-ink text-bg"
                : "border-line bg-surface text-muted hover:border-line-strong hover:text-ink",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <p className="py-10 text-center text-sm text-faint">No entries for this filter.</p>
      ) : (
        <div className="relative space-y-6 pb-2">
          <div
            className="pointer-events-none absolute bottom-2 left-3 top-2 w-px bg-line/80"
            aria-hidden
          />
          {entries.map((entry, i) => (
            <EntryCard key={entry.id} entry={entry} defaultOpen={i === 0} />
          ))}
        </div>
      )}
    </AppScroll>
  );
}
