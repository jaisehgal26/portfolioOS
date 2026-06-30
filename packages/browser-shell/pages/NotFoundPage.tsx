"use client";

import { Ghost } from "lucide-react";
import { useBrowserStore, HOME_URL } from "@jaios/kernel/browser-store";

export function NotFoundPage({ url }: { url: string }) {
  const navigate = useBrowserStore((s) => s.navigate);
  return (
    <div className="grid h-full place-items-center px-6 py-16 text-center">
      <div>
        <Ghost className="mx-auto h-12 w-12 text-faint" />
        <p className="mt-4 font-mono text-sm text-faint">ERR_PAGE_NOT_FOUND</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">This page doesn&apos;t exist</h1>
        <p className="mt-1 break-all text-sm text-muted">{url}</p>
        <p className="mt-3 text-xs text-faint">Tip: open DevTools and try <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono">help()</code></p>
        <button
          type="button"
          onClick={() => navigate(HOME_URL)}
          className="mt-6 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
        >
          Back to start
        </button>
      </div>
    </div>
  );
}
