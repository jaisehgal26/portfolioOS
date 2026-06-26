"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZE = 17;
type Point = { x: number; y: number };
type Dir = "U" | "D" | "L" | "R";
type Status = "idle" | "playing" | "paused" | "over";

const START: Point[] = [
  { x: 8, y: 8 },
  { x: 7, y: 8 },
  { x: 6, y: 8 },
];
const OPPOSITE: Record<Dir, Dir> = { U: "D", D: "U", L: "R", R: "L" };

function randomFood(snake: Point[]): Point {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

export function SnakeApp() {
  const [snake, setSnake] = useState<Point[]>(START);
  const [food, setFood] = useState<Point>({ x: 13, y: 8 });
  const [dir, setDir] = useState<Dir>("R");
  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const dirRef = useRef(dir);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  dirRef.current = dir;
  snakeRef.current = snake;
  foodRef.current = food;

  const start = useCallback(() => {
    const fresh = START;
    setSnake(fresh);
    setDir("R");
    setScore(0);
    setFood(randomFood(fresh));
    setStatus("playing");
  }, []);

  const turn = useCallback((nd: Dir) => {
    setStatus((st) => (st === "idle" ? "playing" : st));
    setDir((cur) => (nd === OPPOSITE[cur] ? cur : nd));
  }, []);

  const tick = useCallback(() => {
    const s = snakeRef.current;
    const d = dirRef.current;
    const head = { ...s[0] };
    if (d === "U") head.y -= 1;
    else if (d === "D") head.y += 1;
    else if (d === "L") head.x -= 1;
    else head.x += 1;

    const hitsWall = head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE;
    const hitsSelf = s.some((p) => p.x === head.x && p.y === head.y);
    if (hitsWall || hitsSelf) {
      setStatus("over");
      return;
    }

    const ate = head.x === foodRef.current.x && head.y === foodRef.current.y;
    const next = [head, ...s];
    if (ate) {
      setScore((sc) => sc + 1);
      setFood(randomFood(next));
    } else {
      next.pop();
    }
    setSnake(next);
  }, []);

  useEffect(() => {
    if (status !== "playing") return;
    const speed = Math.max(70, 150 - score * 4);
    const id = setInterval(tick, speed);
    return () => clearInterval(id);
  }, [status, score, tick]);

  useEffect(() => {
    if (status === "over") setBest((b) => Math.max(b, score));
  }, [status, score]);

  useEffect(() => {
    const KEYS: Record<string, Dir> = {
      ArrowUp: "U", ArrowDown: "D", ArrowLeft: "L", ArrowRight: "R",
      w: "U", s: "D", a: "L", d: "R", W: "U", S: "D", A: "L", D: "R",
    };
    function onKey(e: KeyboardEvent) {
      if (e.key === " ") {
        e.preventDefault();
        setStatus((st) => (st === "playing" ? "paused" : st === "paused" ? "playing" : st));
        return;
      }
      const nd = KEYS[e.key];
      if (!nd) return;
      e.preventDefault();
      turn(nd);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turn]);

  const cells = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const isHead = snake[0].x === x && snake[0].y === y;
      const isBody = !isHead && snake.some((p) => p.x === x && p.y === y);
      const isFood = food.x === x && food.y === y;
      cells.push(
        <div
          key={`${x}-${y}`}
          className={cn(
            "aspect-square rounded-[3px]",
            isHead ? "bg-accent" : isBody ? "bg-accent/65" : isFood ? "bg-ink" : "bg-transparent",
          )}
        />,
      );
    }
  }

  return (
    <div className="flex h-full flex-col items-center gap-4 overflow-y-auto p-5">
      <div className="flex w-full max-w-[440px] items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">Score</p>
          <p className="font-display text-2xl font-semibold tabular-nums text-ink">{score}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">Best</p>
          <p className="font-display text-2xl font-semibold tabular-nums text-muted">{best}</p>
        </div>
      </div>

      <div className="relative w-full max-w-[440px]">
        <div
          className="grid aspect-square w-full gap-px rounded-2xl border border-line bg-surface-2 p-1.5 shadow-soft"
          style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
        >
          {cells}
        </div>

        {status !== "playing" && (
          <div className="absolute inset-0 grid place-items-center rounded-2xl bg-bg/70 backdrop-blur-sm">
            <div className="text-center">
              <p className="font-display text-xl font-semibold tracking-tight text-ink">
                {status === "over" ? "Game over" : status === "paused" ? "Paused" : "Snake"}
              </p>
              {status === "over" && <p className="mt-1 text-sm text-muted">You scored {score}.</p>}
              {status === "idle" && <p className="mt-1 text-sm text-muted">Arrow keys / WASD · space to pause</p>}
              <button
                type="button"
                onClick={status === "paused" ? () => setStatus("playing") : start}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
              >
                {status === "over" ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {status === "over" ? "Play again" : status === "paused" ? "Resume" : "Start"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touch controls */}
      <div className="grid grid-cols-3 gap-2 sm:hidden">
        <span />
        <DPad icon={<ArrowUp className="h-5 w-5" />} onClick={() => turn("U")} label="Up" />
        <span />
        <DPad icon={<ArrowLeft className="h-5 w-5" />} onClick={() => turn("L")} label="Left" />
        <DPad icon={<ArrowDown className="h-5 w-5" />} onClick={() => turn("D")} label="Down" />
        <DPad icon={<ArrowRight className="h-5 w-5" />} onClick={() => turn("R")} label="Right" />
      </div>
    </div>
  );
}

function DPad({ icon, onClick, label }: { icon: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-surface text-ink shadow-soft active:scale-95"
    >
      {icon}
    </button>
  );
}
