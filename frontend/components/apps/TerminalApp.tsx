"use client";

import { useEffect, useRef, useState } from "react";
import { useOSStore } from "@/store/os-store";
import { recordTerminalCommand } from "@/lib/achievements";
import { runTerminalCommand, type TerminalLine } from "@/lib/terminal-commands";
import { cn } from "@/lib/utils";

// Any reckless `rm -rf …` (with or without sudo, with or without a target).
const DANGER = /^(sudo\s+)?rm\s+-rf\b/i;

const LINE_COLOR: Record<TerminalLine["kind"], string> = {
  in: "text-[#e9e3d9]",
  out: "text-[#cfc8bd]",
  err: "text-[#ff9b8a]",
  sys: "text-[#8f877b]",
};

export function TerminalApp() {
  const openApp = useOSStore((s) => s.openApp);
  const setTheme = useOSStore((s) => s.setTheme);
  const setWallpaper = useOSStore((s) => s.setWallpaper);
  const crash = useOSStore((s) => s.crash);
  const tryUnlock = useOSStore((s) => s.tryUnlock);
  const theme = useOSStore((s) => s.theme);
  const wallpaper = useOSStore((s) => s.wallpaper);
  const windows = useOSStore((s) => s.windows);
  const unlockedAchievements = useOSStore((s) => s.unlockedAchievements);
  const [lines, setLines] = useState<TerminalLine[]>([
    { kind: "sys", text: "JaiOS Terminal — type `help` to begin." },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  function print(...out: TerminalLine[]) {
    setLines((prev) => [...prev, ...out]);
  }

  function run(raw: string) {
    const cmd = raw.trim();
    print({ kind: "in", text: cmd });
    if (!cmd) return;
    setHistory((h) => [cmd, ...h]);
    setHistIdx(-1);

    if (DANGER.test(cmd)) {
      print(
        { kind: "err", text: "rm: descending into '/' …" },
        { kind: "err", text: "💥 catastrophic success. kernel panic incoming." },
      );
      setTimeout(crash, 700);
      return;
    }

    const result = runTerminalCommand(cmd, {
      openApp,
      setTheme,
      setWallpaper,
      getSysinfo: () => ({
        theme,
        wallpaper,
        windowsCount: windows.length,
        achievementsUnlocked: unlockedAchievements.length,
        online: typeof navigator !== "undefined" ? navigator.onLine : true,
      }),
      getUnlockedAchievements: () => unlockedAchievements,
    });
    const verb = cmd.split(/\s+/)[0]?.toLowerCase();
    if (verb) {
      const uniqueCount = recordTerminalCommand(verb);
      if (uniqueCount >= 8) tryUnlock("command-master");
    }
    if (result.clear) {
      setLines([]);
      return;
    }
    if (result.lines.length > 0) print(...result.lines);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistIdx((i) => {
        const ni = Math.min(history.length - 1, i + 1);
        if (history[ni] !== undefined) setInput(history[ni]);
        return ni;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistIdx((i) => {
        const ni = Math.max(-1, i - 1);
        setInput(ni === -1 ? "" : history[ni] ?? "");
        return ni;
      });
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex h-full flex-col bg-[#16130f] font-mono text-[13px] leading-relaxed"
    >
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-4">
        {lines.map((l, i) => (
          <p key={i} className={cn("whitespace-pre-wrap break-words", LINE_COLOR[l.kind])}>
            {l.kind === "in" ? (
              <>
                <span className="text-[#63d29b]">jai@portfolio</span>
                <span className="text-[#8f877b]">:~$ </span>
                {l.text}
              </>
            ) : (
              l.text
            )}
          </p>
        ))}
        <div className="flex items-center">
          <span className="text-[#63d29b]">jai@portfolio</span>
          <span className="text-[#8f877b]">:~$&nbsp;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            aria-label="Terminal input"
            className="flex-1 bg-transparent text-[#e9e3d9] caret-[#63d29b] outline-none"
          />
        </div>
      </div>
    </div>
  );
}
