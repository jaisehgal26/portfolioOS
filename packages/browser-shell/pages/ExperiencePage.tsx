"use client";

import { MapPin } from "lucide-react";
import { ACCENT } from "@jaios/kernel/lib/accent";
import { experience } from "@jaios/content/experience";
import { cn } from "@jaios/ui/utils";

export function ExperiencePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Experience</h1>
      <p className="mt-1 text-sm text-muted">Roles, and what I shipped in each.</p>

      <div className="mt-6 space-y-5">
        {experience.map((role) => {
          const a = ACCENT[role.accent];
          return (
            <article key={role.id} className="rounded-2xl border border-line bg-surface p-5 shadow-soft">
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                <h2 className="font-display text-xl font-semibold tracking-tight text-ink">{role.company}</h2>
                {role.current && (
                  <span className="inline-flex w-fit items-center gap-1 rounded-full bg-mint/12 px-2 py-0.5 text-[11px] font-semibold text-mint">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint" /> Current
                  </span>
                )}
              </div>
              <p className={cn("text-sm font-medium", a.text)}>{role.role}</p>
              <p className="mt-1 flex items-center gap-3 text-sm text-muted">
                <span>{role.period}</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {role.location}
                </span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{role.summary}</p>
              <ul className="mt-3 space-y-1.5">
                {role.contributions.map((c, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink/90">
                    <span className={cn("mt-2 h-1 w-1 shrink-0 rounded-full", a.dot)} aria-hidden />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {role.tech.map((t) => (
                  <span key={t} className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-xs text-muted">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
