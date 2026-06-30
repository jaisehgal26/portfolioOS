"use client";

import { useState } from "react";
import { Download, FlaskConical, Gamepad2, RefreshCw, Sparkles } from "lucide-react";
import { AppScroll } from "@/components/ui/AppShell";
import { useOSStore } from "@jaios/kernel/store";
import { downloadResume } from "@jaios/kernel/lib/download";

const FACTS = [
  "This whole portfolio is a tiny operating system — windows, dock, terminal and all — built in React, TypeScript and Tailwind.",
  "The clock in the menu bar is a real mechanical watch with a sweeping second hand, drawn in SVG.",
  "Try the Terminal. There's a command in there that will (playfully) destroy everything.",
  "Every app icon is a single cohesive line-glyph set — no stock icon packs were harmed.",
  "I care most about the states around the happy path: loading, empty, error, retry, offline.",
];

export function SecretApp() {
  const openApp = useOSStore((s) => s.openApp);
  const [i, setI] = useState(0);

  return (
    <AppScroll>
      <div className="mx-auto max-w-md text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet/12 text-violet">
          <Sparkles className="h-6 w-6" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
          You found the secret folder
        </h1>
        <p className="mt-1.5 text-sm text-muted">Nicely done — curiosity is a frontend superpower.</p>

        <div className="mt-6 rounded-2xl border border-line bg-surface-2/60 p-5 text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">Fun fact</p>
          <p className="mt-2 text-sm leading-relaxed text-ink">{FACTS[i]}</p>
          <button
            type="button"
            onClick={() => setI((n) => (n + 1) % FACTS.length)}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Another
          </button>
        </div>

        <div className="mt-6 grid gap-2.5">
          <button
            type="button"
            onClick={downloadResume}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" /> Download résumé
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => openApp("experiments")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-line-strong"
            >
              <FlaskConical className="h-4 w-4 text-violet" /> Hidden prototype
            </button>
            <button
              type="button"
              onClick={() => openApp("snake")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-line-strong"
            >
              <Gamepad2 className="h-4 w-4 text-mint" /> Play Snake
            </button>
          </div>
        </div>
      </div>
    </AppScroll>
  );
}
