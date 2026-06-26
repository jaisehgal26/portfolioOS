"use client";

import { Check, Download, MapPin, Sparkles } from "lucide-react";
import { AppScroll } from "@/components/ui/AppShell";
import { useOSStore } from "@/store/os-store";
import { profile, links } from "@/data/profile";

export function AboutApp() {
  const mode = useOSStore((s) => s.mode);

  const stats = [
    { k: "Experience", v: profile.experience },
    { k: "Current", v: "Velotio Technologies" },
    { k: "Location", v: profile.location },
    { k: "Focus", v: "Real-time & AI UI" },
  ];

  return (
    <AppScroll>
      {/* Identity panel */}
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-line bg-surface-2/50 p-7 text-center sm:flex-row sm:text-left">
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-accent to-amber font-display text-2xl font-semibold text-white shadow-card ring-2 ring-white/30">
          JS
        </span>
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{profile.name}</h1>
          <p className="text-muted">{profile.role}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-muted sm:justify-start">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {profile.location}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/12 px-2.5 py-0.5 text-xs font-medium text-mint">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" /> {profile.available}
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

      {mode === "engineer" && (
        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-violet/25 bg-violet/[0.06] p-4">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
          <p className="text-sm leading-relaxed text-ink">
            <span className="font-semibold">Engineer note · </span>
            I model real-time UI as ordered event streams folded into a keyed view model, with each
            node owning a small state machine (pending → streaming → done → error). It keeps the tree
            stable under heavy updates and makes reconnects and retries first-class.
          </p>
        </div>
      )}

      <a
        href={links.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
      >
        <Download className="h-4 w-4" />
        Download Resume
      </a>
    </AppScroll>
  );
}
