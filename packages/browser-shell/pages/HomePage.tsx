"use client";

import { useBrowserStore } from "@jaios/kernel/browser-store";
import { profile } from "@jaios/content/profile";

const QUICK = ["about", "projects", "experience", "skills", "resume", "contact"];

/** Minimal New Tab page; enriched with speed-dial in a later phase. */
export function HomePage() {
  const navigate = useBrowserStore((s) => s.navigate);
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">{profile.name}</h1>
      <p className="mt-2 text-muted">{profile.role}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {QUICK.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => navigate(`jai://${p}`)}
            className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium capitalize text-ink shadow-soft transition-colors hover:bg-ink/5"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
