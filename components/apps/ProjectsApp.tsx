"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppTwoPane } from "@/components/ui/AppShell";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { ProjectPreview } from "@/components/cards/ProjectPreview";
import { projects } from "@/data/projects";
import { useOSStore } from "@/store/os-store";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { ACCENT } from "@/lib/accent";
import { cn } from "@/lib/utils";

const TABS: TabItem[] = [
  { id: "overview", label: "Overview" },
  { id: "screens", label: "Screens" },
  { id: "challenges", label: "Challenges" },
  { id: "tech", label: "Tech" },
  { id: "impact", label: "Impact" },
  { id: "next", label: "Improvements" },
];

export function ProjectsApp() {
  const mode = useOSStore((s) => s.mode);
  const reduced = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState(projects[0].id);
  const [tab, setTab] = useState("overview");

  const project = projects.find((p) => p.id === activeId) ?? projects[0];
  const accent = ACCENT[project.accent];
  const cs = project.caseStudy;

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
                onClick={() => {
                  setActiveId(p.id);
                  setTab("overview");
                }}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-left transition-colors md:whitespace-normal",
                  isActive ? "bg-ink/[0.06]" : "hover:bg-ink/[0.04]",
                )}
              >
                <span className={cn("h-2 w-2 shrink-0 rounded-full", a.dot)} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ink">{p.title}</span>
                  <span className="hidden truncate text-xs text-muted md:block">{p.category}</span>
                </span>
              </button>
            );
          })}
        </div>
      }
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-line px-5 py-4 sm:px-6">
          <p className={cn("text-xs font-semibold uppercase tracking-[0.16em]", accent.text)}>
            {project.category}
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">
            {project.title}
          </h2>
          <div className="mt-3">
            <Tabs tabs={TABS} active={tab} onChange={setTab} layoutId={`proj-${project.id}`} ariaLabel="Project sections" />
          </div>
        </div>

        {/* Panel */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${project.id}-${tab}`}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {tab === "overview" && (
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className={cn("flex items-center justify-center rounded-2xl p-5", accent.softBg)}>
                      <div className="w-full max-w-xs">
                        <ProjectPreview kind={project.preview} />
                      </div>
                    </div>
                    <div>
                      <p className="leading-relaxed text-muted">{cs.overview}</p>
                      <p className="mt-3 text-sm text-ink">
                        <span className="font-semibold">My role · </span>
                        {project.contribution}
                      </p>
                    </div>
                  </div>
                  <Block title="The problem">
                    <p className="leading-relaxed text-muted">{cs.problem}</p>
                  </Block>
                </div>
              )}

              {tab === "screens" && (
                <div className="space-y-5">
                  <div className={cn("flex items-center justify-center rounded-2xl p-6", accent.softBg)}>
                    <div className="w-full max-w-sm">
                      <ProjectPreview kind={project.preview} />
                    </div>
                  </div>
                  <Block title="UI states handled">
                    <div className="flex flex-wrap gap-2">
                      {cs.uiStates.map((s) => (
                        <span key={s} className={cn("rounded-full border px-3 py-1 text-sm font-medium", accent.chip)}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </Block>
                  <Block title="Key screens & components">
                    <List items={cs.screens} dot={accent.dot} />
                  </Block>
                </div>
              )}

              {tab === "challenges" && (
                <Block title="Frontend challenges">
                  <List items={cs.challenges} dot={accent.dot} />
                </Block>
              )}

              {tab === "tech" && (
                <div className="space-y-5">
                  <Block title="Stack">
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </Block>
                  {mode === "engineer" && (
                    <Block title="Architecture & approach">
                      <List items={cs.architecture} dot={accent.dot} />
                    </Block>
                  )}
                </div>
              )}

              {tab === "impact" && (
                <Block title="Impact">
                  <List items={cs.improved} dot="bg-mint" />
                </Block>
              )}

              {tab === "next" && (
                <Block title="What I'd improve next">
                  <List items={cs.next} dot={accent.dot} arrow />
                </Block>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AppTwoPane>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-faint">{title}</h3>
      {children}
    </div>
  );
}

function List({ items, dot, arrow }: { items: string[]; dot: string; arrow?: boolean }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 leading-relaxed text-ink/90">
          {arrow ? (
            <span className="mt-1 text-faint" aria-hidden>→</span>
          ) : (
            <span className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", dot)} aria-hidden />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
