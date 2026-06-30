"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@jaios/ui/utils";

type Tab = "clock" | "stopwatch" | "timer";

export function ClockApp() {
  const [tab, setTab] = useState<Tab>("clock");

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-line px-3 py-2">
        {(["clock", "stopwatch", "timer"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors",
              tab === t ? "bg-ink/5 text-ink" : "text-muted hover:text-ink",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        {tab === "clock" && <ClockFace />}
        {tab === "stopwatch" && <Stopwatch />}
        {tab === "timer" && <Timer />}
      </div>
    </div>
  );
}

function ClockFace() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <div className="h-24" />;
  return (
    <div className="text-center" suppressHydrationWarning>
      <p className="font-display text-6xl font-semibold tabular-nums tracking-tight text-ink">
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </p>
      <p className="mt-2 text-sm text-muted">
        {now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
      </p>
    </div>
  );
}

function fmt(ms: number, withMs = false): string {
  const total = Math.max(0, ms);
  const m = Math.floor(total / 60000);
  const s = Math.floor((total % 60000) / 1000);
  const cs = Math.floor((total % 1000) / 10);
  const base = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return withMs ? `${base}.${String(cs).padStart(2, "0")}` : base;
}

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const startRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now() - elapsed;
    const loop = () => {
      setElapsed(performance.now() - startRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  return (
    <div className="flex flex-col items-center gap-7">
      <p className="font-display text-6xl font-semibold tabular-nums tracking-tight text-ink">
        {fmt(elapsed, true)}
      </p>
      <div className="flex items-center gap-3">
        <RoundButton
          onClick={() => setRunning((r) => !r)}
          variant="accent"
          label={running ? "Pause" : "Start"}
          icon={running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        />
        <RoundButton
          onClick={() => {
            setRunning(false);
            setElapsed(0);
          }}
          label="Reset"
          icon={<RotateCcw className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}

const PRESETS = [1, 3, 5, 10];

function Timer() {
  const [duration, setDuration] = useState(5 * 60000);
  const [remaining, setRemaining] = useState(5 * 60000);
  const [running, setRunning] = useState(false);
  const endRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    endRef.current = performance.now() + remaining;
    const id = setInterval(() => {
      const left = endRef.current - performance.now();
      if (left <= 0) {
        setRemaining(0);
        setRunning(false);
        clearInterval(id);
      } else {
        setRemaining(left);
      }
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const done = remaining <= 0;
  const progress = duration > 0 ? 1 - remaining / duration : 0;

  function setMinutes(min: number) {
    setRunning(false);
    setDuration(min * 60000);
    setRemaining(min * 60000);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative grid h-44 w-44 place-items-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgb(var(--line))" strokeWidth="4" />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="rgb(var(--accent))"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 46}
            strokeDashoffset={2 * Math.PI * 46 * progress}
            className="transition-[stroke-dashoffset] duration-200"
          />
        </svg>
        <span className={cn("font-display text-4xl font-semibold tabular-nums", done ? "text-accent" : "text-ink")}>
          {fmt(remaining)}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {PRESETS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMinutes(m)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              duration === m * 60000 ? "bg-ink text-bg" : "border border-line text-muted hover:bg-ink/5 hover:text-ink",
            )}
          >
            {m}m
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <RoundButton
          onClick={() => {
            if (done) setRemaining(duration);
            else setRunning((r) => !r);
          }}
          variant="accent"
          label={running ? "Pause" : "Start"}
          icon={running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        />
        <RoundButton
          onClick={() => {
            setRunning(false);
            setRemaining(duration);
          }}
          label="Reset"
          icon={<RotateCcw className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}

function RoundButton({
  onClick,
  icon,
  label,
  variant = "plain",
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant?: "plain" | "accent";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid h-12 w-12 place-items-center rounded-full transition-transform active:scale-95",
        variant === "accent" ? "bg-ink text-bg hover:opacity-90" : "border border-line bg-surface text-ink hover:bg-ink/5",
      )}
    >
      {icon}
    </button>
  );
}
