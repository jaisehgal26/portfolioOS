"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { notes } from "@/data/notes";
import { useOSStore } from "@/store/os-store";
import { cn } from "@/lib/utils";

const SNIPPETS = notes.slice(0, 5).map((n) => n.preview);

function pickSnippet() {
  return SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)] ?? SNIPPETS[0];
}

function wpm(chars: number, seconds: number): number {
  if (seconds <= 0) return 0;
  return Math.round((chars / 5 / seconds) * 60);
}

export function TypingTestApp() {
  const tryUnlock = useOSStore((s) => s.tryUnlock);
  const [target, setTarget] = useState(pickSnippet);
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);

  const restart = useCallback(() => {
    setTarget(pickSnippet());
    setTyped("");
    setStarted(false);
    setDone(false);
    setElapsed(0);
    startRef.current = null;
  }, []);

  useEffect(() => {
    if (!started || done) return;
    const id = setInterval(() => {
      if (startRef.current) setElapsed((performance.now() - startRef.current) / 1000);
    }, 100);
    return () => clearInterval(id);
  }, [started, done]);

  function onInput(value: string) {
    if (done) return;
    if (!started) {
      setStarted(true);
      startRef.current = performance.now();
    }
    setTyped(value.slice(0, target.length));
    if (value.length >= target.length) {
      setDone(true);
      const secs = startRef.current ? (performance.now() - startRef.current) / 1000 : 0;
      if (wpm(target.length, secs) >= 60) tryUnlock("speed-typist");
    }
  }

  const correct = typed.split("").filter((c, i) => c === target[i]).length;
  const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 100;
  const speed = wpm(correct, elapsed);

  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">
          <span className="font-semibold text-ink">{speed}</span> WPM ·{" "}
          <span className="font-semibold text-ink">{accuracy}%</span> acc ·{" "}
          <span className="font-semibold text-ink tabular-nums">{elapsed.toFixed(1)}s</span>
        </span>
        <button type="button" onClick={restart} className="rounded-lg p-1.5 text-muted hover:bg-ink/5 hover:text-ink" aria-label="Restart">
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <p className="rounded-xl border border-line bg-surface-2 p-4 font-mono text-sm leading-relaxed">
        {target.split("").map((ch, i) => {
          const t = typed[i];
          let cls = "text-muted";
          if (t !== undefined) cls = t === ch ? "text-mint" : "text-accent bg-accent/10";
          else if (i === typed.length) cls = "text-ink underline decoration-accent decoration-2";
          return (
            <span key={i} className={cls}>
              {ch}
            </span>
          );
        })}
      </p>

      <textarea
        value={typed}
        onChange={(e) => onInput(e.target.value)}
        disabled={done}
        autoFocus
        spellCheck={false}
        className={cn(
          "min-h-[80px] flex-1 resize-none rounded-xl border border-line bg-surface p-3 font-mono text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30",
          done && "opacity-60",
        )}
        placeholder="Start typing…"
      />

      {done && (
        <p className="text-center text-sm font-semibold text-ink">
          Done — {speed} WPM at {accuracy}% accuracy
        </p>
      )}
    </div>
  );
}
