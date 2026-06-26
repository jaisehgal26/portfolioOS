import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and de-dupe conflicting Tailwind classes. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Clamp a number between bounds. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
