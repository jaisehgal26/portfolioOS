"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Gamepad2, Radio, ShieldCheck, Sparkles } from "lucide-react";
import { AppScroll } from "@/components/ui/AppShell";
import { useOSStore } from "@/store/os-store";
import { downloadResume } from "@/lib/download";
import { playSound } from "@/lib/sounds";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "jaios-secret";
const SIGNAL = "You're the kind of person who clicks invisible buttons. I'd hire you.";
const TARGET_FREQ = 73;

const DOSSIER = [
  "I write loading states before the happy path — trust is built in the gaps.",
  "My best debugger is explaining the bug out loud to an empty chair.",
  "I once refactored a component at 2am because the border-radius felt wrong.",
  "This entire OS runs in your browser. No Electron. No shortcuts.",
  "If you found this, you probably also tried `sudo rm -rf /` in Terminal.",
] as const;

interface SecretState {
  visits: number;
  signalDecoded: boolean;
  revealed: number[];
}

function loadState(): SecretState {
  if (typeof window === "undefined") return { visits: 0, signalDecoded: false, revealed: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { visits: 0, signalDecoded: false, revealed: [] };
    return JSON.parse(raw) as SecretState;
  } catch {
    return { visits: 0, signalDecoded: false, revealed: [] };
  }
}

function saveState(state: SecretState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode */
  }
}

/** How readable the intercepted signal is at a given frequency (0–1). */
function signalClarity(freq: number): number {
  const dist = Math.abs(freq - TARGET_FREQ);
  return Math.max(0, 1 - dist / 22);
}

