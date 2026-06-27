/**
 * Tiny synthesized UI sound engine (Web Audio — no asset files). Sounds are
 * short and quiet on purpose. The AudioContext is created lazily and resumed
 * on the first call (which always follows a user gesture), satisfying autoplay
 * policies.
 */
export type SoundKind = "open" | "close" | "minimize" | "toggle" | "notify" | "error" | "boot";

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  c: AudioContext,
  freq: number,
  start: number,
  dur: number,
  peak: number,
  type: OscillatorType = "sine",
) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + start);
  gain.gain.setValueAtTime(0.0001, c.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(peak, c.currentTime + start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + dur + 0.02);
}

export function playSound(kind: SoundKind) {
  const c = audio();
  if (!c) return;

  switch (kind) {
    case "open":
      tone(c, 523, 0, 0.13, 0.05, "sine");
      tone(c, 784, 0.05, 0.12, 0.04, "sine");
      break;
    case "close":
      tone(c, 523, 0, 0.12, 0.045, "sine");
      tone(c, 349, 0.05, 0.12, 0.04, "sine");
      break;
    case "minimize":
      tone(c, 660, 0, 0.1, 0.04, "sine");
      tone(c, 440, 0.04, 0.1, 0.035, "sine");
      break;
    case "toggle":
      tone(c, 880, 0, 0.06, 0.03, "triangle");
      break;
    case "notify":
      tone(c, 880, 0, 0.16, 0.05, "sine");
      tone(c, 1175, 0.1, 0.18, 0.045, "sine");
      break;
    case "error":
      tone(c, 196, 0, 0.32, 0.06, "sawtooth");
      tone(c, 146, 0.08, 0.34, 0.05, "sawtooth");
      break;
    case "boot":
      tone(c, 392, 0, 0.5, 0.045, "sine");
      tone(c, 523, 0.12, 0.5, 0.045, "sine");
      tone(c, 659, 0.24, 0.6, 0.05, "sine");
      tone(c, 784, 0.36, 0.7, 0.045, "sine");
      break;
  }
}
