"use client";

import { create } from "zustand";

export type LogKind = "log" | "info" | "warn" | "error" | "input" | "result";

export interface LogLine {
  id: string;
  kind: LogKind;
  /** A single primitive/object value, or a string message. */
  value: unknown;
}

interface ConsoleState {
  lines: LogLine[];
  push: (kind: LogKind, value: unknown) => void;
  clear: () => void;
}

let seq = 0;

export const useConsole = create<ConsoleState>((set) => ({
  lines: [],
  push: (kind, value) => {
    seq += 1;
    set((s) => ({ lines: [...s.lines.slice(-200), { id: `log-${seq}`, kind, value }] }));
  },
  clear: () => set({ lines: [] }),
}));
