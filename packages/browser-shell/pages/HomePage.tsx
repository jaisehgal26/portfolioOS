"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { JaiLogo } from "@jaios/ui/JaiLogo";
import { useCurrentTime } from "@jaios/kernel/hooks/use-current-time";
import { useBrowserStore } from "@jaios/kernel/browser-store";
import { favicon } from "@jaios/kernel/lib/url";
import { profile } from "@jaios/content/profile";
import { projects } from "@jaios/content/projects";
import { links } from "@jaios/content/profile";
import { inputToUrl, isInternalUrl, resolveTitle } from "../lib/routes";

interface Dial {
  label: string;
  url: string;
}

const CORE: Dial[] = [
  { label: "About", url: "jai://about" },
  { label: "Projects", url: "jai://projects" },
  { label: "Experience", url: "jai://experience" },
  { label: "Skills", url: "jai://skills" },
  { label: "Résumé", url: "jai://resume" },
  { label: "Contact", url: "jai://contact" },
];

const EXTERNAL: Dial[] = [
  { label: "GitHub", url: links.github },
  { label: "LinkedIn", url: links.linkedin },
];

function greeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function HomePage() {
  const navigate = useBrowserStore((s) => s.navigate);
  const recents = useBrowserStore((s) => s.globalHistory);
  const now = useCurrentTime();
  const [q, setQ] = useState("");

  const dials: Dial[] = [
    ...CORE,
    ...projects.slice(0, 3).map((p) => ({ label: p.title, url: `jai://projects/${p.id}` })),
    ...EXTERNAL,
  ];

  const recent = recents.slice(0, 6);

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <div className="text-center" suppressHydrationWarning>
        <JaiLogo className="mx-auto h-12 w-12 text-ink" />
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
          {now ? greeting(now.getHours()) : "Welcome"}.
        </h1>
        <p className="mt-1 text-sm text-muted">{profile.name} — {profile.role}</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) navigate(inputToUrl(q));
        }}
        className="mx-auto mt-7 flex max-w-xl items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 shadow-soft"
      >
        <Search className="h-4 w-4 text-faint" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the portfolio, or type jai:// or a URL"
          aria-label="Search"
          className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
        />
      </form>

      <div className="mt-9 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {dials.map((d) => {
          const internal = isInternalUrl(d.url);
          return (
            <button
              key={d.url}
              type="button"
              onClick={() => navigate(d.url)}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-line bg-surface p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
              title={d.label}
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2">
                {internal ? (
                  <JaiLogo className="h-5 w-5 text-ink" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={favicon(d.url)} alt="" width={20} height={20} className="h-5 w-5 rounded" />
                )}
              </span>
              <span className="max-w-full truncate text-xs font-medium text-ink">{d.label}</span>
            </button>
          );
        })}
      </div>

      {recent.length > 0 && (
        <div className="mt-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">Recently visited</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {recent.map((h, i) => (
              <button
                key={`${h.url}-${i}`}
                type="button"
                onClick={() => navigate(h.url)}
                className="max-w-[220px] truncate rounded-full border border-line bg-surface-2 px-3 py-1 text-xs text-muted transition-colors hover:text-ink"
              >
                {resolveTitle(h.url)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
