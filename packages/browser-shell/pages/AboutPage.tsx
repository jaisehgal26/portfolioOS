"use client";

import { Check } from "lucide-react";
import { profile } from "@jaios/content/profile";

export function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">About</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">{profile.name}</h1>
        <p className="mt-1 text-muted">
          {profile.role} · {profile.location} · {profile.experience}
        </p>
      </header>

      <p className="mt-6 text-pretty leading-relaxed text-muted">{profile.aboutIntro}</p>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-faint">Highlights</h2>
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
      </section>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-faint">Core stack</h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {profile.coreStack.map((t) => (
            <span key={t} className="rounded-full border border-line bg-surface-2 px-3 py-1 text-sm font-medium text-ink">
              {t}
            </span>
          ))}
        </div>
      </section>
    </article>
  );
}
