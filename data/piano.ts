export type PianoKeyType = "white" | "black";

export interface PianoKey {
  id: string;
  label: string;
  type: PianoKeyType;
  /** Keyboard binding (lowercase) */
  bind: string;
}

/** One octave keyboard — C4 through C5. */
export const PIANO_KEYS: PianoKey[] = [
  { id: "C4", label: "C", type: "white", bind: "a" },
  { id: "Cs4", label: "C♯", type: "black", bind: "w" },
  { id: "D4", label: "D", type: "white", bind: "s" },
  { id: "Ds4", label: "D♯", type: "black", bind: "e" },
  { id: "E4", label: "E", type: "white", bind: "d" },
  { id: "F4", label: "F", type: "white", bind: "f" },
  { id: "Fs4", label: "F♯", type: "black", bind: "t" },
  { id: "G4", label: "G", type: "white", bind: "g" },
  { id: "Gs4", label: "G♯", type: "black", bind: "y" },
  { id: "A4", label: "A", type: "white", bind: "h" },
  { id: "As4", label: "A♯", type: "black", bind: "u" },
  { id: "B4", label: "B", type: "white", bind: "j" },
  { id: "C5", label: "C", type: "white", bind: "k" },
];

export const BIND_TO_NOTE = Object.fromEntries(PIANO_KEYS.map((k) => [k.bind, k.id]));
