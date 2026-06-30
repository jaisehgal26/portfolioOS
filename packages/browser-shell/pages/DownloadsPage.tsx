"use client";

import { Check, Download, Loader2 } from "lucide-react";
import { useBrowserStore } from "@jaios/kernel/browser-store";
import { useResumeDownload } from "../lib/use-resume-download";

export function DownloadsPage() {
  const downloads = useBrowserStore((s) => s.downloads);
  const download = useResumeDownload();

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Downloads</h1>
        <button
          type="button"
          onClick={download}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
        >
          <Download className="h-4 w-4" /> Download résumé
        </button>
      </div>

      {downloads.length === 0 ? (
        <p className="mt-8 text-center text-sm text-faint">No downloads yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
          {downloads.map((d) => (
            <li key={d.id} className="flex items-center gap-3 px-4 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-muted">
                <Download className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink">{d.name}</span>
                <span className="text-xs text-faint">{new Date(d.at).toLocaleString()}</span>
              </span>
              {d.status === "in-progress" ? (
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-mint">
                  <Check className="h-3.5 w-3.5" /> Completed
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
