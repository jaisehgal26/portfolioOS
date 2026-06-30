"use client";

import { Check, Download, MapPin, Sparkles } from "lucide-react";
import { AppScroll } from "@jaios/ui/AppShell";
import { Monogram } from "@jaios/ui/Monogram";
import { profile } from "@jaios/content/profile";
import { downloadResume } from "@jaios/kernel/lib/download";

export function AboutApp() {
  const stats = [
    { k: "Experience", v: profile.experience },
    { k: "Current", v: "Velotio Technologies" },
    { k: "Location", v: profile.location },
    { k: "Focus", v: "Real-time Agentic UIs" },
  ];

  return (
    <AppScroll>
      {/* Identity panel */}
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-line bg-surface-2/50 p-7 text-center sm:flex-row sm:text-left">
        <Monogram size="lg" className="rounded-3xl" />
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{profile.name}</h1>
          <p className="text-muted">{profile.role}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-muted sm:justify-start">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {profile.location}
            </span>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.k} className="rounded-2xl border border-line bg-surface p-3.5 shadow-soft">
            <dt className="text-xs font-medium uppercase tracking-wider text-faint">{s.k}</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">{s.v}</dd>
          </div>
        ))}
      </dl>

      {/* Intro */}
      <p className="mt-6 text-pretty leading-relaxed text-muted">{profile.aboutIntro}</p>

      {/* Highlights */}
      <h2 className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-faint">Highlights</h2>
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {profile.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2.5 text-sm text-ink">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/12 text-accent">
              <Check className="h-3 w-3" />
            </span>
            {h}
          </li>
        ))}
      </ul>

      {/* Core stack */}
      <h2 className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-faint">Core stack</h2>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {profile.coreStack.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>

      <figure className="mt-7 border-l-2 border-accent/40 pl-4">
        <blockquote className="text-pretty font-display text-base leading-relaxed text-muted">
          “An interface is a promise. Every skeleton, every optimistic update, every quiet retry is
          you telling the user I&apos;ve got this — and engineering is just keeping that promise at
          sixty frames a second.”
        </blockquote>
        <figcaption className="mt-2 text-[11px] text-faint">
          On building interfaces — {profile.name}
        </figcaption>
      </figure>

      <button
        type="button"
        onClick={downloadResume}
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
      >
        <Download className="h-4 w-4" />
        Download Resume
      </button>
    </AppScroll>
  );
}
