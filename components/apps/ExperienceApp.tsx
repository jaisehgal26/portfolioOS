"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, MapPin } from "lucide-react";
import { AppTwoPane } from "@/components/ui/AppShell";
import { experience } from "@/data/experience";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { ACCENT } from "@/lib/accent";
import { cn } from "@/lib/utils";

const VERSION: Record<string, string> = { velotio: "v4.5", gigmo: "v3.0", wipro: "v1.0" };

export function ExperienceApp() {
  const reduced = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState(experience[0].id);
  const role = experience.find((e) => e.id === activeId) ?? experience[0];
  const accent = ACCENT[role.accent];

  return (
    <AppTwoPane
      sidebar={
        <div className="flex gap-1 p-2 md:flex-col">
          {experience.map((e) => {
            const a = ACCENT[e.accent];
            const isActive = e.id === activeId;
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => setActiveId(e.id)}
                className={cn(
                  "flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-left transition-colors md:whitespace-normal",
                  isActive ? "bg-ink/[0.06]" : "hover:bg-ink/[0.04]",
                )}
              >
                <span className={cn("rounded-md px-1.5 py-0.5 font-mono text-[11px] font-semibold text-white", a.dot)}>
                  {VERSION[e.id] ?? ""}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ink">{e.company}</span>
                  <span className="hidden truncate text-xs text-muted md:block">{e.role}</span>
                </span>
                {e.current && <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-mint md:block" />}
              </button>
            );
          })}
        </div>
      }
    >
      <div className="h-full overflow-y-auto p-5 sm:p-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={role.id}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2">
              <span className={cn("rounded-md px-2 py-0.5 font-mono text-xs font-semibold text-white", accent.dot)}>
                {VERSION[role.id]}
              </span>
              {role.current && (
                <span className="inline-flex items-center gap-1 rounded-full bg-mint/12 px-2 py-0.5 text-[11px] font-semibold text-mint">
                  <span className="h-1.5 w-1.5 rounded-full bg-mint" /> Current
                </span>
              )}
            </div>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">{role.company}</h1>
            <p className={cn("text-sm font-medium", accent.text)}>{role.role}</p>
            <p className="mt-1 flex items-center gap-3 text-sm text-muted">
              <span>{role.period}</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {role.location}
              </span>
            </p>

            <p className="mt-4 leading-relaxed text-muted">{role.summary}</p>

            <h2 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-faint">Contributions</h2>
            <ul className="mt-3 space-y-2.5">
              {role.contributions.map((c, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink/90">
                  <span className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", accent.dot)} aria-hidden />
                  {c}
                </li>
              ))}
            </ul>

            <h2 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-faint">Technologies</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {role.tech.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>

            <div className={cn("mt-6 flex gap-3 rounded-2xl border p-4", accent.border, accent.softBg)}>
              <Lightbulb className={cn("mt-0.5 h-4 w-4 shrink-0", accent.text)} aria-hidden />
              <p className="text-sm text-ink">
                <span className="font-semibold">Frontend lesson · </span>
                {role.lesson}
              </p>
            </div>

            <p className="mt-4 rounded-2xl border border-line bg-surface-2/50 p-4 text-sm leading-relaxed text-muted">
              <span className="font-semibold text-ink">Interview talking point · </span>
              How I structured this UI for {role.tech.slice(0, 3).join(", ")} — component boundaries,
              shared state, and the loading / error / retry states behind the happy path.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </AppTwoPane>
  );
}
