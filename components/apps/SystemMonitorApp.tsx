"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  HardDrive,
  Layers,
  MemoryStick,
  MonitorSmartphone,
  Sparkles,
  Trophy,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { AppScroll } from "@/components/ui/AppShell";
import { ACHIEVEMENTS, TIER_ORDER, type AchievementTier } from "@/data/achievements";
import { useOSStore } from "@/store/os-store";
import { getAchievementDisplay } from "@/lib/achievements";
import { getApp } from "@/data/apps";
import { experienceYM } from "@/data/profile";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Skills as running processes — deterministic load values (stable across renders). */
const processes: { name: string; group: string; load: number }[] = [
  { name: "TypeScript", group: "Language", load: 96 },
  { name: "React.js", group: "Framework", load: 94 },
  { name: "Next.js", group: "Framework", load: 90 },
  { name: "Tailwind CSS", group: "Styling", load: 88 },
  { name: "Zustand / Redux", group: "State", load: 83 },
  { name: "WebSockets / SSE", group: "Real-time", load: 80 },
  { name: "Framer Motion", group: "Motion", load: 75 },
  { name: "React Query", group: "Data", load: 71 },
  { name: "shadcn/ui", group: "Styling", load: 68 },
  { name: "Vercel AI SDK", group: "AI UI", load: 64 },
];

/** Skill groups resident in "memory" — width ∝ skill count. */
const memory: { name: string; count: number }[] = [
  { name: "Core frontend", count: 6 },
  { name: "Styling & UI", count: 5 },
  { name: "State & data", count: 5 },
  { name: "Real-time", count: 5 },
  { name: "Delivery", count: 5 },
  { name: "AI product UI", count: 3 },
  { name: "Testing", count: 3 },
];
const memoryTotal = memory.reduce((sum, g) => sum + g.count, 0);
const memoryTiers = [1, 0.82, 0.66, 0.52, 0.42, 0.32, 0.24];

const specs: { icon: LucideIcon; label: string; value: string; sub: string }[] = [
  { icon: Cpu, label: "Chip", value: "Sehgal Frontend Engine", sub: `${experienceYM()} yrs · 8-core focus` },
  { icon: MemoryStick, label: "Memory", value: "React · Next.js · TypeScript", sub: "Unified, fully typed" },
  { icon: Sparkles, label: "Neural engine", value: "Streaming AI UI cores", sub: "SSE · tool-calls · reasoning" },
  { icon: MonitorSmartphone, label: "Display", value: "Pixel-perfect Retina UI", sub: "Responsive · accessible" },
  { icon: HardDrive, label: "Storage", value: "5 flagship case studies", sub: "Deep-dive narratives" },
  { icon: Wifi, label: "Connectivity", value: "REST · GraphQL · WS · SSE", sub: "Resilient, reconnecting" },
];

function BlockMeter({ load }: { load: number }) {
  const reduced = usePrefersReducedMotion();
  const filled = Math.round(load / 10);
  return (
    <div className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 10 }, (_, i) => (
        <motion.span
          key={i}
          initial={reduced ? false : { opacity: 0, scaleY: 0.4 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : i * 0.025 }}
          className={cn(
            "h-3.5 w-1.5 rounded-[2px]",
            i < filled ? "bg-accent" : "bg-ink/10",
          )}
        />
      ))}
    </div>
  );
}

function Battery({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-2">
      <Zap className="h-3.5 w-3.5 text-accent" aria-hidden />
      <span className="font-display text-sm font-semibold tabular-nums text-ink">{level}%</span>
      <span className="relative flex h-4 w-8 items-center rounded-[4px] border border-ink/30 p-[2px]">
        <span
          className="h-full rounded-[2px] bg-accent transition-[width] duration-700"
          style={{ width: `${level}%` }}
        />
        <span className="absolute -right-[3px] top-1/2 h-1.5 w-[2px] -translate-y-1/2 rounded-r-sm bg-ink/30" />
      </span>
    </div>
  );
}

const TIER_STYLES: Record<AchievementTier, string> = {
  bronze: "border-amber-500/30 bg-amber-500/8 text-amber-700 dark:text-amber-400",
  silver: "border-slate-400/30 bg-slate-400/8 text-slate-600 dark:text-slate-300",
  gold: "border-yellow-500/40 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
};