function scrambleText(text: string, clarity: number): string {
  const pool = "█▓▒░@#$%&*?01";
  return text
    .split("")
    .map((char, i) => {
      if (/[\s.,!?—'"]/.test(char)) return char;
      if (clarity >= 0.94) return char;
      const gate = ((i * 13 + 7) % 100) / 100;
      return gate < clarity ? char : pool[i % pool.length];
    })
    .join("");
}

function accessLevel(state: SecretState, clarity: number): number {
  let level = 1;
  if (state.visits > 1) level = 2;
  if (clarity >= 0.94 || state.signalDecoded) level = 3;
  if (state.revealed.length >= DOSSIER.length) level = 4;
  return level;
}

const LEVEL_LABELS = ["", "Visitor", "Return agent", "Signal clear", "Full clearance"] as const;

export function SecretApp() {
  const openApp = useOSStore((s) => s.openApp);
  const pushToast = useOSStore((s) => s.pushToast);
  const tryUnlock = useOSStore((s) => s.tryUnlock);
  const unlockedCount = useOSStore((s) => s.unlockedAchievements.length);
  const reduced = usePrefersReducedMotion();
  const decodedRef = useRef(false);

  const [state, setState] = useState<SecretState>(loadState);
  const [freq, setFreq] = useState(42);
  const clarity = signalClarity(freq);
  const display = useMemo(() => scrambleText(SIGNAL, clarity), [clarity]);
  const level = accessLevel(state, clarity);
  const allRevealed = state.revealed.length >= DOSSIER.length;

  useEffect(() => {
    const prev = loadState();
    const next = { ...prev, visits: prev.visits + 1 };
    saveState(next);
    setState(next);
    if (next.visits > 1) tryUnlock("return-agent");
  }, [tryUnlock]);

  useEffect(() => {
    if (clarity < 0.94 || decodedRef.current) return;
    decodedRef.current = true;
    playSound("notify");
    pushToast("Signal intercepted — message decoded");
    tryUnlock("signal-clear");
    setState((s) => {
      const next = { ...s, signalDecoded: true };
      saveState(next);
      return next;
    });
  }, [clarity, pushToast, tryUnlock]);

  const revealLine = useCallback((index: number) => {
    setState((s) => {
      if (s.revealed.includes(index)) return s;
      playSound("toggle");
      const next = { ...s, revealed: [...s.revealed, index] };
      saveState(next);
      if (next.revealed.length === DOSSIER.length) {
        setTimeout(() => {
          pushToast("Full clearance granted");
          tryUnlock("full-clearance");
        }, 400);
      }
      return next;
    });
  }, [pushToast, tryUnlock]);

  return (
    <AppScroll className="relative">
      {/* Subtle scan line */}
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px animate-pulse bg-gradient-to-r from-transparent via-violet/40 to-transparent"
        />
      )}

      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="text-center">
          <motion.span
            initial={reduced ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet/12 text-violet ring-1 ring-violet/20"
          >
            <Sparkles className="h-6 w-6" />
          </motion.span>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.28em] text-faint">
            Classified // Sector-7
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">
            You found the secret folder
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Clearance level {level}/4 — <span className="text-accent">{LEVEL_LABELS[level]}</span>
            {unlockedCount > 0 && (
              <span className="text-faint"> · {unlockedCount} achievement{unlockedCount !== 1 ? "s" : ""} unlocked</span>
            )}
          </p>
        </div>

        {/* Access meter */}
        <div className="mt-5 flex gap-1" aria-label={`Access level ${level} of 4`}>
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-300",
                i < level ? "bg-violet" : "bg-ink/10",
              )}
            />
          ))}
        </div>

        {/* Signal tuner */}
        <section className="mt-6 rounded-2xl border border-line bg-surface-2/60 p-5">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
            <Radio className="h-3.5 w-3.5 text-violet" />
            Intercept transmission
          </div>
          <p className="mt-1 text-xs text-muted">Tune the frequency until the message locks in.</p>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>0 MHz</span>
              <span className={cn("font-mono tabular-nums", clarity >= 0.94 && "text-violet")}>
                {freq} MHz
              </span>
              <span>100 MHz</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={freq}
              onChange={(e) => setFreq(Number(e.target.value))}
              aria-label="Signal frequency"
              className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-ink/10 accent-violet"
            />
          </div>

          <div
            className={cn(
              "mt-4 rounded-xl border px-4 py-3 font-mono text-sm leading-relaxed transition-colors",
              clarity >= 0.94
                ? "border-violet/30 bg-violet/8 text-ink"
                : "border-line bg-surface text-muted",
            )}
          >
            {display}
          </div>
        </section>

        {/* Redacted dossier */}
        <section className="mt-4 rounded-2xl border border-line bg-surface-2/60 p-5">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
            <ShieldCheck className="h-3.5 w-3.5 text-mint" />
            Personnel file
          </div>
          <p className="mt-1 text-xs text-muted">Tap each redacted line to declassify.</p>

          <ul className="mt-4 space-y-2.5">
            {DOSSIER.map((line, i) => {
              const open = state.revealed.includes(i);
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => revealLine(i)}
                    disabled={open}
                    className={cn(
                      "w-full rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all",
                      open
                        ? "cursor-default border-mint/25 bg-mint/8 text-ink"
                        : "border-line bg-ink/[0.04] hover:border-line-strong",
                    )}
                  >
                    {open ? (
                      line
                    ) : (
                      <span className="flex flex-col gap-1.5" aria-hidden>
                        <span className="block h-2.5 w-full rounded-sm bg-ink/70" />
                        <span className="block h-2.5 w-4/5 rounded-sm bg-ink/70" />
                      </span>
                    )}
                    {!open && <span className="sr-only">Tap to reveal classified line</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Clearance stamp */}
        <AnimatePresence>
          {(state.signalDecoded || allRevealed) && (
            <motion.div
              initial={reduced ? false : { scale: 1.6, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: -6 }}
              className="pointer-events-none mx-auto mt-6 w-fit rounded-lg border-2 border-violet/50 px-4 py-2 text-center"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet">Curiosity</p>
              <p className="font-display text-lg font-bold uppercase tracking-wider text-violet">
                {allRevealed ? "Verified" : "Certified"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="mt-6 grid gap-2.5">
          <button
            type="button"
            onClick={downloadResume}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" /> Download résumé
          </button>
          <button
            type="button"
            onClick={() => openApp("snake")}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-line-strong"
          >
            <Gamepad2 className="h-4 w-4 text-mint" /> Play Snake
          </button>
        </div>

        {state.visits > 1 && (
          <p className="mt-4 text-center text-[11px] text-faint">
            Visit #{state.visits} — thanks for coming back.
          </p>
        )}
      </div>
    </AppScroll>
  );
}
