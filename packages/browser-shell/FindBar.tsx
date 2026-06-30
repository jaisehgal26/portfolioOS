"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface WindowWithFind extends Window {
  find?: (text: string, caseSensitive?: boolean, backwards?: boolean, wrapAround?: boolean) => boolean;
}

/** Lightweight find-in-page (Ctrl/Cmd+F). Counts matches in the active page and jumps via window.find. */
export function FindBar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [count, setCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open || !q) {
      setCount(0);
      return;
    }
    const text = document.getElementById("jai-page-root")?.textContent?.toLowerCase() ?? "";
    const needle = q.toLowerCase();
    let c = 0;
    let i = 0;
    while (needle && (i = text.indexOf(needle, i)) !== -1) {
      c += 1;
      i += needle.length;
    }
    setCount(c);
  }, [q, open]);

  function jump(forward: boolean) {
    const w = window as WindowWithFind;
    try {
      w.find?.(q, false, !forward, true);
    } catch {
      /* window.find unsupported */
    }
  }

  if (!open) return null;

  return (
    <div className="absolute right-3 top-2 z-50 flex items-center gap-1.5 rounded-full border border-line bg-surface px-2 py-1 shadow-card">
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") jump(!e.shiftKey);
        }}
        placeholder="Find on page"
        aria-label="Find on page"
        className="w-40 bg-transparent px-1 text-sm text-ink placeholder:text-faint focus:outline-none"
      />
      <span className="min-w-[42px] text-center text-xs tabular-nums text-faint">{q ? `${count}` : "0"} found</span>
      <button type="button" onClick={() => jump(false)} aria-label="Previous match" className="grid h-6 w-6 place-items-center rounded-full text-faint hover:bg-ink/5 hover:text-ink">
        <ChevronUp className="h-3.5 w-3.5" />
      </button>
      <button type="button" onClick={() => jump(true)} aria-label="Next match" className="grid h-6 w-6 place-items-center rounded-full text-faint hover:bg-ink/5 hover:text-ink">
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      <button type="button" onClick={() => setOpen(false)} aria-label="Close find" className="grid h-6 w-6 place-items-center rounded-full text-faint hover:bg-ink/5 hover:text-ink">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
