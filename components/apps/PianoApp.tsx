"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { useOSStore } from "@/store/os-store";
import { PIANO_KEYS, BIND_TO_NOTE } from "@/data/piano";
import { playPianoNote, PIANO_NOTE_IDS } from "@/lib/piano";
import { cn } from "@/lib/utils";

type Mode = "play" | "echo";
type EchoPhase = "idle" | "listen" | "your-turn" | "over";

const BLACK_LEFT: Record<string, string> = {
  Cs4: "8.5%",
  Ds4: "20.5%",
  Fs4: "44.5%",
  Gs4: "56.5%",
  As4: "68.5%",
};

const WHITE = PIANO_KEYS.filter((k) => k.type === "white");
const BLACK = PIANO_KEYS.filter((k) => k.type === "black");

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
      window.setTimeout(() => setActive(null), 120);

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
    <div className="flex h-full flex-col items-center gap-4 overflow-y-auto p-5">
      <div className="flex w-full max-w-lg items-center justify-between gap-3">
        <div className="flex gap-1 rounded-full border border-line bg-surface-2 p-1">
          <Tab active={mode === "play"} onClick={() => { setMode("play"); setEchoPhase("idle"); }}>
            Free play
          </Tab>
          <Tab active={mode === "echo"} onClick={() => setMode("echo")}>
            Echo game
          </Tab>
        </div>
        {mode === "echo" && (
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">Round</p>
            <p className="font-display text-xl font-semibold tabular-nums text-ink">{round}</p>
          </div>
        )}
      </div>

      {mode === "echo" && (
        <p className="text-center text-sm text-muted">
          {echoPhase === "idle" && "Listen to the melody, then repeat it — one note longer each round."}
          {echoPhase === "listen" && "Listen…"}
          {echoPhase === "your-turn" && "Your turn — play the sequence"}
          {echoPhase === "over" && `Game over — you reached round ${round}. Best: ${Math.max(best, round)}`}
        </p>
      )}

      {!soundEnabled && (
        <p className="text-center text-xs text-amber">Sound is off — enable it in Control Center to hear notes.</p>
      )}

      <div className="relative mx-auto w-full max-w-lg select-none">
        <div className="flex h-44 rounded-b-xl border border-line bg-surface-2 p-1 shadow-soft sm:h-52">
          {WHITE.map((key) => (
            <PianoKeyButton
              key={key.id}
              pianoKey={key}
              active={active === key.id}
              onPress={() => press(key.id, mode === "echo")}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-1 h-28 sm:h-32">
          {BLACK.map((key) => (
            <div
              key={key.id}
              className="pointer-events-auto absolute top-0 w-[7%]"
              style={{ left: BLACK_LEFT[key.id] }}
            >
              <PianoKeyButton
                pianoKey={key}
                active={active === key.id}
                onPress={() => press(key.id, mode === "echo")}
                black
              />
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-faint">
        Keyboard: A–K row · W E T Y U for sharps
      </p>

      {mode === "echo" && (echoPhase === "idle" || echoPhase === "over") && (
        <div className="text-center">
          {(echoPhase === "idle" || echoPhase === "over") && (
            <button
              type="button"
              onClick={startEcho}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
            >
              {echoPhase === "over" ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {echoPhase === "over" ? "Play again" : "Start"}
            </button>
          )}
        </div>
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
        "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
        active ? "bg-ink text-bg" : "text-muted hover:text-ink",
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
  pianoKey: (typeof PIANO_KEYS)[number];
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
        "relative flex flex-1 flex-col items-center justify-end rounded-b-lg border transition-all active:scale-[0.98]",
        black
          ? cn(
              "z-10 h-full min-h-[5.5rem] border-ink/30 bg-ink text-bg shadow-md",
              active && "bg-accent",
            )
          : cn(
              "h-full border-line bg-surface shadow-soft",
              active ? "bg-accent/15 border-accent/40" : "hover:bg-surface-2",
            ),
      )}
    >
      <span className={cn("pb-2 text-[10px] font-medium", black ? "text-bg/80" : "text-faint")}>
        {pianoKey.bind.toUpperCase()}
      </span>
    </button>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
