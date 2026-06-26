import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and de-dupe conflicting Tailwind classes. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a 0-based index as a fixed-width log line number, e.g. 0007. */
export function logIndex(n: number, width = 4) {
  return String(n).padStart(width, "0");
}

/** Deterministic pseudo-jitter from a seed — keeps SSR/CSR markup identical. */
export function seededJitter(seed: number, min: number, max: number) {
  const x = Math.sin(seed * 99.13) * 10000;
  const frac = x - Math.floor(x);
  return min + frac * (max - min);
}

/** Clamp a number between bounds. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Tiny promise delay used by simulated streams. */
export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
