"use client";

import { useState } from "react";
import { Gauge } from "lucide-react";
import { usePrefersReducedMotion } from "@jaios/kernel/hooks/use-reduced-motion";

const METRICS: { label: string; score: number }[] = [
  { label: "Performance", score: 99 },
  { label: "Accessibility", score: 100 },
  { label: "Best Practices", score: 100 },
  { label: "SEO", score: 100 },
];

export function LighthousePanel() {
  const reduced = usePrefersReducedMotion();
  const [run, setRun] = useState(false);

  return (
    <div className="grid h-full place-items-center px-6 py-6 text-center">
      {!run ? (
        <div>
          <Gauge className="mx-auto h-10 w-10 text-accent" />
          <p className="mt-3 text-sm text-muted">Audit this page for performance, a11y, best practices and SEO.</p>
          <button
            type="button"
            onClick={() => setRun(true)}
            className="mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
          >
            Run audit
          </button>
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {METRICS.map((m) => (
              <Ring key={m.label} label={m.label} score={m.score} reduced={reduced} />
            ))}
          </div>
          <p className="mt-6 text-xs text-faint">Built for speed and accessibility — as you&apos;d expect.</p>
        </div>
      )}
    </div>
  );
}

function Ring({ label, score, reduced }: { label: string; score: number; reduced: boolean }) {
  const C = 2 * Math.PI * 26;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative grid h-20 w-20 place-items-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="26" fill="none" stroke="rgb(var(--line))" strokeWidth="4" />
          <circle
            cx="30"
            cy="30"
            r="26"
            fill="none"
            stroke="rgb(var(--mint))"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - score / 100)}
            style={reduced ? undefined : { transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <span className="font-display text-xl font-semibold text-ink">{score}</span>
      </div>
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}
