"use client";

import { ArrowUpRight } from "lucide-react";
import { useBrowserStore } from "@jaios/kernel/browser-store";
import { notes } from "@jaios/content/notes";

export function NotesPage() {
  const navigate = useBrowserStore((s) => s.navigate);
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Notes</h1>
      <p className="mt-1 text-sm text-muted">How I think about frontend.</p>
      <div className="mt-6 space-y-3">
        {notes.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => navigate(`jai://notes/${n.id}`)}
            className="group flex w-full items-start justify-between gap-3 rounded-2xl border border-line bg-surface p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
          >
            <span className="min-w-0">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">{n.updated}</span>
              <span className="mt-1 block font-display text-lg font-semibold tracking-tight text-ink">{n.title}</span>
              <span className="mt-1 block text-sm text-muted">{n.preview}</span>
            </span>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        ))}
      </div>
    </div>
  );
}
