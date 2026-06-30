"use client";

import { ArrowLeft } from "lucide-react";
import { useBrowserStore } from "@jaios/kernel/browser-store";
import { ACCENT } from "@jaios/kernel/lib/accent";
import { projects } from "@jaios/content/projects";
import { cn } from "@jaios/ui/utils";
import { NotFoundPage } from "./NotFoundPage";

function List({ title, items, dot }: { title: string; items: string[]; dot: string }) {
  return (
    <section className="mt-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-faint">{title}</h2>
      <ul className="mt-2 space-y-1.5">
        {items.map((c, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink/90">
            <span className={cn("mt-2 h-1 w-1 shrink-0 rounded-full", dot)} aria-hidden />
            <span>{c}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ProjectPage({ id }: { id: string }) {
  const navigate = useBrowserStore((s) => s.navigate);
  const project = projects.find((p) => p.id === id);
  if (!project) return <NotFoundPage url={`jai://projects/${id}`} />;
  const a = ACCENT[project.accent];
  const cs = project.caseStudy;

  return (
    <article className="mx-auto max-w-3xl px-6 py-10">
      <button
        type="button"
        onClick={() => navigate("jai://projects")}
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> All projects
      </button>

      <header className="mt-4">
        <span className={cn("text-xs font-semibold uppercase tracking-[0.16em]", a.text)}>{project.category}</span>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">{project.title}</h1>
        <p className="mt-2 leading-relaxed text-muted">{cs.overview}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((t) => (
            <span key={t} className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-xs text-muted">
              {t}
            </span>
          ))}
        </div>
      </header>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-faint">Problem</h2>
        <p className="mt-2 leading-relaxed text-muted">{cs.problem}</p>
      </section>

      <List title="My role" items={cs.role} dot={a.dot} />
      <List title="Frontend challenges" items={cs.challenges} dot={a.dot} />
      <List title="Architecture" items={cs.architecture} dot={a.dot} />
      <List title="Key screens" items={cs.screens} dot={a.dot} />
      <List title="Impact" items={cs.improved} dot="bg-mint" />
      <List title="What I'd do next" items={cs.next} dot="bg-faint" />

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-faint">UI states designed</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {cs.uiStates.map((u) => (
            <span key={u} className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", a.chip)}>
              {u}
            </span>
          ))}
        </div>
      </section>
    </article>
  );
}
