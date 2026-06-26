"use client";

import { useState } from "react";
import { Download, Mail, Phone, Printer } from "lucide-react";
import { AppTwoPane } from "@/components/ui/AppShell";
import { CopyButton } from "@/components/ui/CopyButton";
import { profile, links } from "@/data/profile";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { cn } from "@/lib/utils";

const SECTIONS = ["Summary", "Skills", "Experience", "Projects", "Education", "Contact"] as const;
type SectionId = (typeof SECTIONS)[number];

export function ResumeApp() {
  const [section, setSection] = useState<SectionId>("Summary");

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2.5 sm:px-5">
        <div className="ml-auto flex items-center gap-2">
          <a
            href={links.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-bg transition-transform hover:-translate-y-0.5"
          >
            <Download className="h-3.5 w-3.5" /> Download PDF
          </a>
          <a
            href={links.resume}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Print resume"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-ink"
          >
            <Printer className="h-4 w-4" />
          </a>
          <CopyButton value={links.email} label="Copy email" toast="Email copied" />
        </div>
      </div>

      <AppTwoPane
        sidebar={
          <div className="flex gap-1 p-2 md:flex-col">
            {SECTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSection(s)}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors",
                  section === s ? "bg-ink/[0.06] text-ink" : "text-muted hover:bg-ink/[0.04] hover:text-ink",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        }
      >
        <div className="h-full overflow-y-auto p-5 sm:p-7">
          {section === "Summary" && (
            <Section title="Summary">
              <p className="leading-relaxed text-muted">{profile.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {profile.coreStack.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
            </Section>
          )}

          {section === "Skills" && (
            <Section title="Skills">
              <dl className="grid gap-4 sm:grid-cols-2">
                {skillGroups.map((g) => (
                  <div key={g.id}>
                    <dt className="text-sm font-semibold text-ink">{g.title}</dt>
                    <dd className="mt-1 text-sm text-muted">{g.skills.join(" · ")}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}

          {section === "Experience" && (
            <Section title="Experience">
              <div className="space-y-6">
                {experience.map((role) => (
                  <div key={role.id}>
                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                      <h3 className="font-semibold text-ink">
                        {role.company} <span className="font-normal text-muted">— {role.role}</span>
                      </h3>
                      <span className="text-xs text-faint">{role.period}</span>
                    </div>
                    <p className="text-xs uppercase tracking-wider text-faint">{role.location}</p>
                    <ul className="mt-2 space-y-1.5">
                      {role.contributions.map((c, i) => (
                        <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {section === "Projects" && (
            <Section title="Projects">
              <div className="space-y-4">
                {projects.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-line bg-surface p-4 shadow-soft">
                    <h3 className="font-semibold text-ink">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted">{p.caseStudy.overview}</p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {p.stack.map((t) => (
                        <span key={t} className="chip">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {section === "Education" && (
            <Section title="Education">
              <div className="rounded-2xl border border-line bg-surface p-4 shadow-soft">
                <h3 className="font-semibold text-ink">{profile.education.school}</h3>
                <p className="text-sm text-muted">{profile.education.degree}</p>
                <p className="mt-1 text-xs text-faint">
                  {profile.education.location} · {profile.education.period}
                </p>
              </div>
            </Section>
          )}

          {section === "Contact" && (
            <Section title="Contact">
              <ul className="space-y-3">
                <ContactRow icon={<Mail className="h-4 w-4" />} value={links.email} copy={{ value: links.email, label: "Copy email" }} href={`mailto:${links.email}`} />
                <ContactRow icon={<Phone className="h-4 w-4" />} value={links.phone} copy={{ value: links.phone, label: "Copy phone" }} href={links.phoneHref} />
                <ContactRow value={links.linkedinLabel} href={links.linkedin} external />
                <ContactRow value={links.portfolioLabel} href={links.portfolio} external />
              </ul>
            </Section>
          )}
        </div>
      </AppTwoPane>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-display text-xl font-semibold tracking-tight text-ink">{title}</h2>
      {children}
    </div>
  );
}

function ContactRow({
  icon,
  value,
  href,
  external,
  copy,
}: {
  icon?: React.ReactNode;
  value: string;
  href: string;
  external?: boolean;
  copy?: { value: string; label: string };
}) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-soft">
      <span className="text-muted">{icon}</span>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="min-w-0 flex-1 truncate text-sm text-ink hover:underline"
      >
        {value}
      </a>
      {copy && <CopyButton value={copy.value} label={copy.label} toast={`${copy.label.replace("Copy ", "")} copied`} />}
    </li>
  );
}
