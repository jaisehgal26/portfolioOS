import type { AppId } from "@/data/apps";
import {
  ACHIEVEMENTS,
  ACHIEVEMENTS_BY_ID,
  type Achievement,
  type AchievementId,
} from "@/data/achievements";

const STORAGE_KEY = "jaios-achievements";
const STATS_KEY = "jaios-achievement-stats";

interface AchievementStats {
  appsOpened: AppId[];
  terminalCommands: string[];
}

function loadStats(): AchievementStats {
  if (typeof window === "undefined") return { appsOpened: [], terminalCommands: [] };
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { appsOpened: [], terminalCommands: [] };
    const parsed = JSON.parse(raw) as Partial<AchievementStats>;
    return {
      appsOpened: Array.isArray(parsed.appsOpened) ? parsed.appsOpened : [],
      terminalCommands: Array.isArray(parsed.terminalCommands) ? parsed.terminalCommands : [],
    };
  } catch {
    return { appsOpened: [], terminalCommands: [] };
  }
}

function saveStats(stats: AchievementStats) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    /* quota / private mode */
  }
}

export function loadUnlockedAchievements(): AchievementId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const ids = JSON.parse(raw) as string[];
    return ids.filter((id): id is AchievementId => id in ACHIEVEMENTS_BY_ID);
  } catch {
    return [];
  }
}

export function saveUnlockedAchievements(ids: AchievementId[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* quota / private mode */
  }
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

/** Record a unique app open; returns how many distinct apps have been opened. */
export function recordAppOpen(appId: AppId): number {
  const stats = loadStats();
  if (!stats.appsOpened.includes(appId)) {
    stats.appsOpened = [...stats.appsOpened, appId];
    saveStats(stats);
  }
  return stats.appsOpened.length;
}

/** Record a terminal command verb; returns count of unique commands run. */
export function recordTerminalCommand(verb: string): number {
  const cmd = verb.toLowerCase();
  const stats = loadStats();
  if (!stats.terminalCommands.includes(cmd)) {
    stats.terminalCommands = [...stats.terminalCommands, cmd];
    saveStats(stats);
  }
  return stats.terminalCommands.length;
}

export function getAchievementDisplay(achievement: Achievement, unlocked: boolean): {
  title: string;
  description: string;
} {
  if (!unlocked && achievement.hidden) {
    return { title: "???", description: "Hidden achievement — keep exploring." };
  }
  return { title: achievement.title, description: achievement.description };
}

export function formatAchievementsForTerminal(unlockedIds: string[]): { kind: "out" | "sys"; text: string }[] {
  const unlocked = new Set(unlockedIds);
  const lines: { kind: "out" | "sys"; text: string }[] = [
    { kind: "out", text: `Achievements — ${unlocked.size}/${ACHIEVEMENTS.length} unlocked` },
    { kind: "sys", text: "─".repeat(40) },
  ];

  for (const a of ACHIEVEMENTS) {
    const isUnlocked = unlocked.has(a.id);
    const { title, description } = getAchievementDisplay(a, isUnlocked);
    const mark = isUnlocked ? "✓" : "·";
    const tier = isUnlocked || !a.hidden ? ` [${a.tier}]` : "";
    lines.push({ kind: "out", text: `${mark} ${title}${tier}` });
    if (isUnlocked || !a.hidden) {
      lines.push({ kind: "sys", text: `    ${description}` });
    }
  }

  return lines;
}
