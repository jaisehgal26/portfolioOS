"use client";

import { ACHIEVEMENTS, TIER_ORDER, type AchievementTier } from "@/data/achievements";
import { getAchievementDisplay } from "@/lib/achievements";
import { cn } from "@/lib/utils";

export const TIER_STYLES: Record<AchievementTier, string> = {
  gold: "border-amber-400/40 bg-amber-400/10 text-amber-700 dark:text-amber-300",
  silver: "border-line bg-ink/5 text-muted",
  bronze: "border-orange-400/30 bg-orange-400/10 text-orange-800 dark:text-orange-200",
};

interface AchievementGridProps {
  unlocked: Set<string>;
  tierFilter?: AchievementTier | "all";
  className?: string;
}

export function AchievementGrid({ unlocked, tierFilter = "all", className }: AchievementGridProps) {
  const list = [...ACHIEVEMENTS]
    .filter((a) => tierFilter === "all" || a.tier === tierFilter)
    .sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));

  return (
    <div className={cn("grid grid-cols-1 gap-2.5 sm:grid-cols-2", className)}>
      {list.map((a) => {
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
                <span
                  className={cn(
                    "mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                    TIER_STYLES[a.tier],
                  )}
                >
                  {a.tier}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
