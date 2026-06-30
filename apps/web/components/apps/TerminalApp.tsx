"use client";

import { useEffect, useRef, useState } from "react";
import { useOSStore } from "@jaios/kernel/store";
import { APPS } from "@jaios/kernel/data/apps";
import { profile, links } from "@jaios/content/profile";
import { cn } from "@jaios/ui/utils";

type Line = { kind: "in" | "out" | "err" | "sys"; text: string };

// Any reckless `rm -rf …` (with or without sudo, with or without a target).
const DANGER = /^(sudo\s+)?rm\s+-rf\b/i;

const LINE_COLOR: Record<Line["kind"], string> = {
  in: "text-[#e9e3d9]",
  out: "text-[#cfc8bd]",
  err: "text-[#ff9b8a]",
  sys: "text-[#8f877b]",
};

export function TerminalApp() {
  const openApp = useOSStore((s) => s.openApp);
  const crash = useOSStore((s) => s.crash);
  const [lines, setLines] = useState<Line[]>([
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

  function print(...out: Line[]) {
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

    const [name, ...args] = cmd.split(/\s+/);
    const arg = args.join(" ");

    switch (name.toLowerCase()) {
      case "help":
        print(
          { kind: "out", text: "Commands: help · whoami · about · ls · open <app> · cat <file> · date · echo <text> · clear" },
          { kind: "sys", text: "Some commands are more dangerous than others. 😏" },
        );
        break;
      case "whoami":
        print({ kind: "out", text: `${profile.name} — ${profile.role} · ${profile.location} · ${profile.experience}` });
        break;
      case "about":
        print({ kind: "out", text: profile.aboutIntro });
        break;
      case "ls":
        print({
          kind: "out",
          text: APPS.filter((a) => a.id !== "text-viewer" && a.id !== "secret")
            .map((a) => a.shortName.toLowerCase().replace(/\s+/g, "-"))
            .join("  "),
        });
        break;
      case "open": {
        const t = APPS.find(
          (a) =>
            a.id === arg ||
            a.shortName.toLowerCase() === arg.toLowerCase() ||
            a.name.toLowerCase() === arg.toLowerCase(),
        );
        if (t) {
          print({ kind: "out", text: `Opening ${t.name}…` });
          openApp(t.id);
        } else {
          print({ kind: "err", text: `open: app not found: ${arg || "(none)"}` });
        }
        break;
      }
      case "cat":
        if (/contact/i.test(arg)) print({ kind: "out", text: `${links.email}  ·  ${links.phone}` });
        else if (/resume/i.test(arg)) {
          print({ kind: "out", text: "Opening resume…" });
          openApp("resume");
        } else print({ kind: "err", text: `cat: ${arg || "(missing operand)"}: No such file` });
        break;
      case "date":
        print({ kind: "out", text: new Date().toString() });
        break;
      case "echo":
        print({ kind: "out", text: arg });
        break;
      case "clear":
        setLines([]);
        break;
      case "sudo":
        print({ kind: "out", text: "Nice try — you're not root here. 🙂" });
        break;
      default:
        print({ kind: "err", text: `command not found: ${name}` });
    }
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
