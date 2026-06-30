"use client";

import { ACCENT } from "@jaios/kernel/lib/accent";
import { skillGroups } from "@jaios/content/skills";
import { cn } from "@jaios/ui/utils";

export function SkillsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Skills</h1>
      <p className="mt-1 text-sm text-muted">Tools grouped by how I actually use them.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g) => {
          const a = ACCENT[g.accent];
          return (
            <div key={g.id} className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-soft">
              <h2 className="font-display text-lg font-semibold tracking-tight text-ink">{g.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{g.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {g.skills.map((s) => (
                  <span key={s} className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", a.chip)}>
                    {s}
                  </span>
                ))}
              </div>
              <p className="mt-4 border-t border-line pt-3 text-xs text-muted">
                <span className={cn("font-semibold", a.text)}>Used in · </span>
                {g.usedIn}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
