/** Equal-temperament frequencies for one octave + top C. */
const FREQ: Record<string, number> = {
  C4: 261.63,
  Cs4: 277.18,
  D4: 293.66,
  Ds4: 311.13,
  E4: 329.63,
  F4: 349.23,
  Fs4: 369.99,
  G4: 392.0,
  Gs4: 415.3,
  A4: 440.0,
  As4: 466.16,
  B4: 493.88,
  C5: 523.25,
};

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function playPianoNote(noteId: string, volume = 0.18) {
  const c = getCtx();
  const freq = FREQ[noteId];
  if (!c || !freq) return;

  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(volume, c.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.75);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 0.8);
}

export const PIANO_NOTE_IDS = Object.keys(FREQ);
