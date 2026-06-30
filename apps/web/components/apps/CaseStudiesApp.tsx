"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppTwoPane } from "@jaios/ui/AppShell";
import { ProjectPreview } from "@/components/cards/ProjectPreview";
import { projects } from "@jaios/content/projects";
import { usePrefersReducedMotion } from "@jaios/kernel/hooks/use-reduced-motion";
import { ACCENT } from "@jaios/kernel/lib/accent";
import { cn } from "@jaios/ui/utils";

export function CaseStudiesApp() {
  const reduced = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState(projects[0].id);
  const project = projects.find((p) => p.id === activeId) ?? projects[0];
  const accent = ACCENT[project.accent];
  const cs = project.caseStudy;

  const sections: { n: string; title: string; items?: string[]; text?: string }[] = [
    { n: "01", title: "Problem", text: cs.problem },
    { n: "02", title: "Context", text: project.summary },
    { n: "03", title: "My role", items: cs.role },
    { n: "04", title: "Frontend architecture", items: cs.architecture },
    { n: "05", title: "Frontend challenges", items: cs.challenges },
    { n: "06", title: "Key screens & components", items: cs.screens },
    { n: "07", title: "Outcome", items: cs.improved },
    { n: "08", title: "What I'd improve next", items: cs.next },
  ];

  return (
    <AppTwoPane
      sidebar={
        <div className="flex gap-1 p-2 md:flex-col">
          {projects.map((p) => {
            const a = ACCENT[p.accent];
            const isActive = p.id === activeId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveId(p.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-left transition-colors md:whitespace-normal",
                  isActive ? "bg-ink/[0.06]" : "hover:bg-ink/[0.04]",
                )}
              >
                <span className={cn("h-2 w-2 shrink-0 rounded-full", a.dot)} />
                <span className="min-w-0 truncate text-sm font-medium text-ink">{p.title}</span>
              </button>
            );
          })}
        </div>
      }
    >
      <div className="h-full overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Hero */}
            <div className={cn("flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8", accent.softBg)}>
              <div className="w-full max-w-[14rem] shrink-0">
                <ProjectPreview kind={project.preview} />
              </div>
              <div>
                <p className={cn("text-xs font-semibold uppercase tracking-[0.16em]", accent.text)}>
                  {project.category}
                </p>
                <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">
                  {project.title}
                </h1>
                <p className="mt-2 leading-relaxed text-muted">{cs.overview}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.stack.map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-7 p-6 sm:p-8">
              {sections.map((s) => (
                <section key={s.n}>
                  <div className="flex items-center gap-3">
                    <span className={cn("font-mono text-xs font-semibold", accent.text)}>{s.n}</span>
                    <h2 className="font-display text-lg font-semibold tracking-tight text-ink">{s.title}</h2>
                    <span className="h-px flex-1 bg-line" />
                  </div>
                  {s.text && <p className="mt-3 leading-relaxed text-muted">{s.text}</p>}
                  {s.items && (
                    <ul className="mt-3 space-y-2.5">
                      {s.items.map((item, i) => (
                        <li key={i} className="flex gap-3 leading-relaxed text-ink/90">
                          <span className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", accent.dot)} aria-hidden />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {/* UI states */}
              <section>
                <div className="flex items-center gap-3">
                  <span className={cn("font-mono text-xs font-semibold", accent.text)}>09</span>
                  <h2 className="font-display text-lg font-semibold tracking-tight text-ink">UI states handled</h2>
                  <span className="h-px flex-1 bg-line" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {cs.uiStates.map((u) => (
                    <span key={u} className={cn("rounded-full border px-3 py-1 text-sm font-medium", accent.chip)}>
                      {u}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </AppTwoPane>
  );
}
