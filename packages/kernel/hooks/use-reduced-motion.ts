"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";
import { useOSStore } from "../store/os-store";

/**
 * Single source of truth for "should I animate?". Combines the OS-level
 * prefers-reduced-motion setting with the in-app Motion preference (Settings).
 */
export function usePrefersReducedMotion(): boolean {
  const system = useFramerReducedMotion();
  const pref = useOSStore((s) => s.reducedMotionPref);
  return Boolean(system) || pref;
}
