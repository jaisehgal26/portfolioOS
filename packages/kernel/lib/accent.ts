import type { Accent } from "@jaios/content/projects";

interface AccentClasses {
  text: string;
  softBg: string;
  border: string;
  dot: string;
  /** Full chip styling (bg + text) for accented chips. */
  chip: string;
  /** Subtle tinted icon tile (bg + text). */
  tile: string;
}

/**
 * Static map of accent → literal Tailwind classes. Kept literal (not built by
 * string concatenation) so Tailwind's content scanner keeps these classes.
 */
export const ACCENT: Record<Accent, AccentClasses> = {
  accent: {
    text: "text-accent",
    softBg: "bg-accent/10",
    border: "border-accent/30",
    dot: "bg-accent",
    chip: "bg-accent/10 text-accent border-accent/20",
    tile: "bg-accent/10 text-accent",
  },
  blue: {
    text: "text-blue",
    softBg: "bg-blue/10",
    border: "border-blue/30",
    dot: "bg-blue",
    chip: "bg-blue/10 text-blue border-blue/20",
    tile: "bg-blue/10 text-blue",
  },
  violet: {
    text: "text-violet",
    softBg: "bg-violet/10",
    border: "border-violet/30",
    dot: "bg-violet",
    chip: "bg-violet/10 text-violet border-violet/20",
    tile: "bg-violet/10 text-violet",
  },
  mint: {
    text: "text-mint",
    softBg: "bg-mint/10",
    border: "border-mint/30",
    dot: "bg-mint",
    chip: "bg-mint/10 text-mint border-mint/20",
    tile: "bg-mint/10 text-mint",
  },
  amber: {
    text: "text-amber",
    softBg: "bg-amber/10",
    border: "border-amber/30",
    dot: "bg-amber",
    chip: "bg-amber/10 text-amber border-amber/20",
    tile: "bg-amber/10 text-amber",
  },
};
