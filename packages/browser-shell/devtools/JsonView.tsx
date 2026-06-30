"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@jaios/ui/utils";

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function Primitive({ value }: { value: unknown }) {
  if (typeof value === "string") return <span className="text-mint">&quot;{value}&quot;</span>;
  if (typeof value === "number") return <span className="text-blue">{value}</span>;
  if (typeof value === "boolean") return <span className="text-violet">{String(value)}</span>;
  if (value === null) return <span className="text-faint">null</span>;
  if (value === undefined) return <span className="text-faint">undefined</span>;
  return <span className="text-ink">{String(value)}</span>;
}

export function JsonView({ value, k, depth = 0 }: { value: unknown; k?: string; depth?: number }) {
  const [open, setOpen] = useState(false);
  const expandable = Array.isArray(value) || isObj(value);

  if (!expandable) {
    return (
      <div className="leading-relaxed">
        {k !== undefined && <span className="text-ink/70">{k}: </span>}
        <Primitive value={value} />
      </div>
    );
  }

  const entries = Array.isArray(value)
    ? value.map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>);
  const preview = Array.isArray(value) ? `Array(${value.length})` : `{${entries.length}}`;

  return (
    <div className="leading-relaxed">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-left hover:text-ink"
      >
        <ChevronRight className={cn("h-3 w-3 shrink-0 text-faint transition-transform", open && "rotate-90")} />
        {k !== undefined && <span className="text-ink/70">{k}: </span>}
        <span className="text-faint">{preview}</span>
      </button>
      {open && (
        <div className="ml-3 border-l border-line pl-3">
          {entries.map(([key, v]) => (
            <JsonView key={key} k={key} value={v} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
