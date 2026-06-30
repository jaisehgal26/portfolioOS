"use client";

import { Download } from "lucide-react";
import { profile, links } from "@jaios/content/profile";
import { experience } from "@jaios/content/experience";
import { skillGroups } from "@jaios/content/skills";
import { useResumeDownload } from "../lib/use-resume-download";

export function ResumePage() {
  const download = useResumeDownload();
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{profile.name}</h1>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-accent">{profile.role}</p>
        </div>
        <button
          type="button"
          onClick={download}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
        >
          <Download className="h-4 w-4" /> Download résumé + cover letter
        </button>
      </div>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-faint">Summary</h2>
        <p className="mt-2 leading-relaxed text-muted">{profile.summary}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-faint">Experience</h2>
        <div className="mt-3 space-y-5">
          {experience.map((role) => (
            <div key={role.id}>
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                <h3 className="font-semibold text-ink">
                  {role.company} <span className="font-normal text-muted">— {role.role}</span>
                </h3>
                <span className="text-xs text-faint">{role.period}</span>
              </div>
              <ul className="mt-2 space-y-1.5">
                {role.contributions.map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-faint">Skills</h2>
        <dl className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {skillGroups.map((g) => (
            <div key={g.id} className="text-sm">
              <dt className="font-medium text-ink">{g.title}</dt>
              <dd className="text-muted">{g.skills.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-faint">Education</h2>
        <p className="mt-2 text-sm text-ink">{profile.education.school}</p>
        <p className="text-sm text-muted">{profile.education.degree}</p>
        <p className="text-xs text-faint">{profile.education.location} · {profile.education.period}</p>
      </section>

      <p className="mt-8 text-center text-xs uppercase tracking-[0.18em] text-faint">
        {profile.experience} · {profile.role} · {links.portfolioLabel}
      </p>
    </div>
  );
}
