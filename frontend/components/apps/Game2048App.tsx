"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useOSStore } from "@/store/os-store";
import { cn } from "@/lib/utils";

const SIZE = 4;

type Grid = number[][];

function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function randomCell(grid: Grid): [number, number] | null {
  const empty: [number, number][] = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (grid[y][x] === 0) empty.push([x, y]);
    }
  }
  if (empty.length === 0) return null;
  return empty[Math.floor(Math.random() * empty.length)]!;
}

function spawn(grid: Grid): Grid {
  const next = grid.map((row) => [...row]);
  const cell = randomCell(next);
  if (cell) {
    const [x, y] = cell;
    next[y][x] = Math.random() < 0.9 ? 2 : 4;
  }
  return next;
}

function slideLine(line: number[]): { line: number[]; gained: number } {
  const filtered = line.filter((n) => n !== 0);
  let gained = 0;
  const merged: number[] = [];
  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      const v = filtered[i] * 2;
      merged.push(v);
      gained += v;
      i++;
    } else {
      merged.push(filtered[i]);
    }
  }
  while (merged.length < SIZE) merged.push(0);
  return { line: merged, gained };
}

function move(grid: Grid, dir: "U" | "D" | "L" | "R"): { grid: Grid; moved: boolean; gained: number } {
  let moved = false;
  let gained = 0;
  const next = emptyGrid();

  if (dir === "L" || dir === "R") {
    for (let y = 0; y < SIZE; y++) {
      const row = grid[y];
      const line = dir === "L" ? row : [...row].reverse();
      const { line: slid, gained: g } = slideLine(line);
      gained += g;
      const out = dir === "L" ? slid : [...slid].reverse();
      if (out.some((v, i) => v !== row[i])) moved = true;
      next[y] = out;
    }
  } else {
    for (let x = 0; x < SIZE; x++) {
      const col = grid.map((row) => row[x]);
      const line = dir === "U" ? col : [...col].reverse();
      const { line: slid, gained: g } = slideLine(line);
      gained += g;
      const out = dir === "U" ? slid : [...slid].reverse();
      for (let y = 0; y < SIZE; y++) {
        if (out[y] !== grid[y][x]) moved = true;
        next[y][x] = out[y];
      }
    }
  }

  return { grid: next, moved, gained };
}

function canMove(grid: Grid): boolean {
  if (grid.some((row) => row.some((n) => n === 0))) return true;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const v = grid[y][x];
      if (x < SIZE - 1 && grid[y][x + 1] === v) return true;
      if (y < SIZE - 1 && grid[y + 1][x] === v) return true;
    }
  }
  return false;
}

function maxTile(grid: Grid): number {
  return grid.reduce((m, row) => Math.max(m, ...row), 0);
}

const TILE_BG: Record<number, string> = {
  0: "bg-surface-2",
  2: "bg-ink/5",
  4: "bg-ink/10",
  8: "bg-accent/20",
  16: "bg-accent/30",
  32: "bg-accent/40",
  64: "bg-accent/50",
  128: "bg-accent/60",
  256: "bg-accent/70",
  512: "bg-accent/80",
  1024: "bg-accent/90",
  2048: "bg-accent text-bg",
};

export function Game2048App() {
  const tryUnlock = useOSStore((s) => s.tryUnlock);
  const [grid, setGrid] = useState<Grid>(() => spawn(spawn(emptyGrid())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("jaios-2048-best");
      if (raw) setBest(Number(raw) || 0);
    } catch {
      /* ignore */
    }
  }, []);

  const doMove = useCallback(
    (dir: "U" | "D" | "L" | "R") => {
      if (over) return;
      setGrid((g) => {
        const { grid: next, moved, gained } = move(g, dir);
        if (!moved) return g;
        const spawned = spawn(next);
        setScore((s) => {
          const total = s + gained;
          setBest((b) => {
            const nb = Math.max(b, total);
            try {
              localStorage.setItem("jaios-2048-best", String(nb));
            } catch {
              /* ignore */
            }
            return nb;
          });
          return total;
        });
        if (maxTile(spawned) >= 2048) tryUnlock("tile-master");
        if (!canMove(spawned)) setOver(true);
        return spawned;
      });
    },
    [over, tryUnlock],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const map: Record<string, "U" | "D" | "L" | "R"> = {
        ArrowUp: "U",
        ArrowDown: "D",
        ArrowLeft: "L",
        ArrowRight: "R",
      };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      doMove(dir);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doMove]);

  function restart() {
    setGrid(spawn(spawn(emptyGrid())));
    setScore(0);
    setOver(false);
  }

  return (
    <div className="flex h-full flex-col items-center gap-4 p-4">
      <div className="flex w-full max-w-[280px] items-center justify-between text-sm">
        <div className="rounded-xl bg-surface-2 px-3 py-1.5">
          <span className="text-[10px] font-semibold uppercase text-faint">Score</span>
          <p className="font-display text-lg font-semibold tabular-nums text-ink">{score}</p>
        </div>
        <div className="rounded-xl bg-surface-2 px-3 py-1.5">
          <span className="text-[10px] font-semibold uppercase text-faint">Best</span>
          <p className="font-display text-lg font-semibold tabular-nums text-ink">{best}</p>
        </div>
        <button type="button" onClick={restart} className="rounded-lg p-2 text-muted hover:bg-ink/5" aria-label="Restart">
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div
        className="grid max-w-[280px] grid-cols-4 gap-2 rounded-2xl border border-line bg-surface-2 p-2"
        onTouchStart={(e) => {
          const t = e.touches[0];
          touchRef.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          const start = touchRef.current;
          touchRef.current = null;
          if (!start) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;
          if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
          if (Math.abs(dx) > Math.abs(dy)) doMove(dx > 0 ? "R" : "L");
          else doMove(dy > 0 ? "D" : "U");
        }}
      >
        {grid.flatMap((row, y) =>
          row.map((n, x) => (
            <div
              key={`${x}-${y}`}
              className={cn(
                "grid h-14 w-14 place-items-center rounded-xl font-display text-lg font-bold tabular-nums transition-colors",
                TILE_BG[n] ?? "bg-accent text-bg",
                n === 0 && "text-transparent",
              )}
            >
              {n || ""}
            </div>
          )),
        )}
      </div>

      {over && <p className="text-sm font-semibold text-accent">Game over — tap restart</p>}
      <p className="text-xs text-faint">Arrow keys or swipe to play</p>
    </div>
  );
}
