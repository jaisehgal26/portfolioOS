"use client";

import { Check, Monitor, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useOSStore } from "@jaios/kernel/store";
import { ACCENTS } from "@jaios/kernel/data/system";
import { cn } from "@jaios/ui/utils";

export function SettingsPage() {
  const theme = useOSStore((s) => s.theme);
  const setTheme = useOSStore((s) => s.setTheme);
  const accent = useOSStore((s) => s.accent);
  const setAccent = useOSStore((s) => s.setAccent);
  const soundEnabled = useOSStore((s) => s.soundEnabled);
  const setSoundEnabled = useOSStore((s) => s.setSoundEnabled);
  const setShellMode = useOSStore((s) => s.setShellMode);

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Settings</h1>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-faint">Theme</h2>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={cn(
                "flex items-center gap-2 rounded-xl border-2 p-3 text-sm font-medium capitalize transition-colors",
                theme === t ? "border-accent bg-accent/[0.06] text-ink" : "border-line text-muted hover:border-line-strong",
              )}
            >
              {t === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} {t}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-faint">Accent</h2>
        <div className="mt-2 flex flex-wrap gap-3">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAccent(a.id)}
              aria-label={a.label}
              aria-pressed={accent === a.id}
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-surface transition-transform hover:scale-105",
                accent === a.id ? "ring-ink/40" : "ring-transparent",
              )}
              style={{ background: `rgb(${theme === "dark" ? a.dark : a.light})` }}
            >
              {accent === a.id && <Check className="h-4 w-4 text-white" />}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-faint">Sound</h2>
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="mt-2 inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          {soundEnabled ? "Sound on" : "Sound off"}
        </button>
      </section>

      <section className="mt-8 border-t border-line pt-6">
        <button
          type="button"
          onClick={() => setShellMode("os")}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
        >
          <Monitor className="h-4 w-4" /> Switch to the macOS experience
        </button>
      </section>
    </div>
  );
}
