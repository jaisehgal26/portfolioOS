"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ChevronRight, Info, Trash2, XCircle } from "lucide-react";
import { useOSStore } from "@jaios/kernel/store";
import { useBrowserStore } from "@jaios/kernel/browser-store";
import { profile, links } from "@jaios/content/profile";
import { projects } from "@jaios/content/projects";
import { experience } from "@jaios/content/experience";
import { skillGroups } from "@jaios/content/skills";
import { notes } from "@jaios/content/notes";
import { cn } from "@jaios/ui/utils";
import { inputToUrl } from "../lib/routes";
import { useConsole, type LogKind } from "./use-console";
import { JsonView } from "./JsonView";

const HELP = [
  "jai.about(), jai.projects(), jai.project('healthcare')",
  "jai.skills(), jai.experience(), jai.contact(), jai.notes()",
  "jai.goto('jai://projects'), jai.open('about'), jai.theme('dark')",
  "jai.hire()  ·  help()  ·  clear()",
].join("\n");

function stripQuotes(s: string): string {
  return s.trim().replace(/^['"]|['"]$/g, "");
}

export function ConsolePanel() {
  const push = useConsole((s) => s.push);
  const clear = useConsole((s) => s.clear);
  const lines = useConsole((s) => s.lines);

  const navigate = useBrowserStore((s) => s.navigate);
  const setTheme = useOSStore((s) => s.setTheme);
  const crash = useOSStore((s) => s.crash);

  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const greeted = useRef(false);

  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    if (useConsole.getState().lines.length === 0) push("info", "Console ready. Curious? try help()");
  }, [push]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  function evaluate(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    push("input", cmd);

    // Easter eggs first.
    if (/^(sudo\s+)?rm\s+-rf\b/i.test(cmd)) {
      push("warn", "Flushing everything to /dev/null …");
      crash();
      return;
    }
    if (/^sudo\b/i.test(cmd)) {
      push("error", "Permission denied: you're not root here. 🙂");
      return;
    }
    if (cmd === "help()" || cmd === "help") return void push("log", HELP);
    if (cmd === "clear()" || cmd === "clear") return clear();

    const jai = cmd.match(/^jai\.(\w+)\(\s*(.*?)\s*\)$/);
    if (jai) {
      const [, method, argRaw] = jai;
      const arg = stripQuotes(argRaw);
      switch (method) {
        case "about":
          return void push("result", profile);
        case "projects":
          return void push("result", projects);
        case "project": {
          const p = projects.find((x) => x.id === arg || x.title.toLowerCase().includes(arg.toLowerCase()));
          return void (p ? push("result", p) : push("error", `No project matching "${arg}"`));
        }
        case "skills":
          return void push("result", skillGroups);
        case "experience":
          return void push("result", experience);
        case "notes":
          return void push("result", notes.map((n) => n.title));
        case "contact":
          return void push("result", { email: links.email, phone: links.phone, linkedin: links.linkedin, github: links.github });
        case "goto":
        case "open": {
          const url = inputToUrl(arg || "home");
          navigate(url);
          return void push("info", `navigating → ${url}`);
        }
        case "theme": {
          if (arg === "dark" || arg === "light") {
            setTheme(arg);
            return void push("info", `theme set to ${arg}`);
          }
          return void push("error", "theme expects 'dark' or 'light'");
        }
        case "hire": {
          navigate("jai://contact");
          return void push("result", "Great choice. Opening contact…");
        }
        default:
          return void push("error", `Uncaught TypeError: jai.${method} is not a function`);
      }
    }

    // Safe arithmetic (digits/operators only — never arbitrary code).
    if (/^[0-9+\-*/(). %]+$/.test(cmd)) {
      try {
        const v = Function(`"use strict"; return (${cmd});`)() as unknown;
        return void push("result", v);
      } catch {
        return void push("error", "Uncaught SyntaxError: invalid expression");
      }
    }

    if (/^['"].*['"]$/.test(cmd)) return void push("result", stripQuotes(cmd));

    const ident = cmd.split(/[.( ]/)[0];
    push("error", `Uncaught ReferenceError: ${ident} is not defined`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = input;
      if (v.trim()) setHist((h) => [...h, v]);
      setHistIdx(-1);
      setInput("");
      evaluate(v);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (hist.length === 0) return;
      const next = histIdx === -1 ? hist.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setInput(hist[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === -1) return;
      const next = histIdx + 1;
      if (next >= hist.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(next);
        setInput(hist[next]);
      }
    }
  }

  return (
    <div className="flex h-full flex-col bg-bg font-mono text-xs">
      <div className="flex items-center justify-between border-b border-line px-2 py-1 text-faint">
        <span>Console</span>
        <button type="button" onClick={clear} aria-label="Clear console" className="grid h-6 w-6 place-items-center rounded hover:bg-ink/5 hover:text-ink">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
        {lines.map((l) => (
          <Line key={l.id} kind={l.kind} value={l.value} />
        ))}
      </div>

      <div className="flex items-center gap-1.5 border-t border-line px-3 py-1.5">
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-accent" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          aria-label="Console input"
          placeholder="Run a command — try help()"
          className="min-w-0 flex-1 bg-transparent text-ink placeholder:text-faint focus:outline-none"
        />
      </div>
    </div>
  );
}

function Line({ kind, value }: { kind: LogKind; value: unknown }) {
  const isObject = typeof value === "object" && value !== null;
  const text = typeof value === "string" ? value : null;

  if (kind === "input") {
    return (
      <div className="flex gap-1.5 text-ink/70">
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-faint" />
        <span className="whitespace-pre-wrap break-words">{String(value)}</span>
      </div>
    );
  }

  const tone =
    kind === "error" ? "text-danger" : kind === "warn" ? "text-amber" : kind === "info" ? "text-blue" : "text-ink";
  const Icon = kind === "error" ? XCircle : kind === "warn" ? AlertTriangle : kind === "info" ? Info : null;

  return (
    <div className={cn("flex gap-1.5 border-b border-line/40 py-0.5", tone)}>
      {Icon && <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
      <div className="min-w-0 flex-1">
        {isObject ? <JsonView value={value} /> : <span className="whitespace-pre-wrap break-words">{text}</span>}
      </div>
    </div>
  );
}
