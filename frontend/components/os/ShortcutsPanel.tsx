"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import {
  displayKeys,
  filterShortcuts,
  groupShortcuts,
  isMacPlatform,
} from "@/data/shortcuts";
import { useOSStore } from "@/store/os-store";
import { cn } from "@/lib/utils";

export function ShortcutsPanel() {
  const open = useOSStore((s) => s.helpOpen);
  const setOpen = useOSStore((s) => s.setHelpOpen);
  const [query, setQuery] = useState("");
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(isMacPlatform());
  }, []);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const filtered = useMemo(() => filterShortcuts(query), [query]);
  const groups = useMemo(() => groupShortcuts(filtered), [filtered]);
  const modLabel = isMac ? "⌘" : "Ctrl";

  return (
    <Modal open={open} onClose={() => setOpen(false)} label="Keyboard shortcuts">
      <div className="flex max-h-[min(80vh,36rem)] flex-col p-6 sm:p-8">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">Keyboard shortcuts</h2>
          <p className="mt-1 text-sm text-muted">
            {isMac ? "⌘" : "Ctrl"} shortcuts work when no text field is focused.
          </p>
        </div>

        <label className="relative mt-5 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shortcuts…"
            aria-label="Search shortcuts"
            className="w-full rounded-xl border border-line bg-surface-2 py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-faint focus:border-line-strong focus:outline-none"
          />
        </label>

        <div className="mt-5 min-h-0 flex-1 overflow-y-auto">
          {groups.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No shortcuts match &ldquo;{query}&rdquo;.</p>
          ) : (
            <div className="space-y-6">
              {groups.map((g) => (
                <section key={g.category}>
                  <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
                    {g.category}
                  </h3>
                  <ul className="divide-y divide-line rounded-2xl border border-line bg-surface shadow-soft">
                    {g.items.map((s) => {
                      const keys = displayKeys(s.keys, isMac);
                      const isSinglePhrase = keys.length === 1 && keys[0].includes(" ");
                      return (
                        <li key={s.id} className="flex items-center justify-between gap-4 px-4 py-3">
                          <span className="text-sm text-ink">{s.label}</span>
                          {isSinglePhrase ? (
                            <kbd className="shrink-0 rounded-lg border border-line bg-surface-2 px-2 py-1 font-mono text-[11px] font-medium text-muted shadow-soft">
                              {keys[0]}
                            </kbd>
                          ) : (
                            <span className="flex shrink-0 items-center gap-1">
                              {keys.map((k) => (
                                <kbd
                                  key={k}
                                  className={cn(
                                    "inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg border border-line bg-surface-2 px-2 font-mono text-xs font-medium text-muted shadow-soft",
                                    k === modLabel && "min-w-[2rem]",
                                  )}
                                >
                                  {k}
                                </kbd>
                              ))}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>

        <p className="mt-4 text-[11px] text-faint">
          {filtered.length} of {18} shortcuts
          {query ? ` matching “${query}”` : ""}.
          App Switcher may be blocked by the browser on {modLabel}+Tab.
        </p>
      </div>
    </Modal>
  );
}