export function SystemMonitorApp() {
  const theme = useOSStore((s) => s.theme);
  const windows = useOSStore((s) => s.windows);
  const focusedId = useOSStore((s) => s.focusedId);
  const unlockedAchievements = useOSStore((s) => s.unlockedAchievements);
  const reduced = usePrefersReducedMotion();
  const unlocked = new Set(unlockedAchievements);

  // Live session clock → derives a gently-draining "battery" and uptime.
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const battery = Math.max(64, 100 - Math.floor(seconds / 30));
  const uptime = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const session = [
    { k: "Uptime", v: uptime },
    { k: "Theme", v: theme },
    { k: "Open apps", v: String(windows.length) },
    { k: "Active", v: focusedId ? getApp(focusedId).shortName : "Desktop" },
  ];

  return (
    <AppScroll>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Activity Monitor</h1>
          <p className="mt-1 text-sm text-muted">A live read-out of the stack running this engineer.</p>
        </div>
        <div className="shrink-0 rounded-full border border-line bg-surface px-3 py-1.5 shadow-soft">
          <Battery level={battery} />
        </div>
      </div>

      {/* Skill memory */}
      <section className="rounded-2xl border border-line bg-surface p-4 shadow-soft sm:p-5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-faint">
            <MemoryStick className="h-3.5 w-3.5" /> Memory · skills resident
          </h2>
          <span className="font-display text-sm font-semibold tabular-nums text-ink">
            {memoryTotal}<span className="text-muted"> / 32 GB</span>
          </span>
        </div>

        {/* Allocation bar */}
        <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-ink/[0.06]">
          {memory.map((g, i) => (
            <motion.span
              key={g.name}
              initial={reduced ? false : { width: 0 }}
              animate={{ width: `${(g.count / memoryTotal) * 100}%` }}
              transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
              style={{ backgroundColor: `rgb(var(--accent) / ${memoryTiers[i] ?? 0.2})` }}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {memory.map((g, i) => (
            <span key={g.name} className="flex items-center gap-1.5 text-xs text-muted">
              <span
                className="h-2 w-2 rounded-[3px]"
                style={{ backgroundColor: `rgb(var(--accent) / ${memoryTiers[i] ?? 0.2})` }}
              />
              {g.name}
              <span className="tabular-nums text-faint">{g.count}</span>
            </span>
          ))}
        </div>
      </section>

      {/* Processes */}
      <h2 className="mt-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-faint">
        <Layers className="h-3.5 w-3.5" /> Processes · top skills by load
      </h2>
      <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
        {processes.map((p, i) => (
          <div
            key={p.name}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5",
              i !== processes.length - 1 && "border-b border-line/70",
            )}
          >
            <span className="w-36 min-w-0">
              <span className="block truncate text-sm font-medium text-ink">{p.name}</span>
              <span className="block truncate text-[11px] text-faint">{p.group}</span>
            </span>
            <span className="hidden flex-1 sm:block">
              <BlockMeter load={p.load} />
            </span>
            <span className="ml-auto font-display text-sm font-semibold tabular-nums text-ink">{p.load}%</span>
          </div>
        ))}
      </div>

      {/* Hardware */}
      <h2 className="mt-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-faint">
        <Cpu className="h-3.5 w-3.5" /> Hardware
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {specs.map((spec) => (
          <div key={spec.label} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 shadow-soft">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
              <spec.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">{spec.label}</p>
              <p className="mt-0.5 truncate text-sm font-semibold text-ink">{spec.value}</p>
              <p className="truncate text-xs text-muted">{spec.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Session */}
      <h2 className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-faint">Session</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {session.map((s) => (
          <div key={s.k} className="rounded-2xl border border-line bg-surface p-3.5 shadow-soft">
            <p className="text-xs font-medium uppercase tracking-wider text-faint">{s.k}</p>
            <p className="mt-1 font-display text-sm font-semibold capitalize text-ink tabular-nums" suppressHydrationWarning>
              {s.v}
            </p>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <h2 className="mt-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-faint">
        <Trophy className="h-3.5 w-3.5" /> Achievements · {unlocked.size}/{ACHIEVEMENTS.length}
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {[...ACHIEVEMENTS]
          .sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier))
          .map((a) => {
            const isUnlocked = unlocked.has(a.id);
            const { title, description } = getAchievementDisplay(a, isUnlocked);
            return (
              <div
                key={a.id}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border p-3.5 shadow-soft transition-opacity",
                  isUnlocked ? "border-line bg-surface" : "border-line/60 bg-surface/50 opacity-60",
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg",
                    isUnlocked ? TIER_STYLES[a.tier] : "bg-ink/5 text-faint grayscale",
                  )}
                  aria-hidden
                >
                  {isUnlocked ? a.icon : "?"}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-0.5 text-xs text-muted">{description}</p>
                  {isUnlocked && (
                    <span className={cn("mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", TIER_STYLES[a.tier])}>
                      {a.tier}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </AppScroll>
  );
}
