"use client";

import { useMemo } from "react";
import { Check, Trash2 } from "lucide-react";
import { useLocalStorage } from "@jaios/kernel/hooks/use-local-storage";

export function NotepadApp() {
  const [text, setText] = useLocalStorage("jaios-notepad", "");

  const { words, chars } = useMemo(() => {
    const trimmed = text.trim();
    return {
      words: trimmed ? trimmed.split(/\s+/).length : 0,
      chars: text.length,
    };
  }, [text]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="flex items-center gap-1.5 text-xs text-faint">
          <Check className="h-3.5 w-3.5 text-mint" aria-hidden />
          Saved automatically
        </span>
        <button
          type="button"
          onClick={() => setText("")}
          disabled={text.length === 0}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted transition-colors hover:bg-ink/5 hover:text-ink disabled:cursor-default disabled:opacity-40"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
          Clear
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck
        placeholder="Start typing… your notes stay on this device."
        className="flex-1 resize-none bg-transparent px-5 py-4 font-mono text-sm leading-relaxed text-ink placeholder:text-faint focus:outline-none"
      />

      <div className="flex items-center justify-end gap-4 border-t border-line px-4 py-1.5 text-[11px] tabular-nums text-faint">
        <span>{words} words</span>
        <span>{chars} characters</span>
      </div>
    </div>
  );
}
