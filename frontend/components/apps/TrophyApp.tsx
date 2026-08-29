"use client";

import { useMemo, useState } from "react";
import { ACHIEVEMENTS, TIER_ORDER, type AchievementTier } from "@/data/achievements";
import { AchievementGrid } from "@/components/achievements/AchievementGrid";
import { AppScroll } from "@/components/ui/AppShell";
import { useOSStore } from "@/store/os-store";
import { cn } from "@/lib/utils";

const FILTERS: (AchievementTier | "all")[] = ["all", ...TIER_ORDER];

export function TrophyApp() {
  const unlockedIds = useOSStore((s) => s.unlockedAchievements);
  const [tier, setTier] = useState<AchievementTier | "all">("all");
  const unlocked = useMemo(() => new Set(unlockedIds), [unlockedIds]);
  const pct = Math.round((unlocked.size / ACHIEVEMENTS.length) * 100);

  return (
    <AppScroll className="p-5">
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="relative grid h-28 w-28 place-items-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(var(--line))" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgb(var(--accent))"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 * (1 - pct / 100)}
            />
          </svg>
          <div className="text-center">
            <p className="font-display text-2xl font-bold tabular-nums text-ink">
              {unlocked.size}/{ACHIEVEMENTS.length}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">Trophies</p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap justify-center gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setTier(f)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors",
              tier === f ? "bg-ink text-bg" : "border border-line text-muted hover:bg-ink/5",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <AchievementGrid unlocked={unlocked} tierFilter={tier} />
    </AppScroll>
  );
}
