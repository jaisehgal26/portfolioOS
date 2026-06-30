"use client";

import { useEffect, useRef } from "react";
import { PanelBottom, PanelRight, X } from "lucide-react";
import { useBrowserStore, type DevToolsTab } from "@jaios/kernel/browser-store";
import { cn } from "@jaios/ui/utils";
import { ConsolePanel } from "./ConsolePanel";

const TABS: { id: DevToolsTab; label: string }[] = [
  { id: "elements", label: "Elements" },
  { id: "console", label: "Console" },
  { id: "network", label: "Network" },
  { id: "sources", label: "Sources" },
  { id: "application", label: "Application" },
  { id: "lighthouse", label: "Lighthouse" },
];

export function DevTools() {
  const dt = useBrowserStore((s) => s.devtools);
  const toggle = useBrowserStore((s) => s.toggleDevtools);
  const setTab = useBrowserStore((s) => s.setDevtoolsTab);
  const setSide = useBrowserStore((s) => s.setDevtoolsSide);
  const setSize = useBrowserStore((s) => s.setDevtoolsSize);
  const dragRef = useRef<{ startSize: number; start: number } | null>(null);

  // F12 / Cmd-Ctrl+Shift+I toggles DevTools (only mounted in browser mode).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "F12" || ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "i")) {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  if (!dt.open) return null;
  const bottom = dt.side === "bottom";

  function onPointerDown(e: React.PointerEvent) {
    dragRef.current = { startSize: dt.size, start: bottom ? e.clientY : e.clientX };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const delta = bottom ? dragRef.current.start - e.clientY : dragRef.current.start - e.clientX;
    const max = bottom ? window.innerHeight - 140 : window.innerWidth - 220;
    setSize(Math.min(Math.max(180, dragRef.current.startSize + delta), max));
  }
  function onPointerUp(e: React.PointerEvent) {
    dragRef.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className={cn("flex shrink-0 bg-surface", bottom ? "flex-col border-t border-line" : "flex-row border-l border-line")}
      style={bottom ? { height: dt.size } : { width: dt.size }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className={cn("shrink-0 transition-colors hover:bg-accent/30", bottom ? "h-1 cursor-row-resize" : "w-1 cursor-col-resize")}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1 border-b border-line px-2 py-1" role="tablist" aria-label="DevTools panels">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={dt.tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded px-2 py-1 text-xs font-medium transition-colors",
                dt.tab === t.id ? "bg-ink/[0.06] text-ink" : "text-muted hover:text-ink",
              )}
            >
              {t.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSide(bottom ? "right" : "bottom")}
              aria-label="Toggle dock side"
              className="grid h-6 w-6 place-items-center rounded text-faint transition-colors hover:bg-ink/5 hover:text-ink"
            >
              {bottom ? <PanelRight className="h-3.5 w-3.5" /> : <PanelBottom className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={toggle}
              aria-label="Close DevTools"
              className="grid h-6 w-6 place-items-center rounded text-faint transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          {dt.tab === "console" ? (
            <ConsolePanel />
          ) : (
            <div className="grid h-full place-items-center text-xs text-faint">{dt.tab} panel — coming online</div>
          )}
        </div>
      </div>
    </div>
  );
}
