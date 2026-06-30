"use client";

import { useState } from "react";
import { Check, Clock, Moon, Sun, Zap, ZapOff } from "lucide-react";
import { AppTwoPane } from "@jaios/ui/AppShell";
import { useOSStore } from "@jaios/kernel/store";
import { WALLPAPERS, ACCENTS } from "@jaios/kernel/data/system";
import { JaiLogo } from "@jaios/ui/JaiLogo";
import { cn } from "@jaios/ui/utils";

const SECTIONS = ["Appearance", "Motion", "About JaiOS"] as const;
type SectionId = (typeof SECTIONS)[number];

export function SettingsApp() {
  const [section, setSection] = useState<SectionId>("Appearance");
  const theme = useOSStore((s) => s.theme);
  const setTheme = useOSStore((s) => s.setTheme);
  const wallpaper = useOSStore((s) => s.wallpaper);
  const setWallpaper = useOSStore((s) => s.setWallpaper);
  const accent = useOSStore((s) => s.accent);
  const setAccent = useOSStore((s) => s.setAccent);
  const reducedPref = useOSStore((s) => s.reducedMotionPref);
  const setReduced = useOSStore((s) => s.setReducedMotionPref);
  const hour12 = useOSStore((s) => s.hour12);
  const setHour12 = useOSStore((s) => s.setHour12);

  return (
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
        {section === "Appearance" && (
          <div className="space-y-7">
            <Field label="Theme">
              <div className="grid grid-cols-2 gap-3">
                <OptionCard active={theme === "light"} onClick={() => setTheme("light")} icon={<Sun className="h-5 w-5" />} label="Light" />
                <OptionCard active={theme === "dark"} onClick={() => setTheme("dark")} icon={<Moon className="h-5 w-5" />} label="Dark" />
              </div>
            </Field>

            <Field label="Wallpaper">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {WALLPAPERS.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWallpaper(w.id)}
                    className={cn(
                      "overflow-hidden rounded-2xl border-2 text-left transition-colors",
                      wallpaper === w.id ? "border-accent" : "border-line hover:border-line-strong",
                    )}
                    aria-pressed={wallpaper === w.id}
                  >
                    <span className={cn("block h-16 w-full", w.className)} />
                    <span className="flex items-center justify-between px-2.5 py-1.5 text-xs font-medium text-ink">
                      {w.label}
                      {wallpaper === w.id && <Check className="h-3.5 w-3.5 text-accent" />}
                    </span>
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Clock">
              <div className="grid grid-cols-2 gap-3">
                <OptionCard active={hour12} onClick={() => setHour12(true)} icon={<Clock className="h-5 w-5" />} label="12-hour" desc="e.g. 09:41:30 PM" />
                <OptionCard active={!hour12} onClick={() => setHour12(false)} icon={<Clock className="h-5 w-5" />} label="24-hour" desc="e.g. 21:41:30" />
              </div>
            </Field>

            <Field label="Accent color">
              <div className="flex flex-wrap gap-3">
                {ACCENTS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAccent(a.id)}
                    aria-label={a.label}
                    aria-pressed={accent === a.id}
                    className={cn(
                      "grid h-10 w-10 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-surface transition-transform hover:scale-105",
                      accent === a.id ? "ring-ink/40" : "ring-transparent",
                    )}
                    style={{ background: `rgb(${theme === "dark" ? a.dark : a.light})` }}
                  >
                    {accent === a.id && <Check className="h-4 w-4 text-white" />}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {section === "Motion" && (
          <Field label="Animations">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <OptionCard active={!reducedPref} onClick={() => setReduced(false)} icon={<Zap className="h-5 w-5" />} label="Full motion" desc="Smooth transitions and micro-interactions." />
              <OptionCard active={reducedPref} onClick={() => setReduced(true)} icon={<ZapOff className="h-5 w-5" />} label="Reduced motion" desc="Minimise movement and animation." />
            </div>
          </Field>
        )}

        {section === "About JaiOS" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface-2/50 p-5">
              <JaiLogo className="h-14 w-14 drop-shadow-[0_6px_16px_rgba(240,97,47,0.3)]" />
              <div>
                <p className="font-display text-xl font-semibold tracking-tight text-ink">JaiOS</p>
                <p className="text-sm text-muted">Version 1.0 · Frontend craft, packaged as an operating system.</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              Built with Next.js, TypeScript, Tailwind CSS, Framer Motion and Zustand. Designed and
              engineered by Jai Sehgal as an interactive portfolio.
            </p>
          </div>
        )}
      </div>
    </AppTwoPane>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-faint">{label}</h3>
      {children}
    </div>
  );
}

function OptionCard({
  active,
  onClick,
  icon,
  label,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  desc?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors",
        active ? "border-accent bg-accent/[0.06]" : "border-line bg-surface hover:border-line-strong",
      )}
    >
      <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", active ? "bg-accent/15 text-accent" : "bg-surface-2 text-muted")}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
          {label}
          {active && <Check className="h-3.5 w-3.5 text-accent" />}
        </span>
        {desc && <span className="mt-0.5 block text-xs text-muted">{desc}</span>}
      </span>
    </button>
  );
}
