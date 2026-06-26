import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Globe, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { profile, links, site } from "@/data/profile";
import { experience } from "@/data/experience";
import { skillGroups } from "@/data/skills";
import { PrintButton } from "./print-button";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume — ${profile.name}, ${profile.role}. ${site.description}`,
};

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-28 sm:px-8">
      <div className="no-print mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to portfolio
        </Link>
        <PrintButton />
      </div>

      <article className="resume-doc rounded-4xl border border-line bg-surface p-7 shadow-soft sm:p-10">
        {/* Header */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
              {profile.name}
            </h1>
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              {profile.role}
            </p>
          </div>
          <ul className="space-y-1.5 break-all text-sm text-muted sm:text-right [&_svg]:shrink-0">
            <li>
              <a className="inline-flex items-center gap-2 hover:text-ink" href={`mailto:${links.email}`}>
                <Mail className="h-3.5 w-3.5" /> {links.email}
              </a>
            </li>
            <li>
              <a className="inline-flex items-center gap-2 hover:text-ink" href={links.phoneHref}>
                <Phone className="h-3.5 w-3.5" /> {links.phone}
              </a>
            </li>
            <li>
              <a
                className="inline-flex items-center gap-2 hover:text-ink"
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-3.5 w-3.5" /> {links.linkedinLabel}
              </a>
            </li>
            <li>
              <a
                className="inline-flex items-center gap-2 hover:text-ink"
                href={links.portfolio}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="h-3.5 w-3.5" /> {links.portfolioLabel}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> {profile.location}
            </li>
          </ul>
        </header>

        <div className="my-6 h-px w-full bg-line" />

        {/* Summary */}
        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-faint">Summary</h2>
          <p className="leading-relaxed text-muted">{profile.supporting}</p>
        </section>

        {/* Experience */}
        <section className="mt-7">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-faint">Experience</h2>
          <div className="space-y-6">
            {experience.map((role) => (
              <div key={role.id} className="break-inside-avoid">
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
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mt-7">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-faint">Skills</h2>
          <dl className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {skillGroups.map((group) => (
              <div key={group.id} className="text-sm">
                <dt className="font-medium text-ink">{group.title}</dt>
                <dd className="text-muted">{group.skills.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="my-6 h-px w-full bg-line" />
        <p className="text-center text-xs uppercase tracking-[0.18em] text-faint">
          {profile.experience} · {profile.role} · {site.url.replace(/^https?:\/\//, "")}
        </p>
      </article>
    </div>
  );
}
