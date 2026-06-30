"use client";

import { MapPin } from "lucide-react";
import { projects } from "@jaios/content/projects";
import { experience } from "@jaios/content/experience";
import { notes } from "@jaios/content/notes";
import { ProjectPreview } from "@/components/cards/ProjectPreview";
import { ACCENT } from "@jaios/kernel/lib/accent";
import { cn } from "@jaios/ui/utils";

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

export function WorkSection() {
  return (
    <SectionDoc title="Selected Work" subtitle="Product UIs — the problem, the build, and the impact.">
      <div className="space-y-5">
        {projects.map((p) => {
          const a = ACCENT[p.accent];
          const cs = p.caseStudy;
          return (
            <article key={p.id} className="rounded-2xl border border-line bg-surface p-5 shadow-soft">
              <p className={cn("text-xs font-semibold uppercase tracking-[0.16em]", a.text)}>{p.category}</p>
              <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-ink">{p.title}</h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className={cn("flex items-center justify-center rounded-2xl p-4", a.softBg)}>
                  <div className="w-full max-w-xs">
                    <ProjectPreview kind={p.preview} />
                  </div>
                </div>
                <div>
                  <p className="text-sm leading-relaxed text-muted">{cs.overview}</p>
                  <div className="mt-4">
                    <Head>My role</Head>
                    <Bullets items={cs.role} dot={a.dot} />
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <Head>Frontend challenges</Head>
                  <Bullets items={cs.challenges} dot={a.dot} />
                </div>
                <div>
                  <Head>Impact</Head>
                  <Bullets items={cs.improved} dot="bg-mint" />
                </div>
              </div>

              <div className="mt-5">
                <Head>Stack</Head>
                <div className="flex flex-wrap gap-1.5">
                  {p.stack.map((t) => (
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
