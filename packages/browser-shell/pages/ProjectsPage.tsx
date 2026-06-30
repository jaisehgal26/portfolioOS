"use client";

import { ArrowUpRight } from "lucide-react";
import { useBrowserStore } from "@jaios/kernel/browser-store";
import { ACCENT } from "@jaios/kernel/lib/accent";
import { projects } from "@jaios/content/projects";
import { cn } from "@jaios/ui/utils";

export function ProjectsPage() {
  const navigate = useBrowserStore((s) => s.navigate);
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Selected Work</h1>
      <p className="mt-1 text-sm text-muted">Product UIs — the problem, the build, and the impact.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {projects.map((p) => {
          const a = ACCENT[p.accent];
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => navigate(`jai://projects/${p.id}`)}
              className="group rounded-2xl border border-line bg-surface p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <span className={cn("text-xs font-semibold uppercase tracking-[0.16em]", a.text)}>{p.category}</span>
                <ArrowUpRight className="h-4 w-4 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <h2 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink">{p.title}</h2>
              <p className="mt-1.5 line-clamp-3 text-sm text-muted">{p.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.stack.slice(0, 5).map((t) => (
                  <span key={t} className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-xs text-muted">
                    {t}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
