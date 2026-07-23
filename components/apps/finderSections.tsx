"use client";

import { ArrowUpRight, Globe, Github, MapPin } from "lucide-react";
import { META_CASE_STUDY } from "@/data/meta-case-study";
import { portfolioProjects } from "@/data/project-portfolio";
import { projects } from "@/data/projects";
import { useOSStore } from "@/store/os-store";
import { experience } from "@/data/experience";
import { notes } from "@/data/notes";
import { ProjectPreview } from "@/components/cards/ProjectPreview";
import { ACCENT } from "@/lib/accent";
import { cn } from "@/lib/utils";

/** Shared streamlined wrapper so every Finder section reads the same way. */
function SectionDoc({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-full overflow-y-auto p-5 sm:p-7">
      <div className="mb-5">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Head({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-faint">{children}</h3>;
}

function Bullets({ items, dot = "bg-accent" }: { items: string[]; dot?: string }) {
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink/90">
          <span className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", dot)} aria-hidden />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

interface FinderProjectCardProps {
  category: string;
  title: string;
  overview: string;
  highlights: string[];
  challenges: string[];
  impact: string[];
  stack: string[];
  accent: keyof typeof ACCENT;
  preview: React.ComponentProps<typeof ProjectPreview>["kind"];
  githubUrl?: string;
  liveUrl?: string;
  onLiveDemo?: (url: string) => void;
  highlightsLabel?: string;
  challengesLabel?: string;
}

function FinderProjectCard({
  category,
  title,
  overview,
  highlights,
  challenges,
  impact,
  stack,
  accent,
  preview,
  githubUrl,
  liveUrl,
  onLiveDemo,
  highlightsLabel = "My role",
  challengesLabel = "Frontend challenges",
}: FinderProjectCardProps) {
  const a = ACCENT[accent];
  const hasLinks = Boolean(githubUrl || liveUrl);

  return (
    <article className="rounded-2xl border border-line bg-surface p-5 shadow-soft">
      <div className={cn("flex flex-col gap-3", hasLinks && "sm:flex-row sm:items-start sm:justify-between")}>
        <div className="min-w-0">
          <p className={cn("text-xs font-semibold uppercase tracking-[0.16em]", a.text)}>{category}</p>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-ink">{title}</h2>
        </div>

        {hasLinks && (
          <div className="flex shrink-0 flex-wrap gap-1.5">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:border-line-strong hover:bg-ink/[0.04]"
              >
                <Github className="h-3.5 w-3.5 text-muted" />
                GitHub
              </a>
            )}
            {liveUrl && onLiveDemo && (
              <button
                type="button"
                onClick={() => onLiveDemo(liveUrl)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-opacity hover:opacity-90",
                  a.chip,
                )}
              >
                <Globe className="h-3.5 w-3.5" />
                Live demo
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className={cn("flex items-center justify-center rounded-2xl p-4", a.softBg)}>
          <div className="w-full max-w-xs">
            <ProjectPreview kind={preview} />
          </div>
        </div>
        <div>
          <p className="text-sm leading-relaxed text-muted">{overview}</p>
          <div className="mt-4">
            <Head>{highlightsLabel}</Head>
            <Bullets items={highlights} dot={a.dot} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <Head>{challengesLabel}</Head>
          <Bullets items={challenges} dot={a.dot} />
        </div>
        <div>
          <Head>Impact</Head>
          <Bullets items={impact} dot="bg-mint" />
        </div>
      </div>

      <div className="mt-5">
        <Head>Stack</Head>
        <div className="flex flex-wrap gap-1.5">
          {stack.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function ProjectsSection() {
  const openUrlInBrowser = useOSStore((s) => s.openUrlInBrowser);

  return (
    <SectionDoc
      title="Projects"
      subtitle="Showcase work — open source repos and live demos you can explore."
    >
      <div className="space-y-5">
        {portfolioProjects.map((p) => (
          <FinderProjectCard
            key={p.id}
            category={p.category}
            title={p.title}
            overview={p.overview}
            highlights={p.highlights}
            highlightsLabel="What I built"
            challenges={p.challenges}
            challengesLabel="Challenges"
            impact={p.impact}
            stack={p.stack}
            accent={p.accent}
            preview={p.preview}
            githubUrl={p.githubUrl}
            liveUrl={p.liveUrl}
            onLiveDemo={openUrlInBrowser}
          />
        ))}
      </div>
    </SectionDoc>
  );
}

export function WorkSection() {
  return (
    <SectionDoc
      title="Selected Work"
      subtitle="Professional modules and product UIs — built for employers and clients."
    >
      <div className="space-y-5">
        {projects.map((p) => {
          const cs = p.caseStudy;
          return (
            <FinderProjectCard
              key={p.id}
              category={p.category}
              title={p.title}
              overview={cs.overview}
              highlights={cs.role}
              challenges={cs.challenges}
              impact={cs.improved}
              stack={p.stack}
              accent={p.accent}
              preview={p.preview}
            />
          );
        })}
      </div>
    </SectionDoc>
  );
}

export function BuildingJaiOSSection() {
  const { title, subtitle, github, githubLabel, sections } = META_CASE_STUDY;

  return (
    <SectionDoc title={title} subtitle={subtitle}>
      <a
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink shadow-soft transition-colors hover:border-line-strong"
      >
        View source on GitHub
        <ArrowUpRight className="h-3.5 w-3.5 text-muted" />
        <span className="text-faint">({githubLabel})</span>
      </a>

      <div className="space-y-8">
        {sections.map((section) => (
          <article key={section.id} className="rounded-2xl border border-line bg-surface p-5 shadow-soft">
            <h2 className="font-display text-lg font-semibold tracking-tight text-ink">{section.title}</h2>

            {section.paragraphs?.map((p, i) => (
              <p key={i} className="mt-3 text-sm leading-relaxed text-muted">
                {p}
              </p>
            ))}

            {section.diagram && (
              <pre
                className="mt-4 overflow-x-auto rounded-xl border border-line bg-ink/[0.03] p-4 font-mono text-[11px] leading-relaxed text-ink/80 sm:text-xs"
                aria-label="Architecture diagram"
              >
                {section.diagram}
              </pre>
            )}

            {section.bullets && (
              <div className="mt-4">
                <Bullets items={section.bullets} dot="bg-violet" />
              </div>
            )}
          </article>
        ))}
      </div>
    </SectionDoc>
  );
}

export function ExperienceSection() {
  return (
    <SectionDoc title="Experience" subtitle="Roles, and what I shipped in each.">
      <div className="space-y-5">
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

              <div className="mt-4">
                <Head>Contributions</Head>
                <Bullets items={role.contributions} dot={a.dot} />
              </div>

              <div className="mt-4">
                <Head>Technologies</Head>
                <div className="flex flex-wrap gap-1.5">
                  {role.tech.map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </SectionDoc>
  );
}

export function NotesSection() {
  return (
    <SectionDoc title="Notes" subtitle="How I think about frontend.">
      <div className="space-y-4">
        {notes.map((n) => (
          <article
            key={n.id}
            className="rounded-2xl border border-line bg-surface p-5 shadow-soft"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">{n.updated}</p>
            <h2 className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">{n.title}</h2>
            <div className="mt-3 space-y-3">
              {n.body.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-muted">{p}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </SectionDoc>
  );
}
