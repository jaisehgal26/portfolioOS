"use client";

import { useMemo } from "react";
import {
  Bus,
  CloudFog,
  CloudRain,
  Droplets,
  Flame,
  Moon,
  Music2,
  Plane,
  Ship,
  Train,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { AppScroll } from "@/components/ui/AppShell";
import { useOSStore } from "@/store/os-store";
import { AMBIENCE_TRACKS, getAmbienceTrack, type AmbienceTrackId } from "@/data/ambience";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  cloudRain: CloudRain,
  waves: Waves,
  moon: Moon,
  flame: Flame,
  droplets: Droplets,
  cloudFog: CloudFog,
  plane: Plane,
  ship: Ship,
  bus: Bus,
  train: Train,
};

function Visualizer({ active }: { active: boolean }) {
  return (
    <div className="flex h-10 items-end justify-center gap-1" aria-hidden>
      {[0.35, 0.65, 1, 0.5, 0.8, 0.45, 0.7].map((h, i) => (
        <span
          key={i}
          className={cn(
            "w-1.5 rounded-full bg-accent/70",
            active && "animate-pulse",
          )}
          style={{
            height: `${h * 100}%`,
            animationDelay: active ? `${i * 0.12}s` : undefined,
            animationDuration: active ? "0.9s" : undefined,
          }}
        />
      ))}
    </div>
  );
}

export function MusicApp() {
  const track = useOSStore((s) => s.ambienceTrack);
  const volume = useOSStore((s) => s.ambienceVolume);
  const soundEnabled = useOSStore((s) => s.soundEnabled);
  const dnd = useOSStore((s) => s.dnd);
  const setAmbienceTrack = useOSStore((s) => s.setAmbienceTrack);
  const setAmbienceVolume = useOSStore((s) => s.setAmbienceVolume);

  const playing = track !== "off" && soundEnabled && !dnd;
  const current = getAmbienceTrack(track);
  const CurrentIcon = current ? (ICONS[current.icon] ?? Music2) : Music2;

  const status = useMemo(() => {
    if (track === "off") return "Choose a sound to start";
    if (!soundEnabled) return "Sound is off in Control Center";
    if (dnd) return "Paused — Focus mode is on";
    return "Now playing";
  }, [track, soundEnabled, dnd]);

  return (
    <AppScroll>
      <header className="mb-6 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-accent/10 text-accent">
          <CurrentIcon className="h-8 w-8" />
        </div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          {current?.label ?? "Music"}
        </h1>
        <p className="mt-1 text-sm text-muted">{status}</p>
        {current && <p className="mt-0.5 text-xs text-faint">{current.summary}</p>}
      </header>

      <div className="mx-auto mb-8 max-w-xs rounded-2xl border border-line bg-surface-2/50 px-6 py-5">
        <Visualizer active={playing} />
      </div>

      <div className="mx-auto max-w-lg rounded-2xl border border-line bg-surface p-4 shadow-soft sm:p-5">
        <label className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-faint">
          Volume
          <span className="tabular-nums text-muted">{Math.round(volume * 100)}%</span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(volume * 100)}
          onChange={(e) => setAmbienceVolume(Number(e.target.value) / 100)}
          aria-label="Ambience volume"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-accent"
        />
      </div>

      <div className="mx-auto mt-6 grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => setAmbienceTrack("off")}
          className={cn(
            "rounded-2xl border px-3 py-3 text-left transition-colors",
            track === "off"
              ? "border-accent/40 bg-accent/10"
              : "border-line bg-surface hover:border-line-strong",
          )}
        >
          <span className="text-sm font-medium text-ink">Off</span>
          <span className="mt-0.5 block text-xs text-muted">Silence</span>
        </button>
        {AMBIENCE_TRACKS.map((t) => {
          const Icon = ICONS[t.icon] ?? Music2;
          const active = track === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setAmbienceTrack(t.id as AmbienceTrackId)}
              className={cn(
                "rounded-2xl border px-3 py-3 text-left transition-colors",
                active
                  ? "border-accent/40 bg-accent/10"
                  : "border-line bg-surface hover:border-line-strong",
              )}
            >
              <span className="flex items-center gap-2 text-sm font-medium text-ink">
                <Icon className="h-4 w-4 shrink-0 text-accent" />
                {t.label}
              </span>
              <span className="mt-0.5 block text-xs text-muted">{t.summary}</span>
            </button>
          );
        })}
      </div>
    </AppScroll>
  );
}
