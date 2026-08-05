"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Music2, Play, RotateCcw } from "lucide-react";
import { useOSStore } from "@/store/os-store";
import { PIANO_KEYS, BIND_TO_NOTE, type PianoKey } from "@/data/piano";
import { playPianoNote, PIANO_NOTE_IDS } from "@/lib/piano";
import { cn } from "@/lib/utils";

type Mode = "play" | "echo";
type EchoPhase = "idle" | "listen" | "your-turn" | "over";

/** Black sharp key that sits on the right edge of a white key. */
const BLACK_AFTER: Partial<Record<string, string>> = {
  C4: "Cs4",
  D4: "Ds4",
  F4: "Fs4",
  G4: "Gs4",
  A4: "As4",
};

const WHITE = PIANO_KEYS.filter((k) => k.type === "white");
const BLACK_BY_ID = Object.fromEntries(PIANO_KEYS.filter((k) => k.type === "black").map((k) => [k.id, k]));

function randomNote(): string {
  return PIANO_NOTE_IDS[Math.floor(Math.random() * PIANO_NOTE_IDS.length)];
}

export function PianoApp() {
  const tryUnlock = useOSStore((s) => s.tryUnlock);
  const soundEnabled = useOSStore((s) => s.soundEnabled);

  const [mode, setMode] = useState<Mode>("play");
  const [active, setActive] = useState<string | null>(null);
  const [echoPhase, setEchoPhase] = useState<EchoPhase>("idle");
  const [sequence, setSequence] = useState<string[]>([]);
  const [inputIdx, setInputIdx] = useState(0);
  const [round, setRound] = useState(0);
  const [best, setBest] = useState(0);

  const sequenceRef = useRef(sequence);
  sequenceRef.current = sequence;

  const press = useCallback(
    (noteId: string, fromGame = false) => {
      if (soundEnabled) playPianoNote(noteId);
      setActive(noteId);
      window.setTimeout(() => setActive(null), 140);

      if (!fromGame || echoPhase !== "your-turn") return;

      const expected = sequenceRef.current[inputIdx];
      if (noteId !== expected) {
        setEchoPhase("over");
        setBest((b) => Math.max(b, round));
        return;
      }
      const next = inputIdx + 1;
      if (next >= sequenceRef.current.length) {
        const nextRound = round + 1;
        setRound(nextRound);
        if (nextRound >= 8) tryUnlock("piano-virtuoso");
        setInputIdx(0);
        setEchoPhase("listen");
        const extra = randomNote();
        setSequence((seq) => [...seq, extra]);
      } else {
        setInputIdx(next);
      }
    },
    [soundEnabled, echoPhase, inputIdx, round, tryUnlock],
  );

  const startEcho = useCallback(() => {
    const first = randomNote();
    setSequence([first]);
    setRound(0);
    setInputIdx(0);
    setEchoPhase("listen");
  }, []);

  useEffect(() => {
    if (echoPhase !== "listen" || sequence.length === 0) return;

    let cancelled = false;
    const playSeq = async () => {
      await sleep(400);
      for (const note of sequence) {
        if (cancelled) return;
        if (soundEnabled) playPianoNote(note, 0.22);
        setActive(note);
        await sleep(450);
        setActive(null);
        await sleep(120);
      }
      if (!cancelled) setEchoPhase("your-turn");
    };
    void playSeq();
    return () => {
      cancelled = true;
    };
  }, [echoPhase, sequence, soundEnabled]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const note = BIND_TO_NOTE[e.key.toLowerCase()];
      if (!note) return;
      e.preventDefault();
      press(note, mode === "echo");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press, mode]);

  return (
    <div className="flex h-full flex-col items-center gap-5 overflow-y-auto p-5 sm:p-6">
      <div className="flex w-full max-w-2xl items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink/[0.06] text-ink">
            <Music2 className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="font-display text-sm font-semibold tracking-tight text-ink">Piano</p>
            <p className="text-[11px] text-muted">One octave · Web Audio</p>
          </div>
        </div>

        <div className="flex gap-1 rounded-full border border-line bg-surface-2 p-1 shadow-soft">
          <Tab active={mode === "play"} onClick={() => { setMode("play"); setEchoPhase("idle"); }}>
            Free play
          </Tab>
          <Tab active={mode === "echo"} onClick={() => setMode("echo")}>
            Echo game
          </Tab>
        </div>
      </div>

      {mode === "echo" && (
        <div className="flex w-full max-w-2xl flex-wrap items-center justify-between gap-3">
          <p
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm",
              echoPhase === "your-turn"
                ? "border-accent/30 bg-accent/10 text-ink"
                : "border-line bg-surface text-muted",
            )}
          >
            {echoPhase === "idle" && "Listen, then repeat — one note longer each round."}
            {echoPhase === "listen" && "Listen carefully…"}
            {echoPhase === "your-turn" && "Your turn — play the sequence"}
            {echoPhase === "over" && `Game over — round ${round} · best ${Math.max(best, round)}`}
          </p>
          {echoPhase !== "idle" && echoPhase !== "over" && (
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">Round</p>
              <p className="font-display text-2xl font-semibold tabular-nums leading-none text-ink">{round}</p>
            </div>
          )}
        </div>
      )}

      {!soundEnabled && (
        <p className="text-center text-xs text-amber">Sound is off — enable it in Control Center to hear notes.</p>
      )}

      {/* Piano case */}
      <div className="w-full max-w-2xl select-none">
        <div
          className={cn(
            "rounded-[1.35rem] p-3 sm:p-4",
            "bg-gradient-to-b from-[#3d3832] via-[#2a2622] to-[#1a1714]",
            "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]",
            "ring-1 ring-black/40",
          )}
        >
          {/* Key bed */}
          <div
            className={cn(
              "relative overflow-visible rounded-xl p-2 pt-2.5 sm:p-2.5",
              "bg-gradient-to-b from-[#141210] to-[#0c0b0a]",
              "shadow-[inset_0_4px_12px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)]",
            )}
          >
            <div className="relative flex gap-[3px] sm:gap-1">
              {WHITE.map((key) => {
                const blackId = BLACK_AFTER[key.id];
                const blackKey = blackId ? BLACK_BY_ID[blackId] : undefined;

                return (
                  <div key={key.id} className="relative min-w-0 flex-1">
                    <PianoKeyButton
                      pianoKey={key}
                      active={active === key.id}
                      onPress={() => press(key.id, mode === "echo")}
                    />
                    {blackKey && (
                      <div className="absolute -right-[38%] top-0 z-20 w-[76%] sm:-right-[40%] sm:w-[80%]">
                        <PianoKeyButton
                          pianoKey={blackKey}
                          active={active === blackKey.id}
                          onPress={() => press(blackKey.id, mode === "echo")}
                          black
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fall board lip */}
          <div className="mx-1 mt-2 h-1 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <p className="mt-3 text-center text-[11px] tracking-wide text-faint">
          <span className="text-muted">Keys</span> A S D F G H J K
          <span className="mx-2 text-line-strong">·</span>
          <span className="text-muted">Sharps</span> W E T Y U
        </p>
      </div>

      {mode === "echo" && (echoPhase === "idle" || echoPhase === "over") && (
        <button
          type="button"
          onClick={startEcho}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg shadow-soft transition-transform hover:-translate-y-0.5"
        >
          {echoPhase === "over" ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {echoPhase === "over" ? "Play again" : "Start game"}
        </button>
      )}
    </div>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
        active ? "bg-ink text-bg shadow-sm" : "text-muted hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function PianoKeyButton({
  pianoKey,
  active,
  onPress,
  black,
}: {
  pianoKey: PianoKey;
  active: boolean;
  onPress: () => void;
  black?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={`${pianoKey.label} (${pianoKey.bind})`}
      className={cn(
        "group relative w-full touch-manipulation transition-transform duration-75 ease-out",
        black ? "h-[9.5rem] sm:h-[11rem]" : "h-[12.5rem] sm:h-[14.5rem]",
        active && !black && "translate-y-[3px]",
        active && black && "translate-y-[2px]",
      )}
    >
      <span
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-end overflow-hidden",
          black
            ? cn(
                "rounded-b-[0.45rem] rounded-t-sm",
                "bg-gradient-to-b from-[#484848] via-[#1c1c1c] to-[#080808]",
                "shadow-[0_6px_14px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)]",
                "ring-1 ring-inset ring-white/5",
                active && "from-accent via-accent/90 to-accent/80 shadow-[0_3px_8px_rgba(0,0,0,0.4)]",
              )
            : cn(
                "rounded-b-[0.55rem] rounded-t-[0.2rem]",
                "bg-gradient-to-b from-[#fffffe] via-[#f3f0ea] to-[#ddd6ca]",
                "shadow-[0_4px_0_#c9c0b2,0_8px_16px_rgba(0,0,0,0.12)]",
                "ring-1 ring-inset ring-white/80",
                "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[38%] before:bg-gradient-to-b before:from-white/70 before:to-transparent",
                active
                  ? "from-accent/20 via-accent/10 to-[#e8dfd4] shadow-[0_1px_0_#c9c0b2,0_4px_8px_rgba(0,0,0,0.1)] ring-accent/30"
                  : "hover:from-[#fff] hover:to-[#e8e2d8]",
              ),
        )}
      >
        {!black && (
          <span className="relative z-10 mb-1 font-display text-[10px] font-medium tracking-tight text-[#9a9288] sm:text-[11px]">
            {pianoKey.label}
          </span>
        )}
        <span
          className={cn(
            "relative z-10 mb-2 rounded-md px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider sm:text-[10px]",
            black
              ? "bg-black/25 text-white/70 group-hover:text-white/90"
              : "bg-black/[0.04] text-[#a39a8f] group-hover:text-[#7a7268]",
            active && !black && "bg-accent/15 text-accent",
            active && black && "bg-black/20 text-white",
          )}
        >
          {pianoKey.bind}
        </span>
      </span>
    </button>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
