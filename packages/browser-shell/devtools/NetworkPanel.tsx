"use client";

import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { useBrowserStore, tabUrl } from "@jaios/kernel/browser-store";
import { isInternalUrl } from "../lib/routes";
import { cn } from "@jaios/ui/utils";
import { buildRequests, type NetRequest } from "./network-data";
import { JsonView } from "./JsonView";

const THROTTLE: Record<string, number> = { "No throttle": 1, "Fast 3G": 3, "Slow 3G": 6 };
const TYPE_COLOR: Record<string, string> = {
  doc: "text-blue",
  xhr: "text-violet",
  js: "text-amber",
  css: "text-mint",
  font: "text-faint",
  img: "text-accent",
};

export function NetworkPanel() {
  const tabs = useBrowserStore((s) => s.tabs);
  const activeTabId = useBrowserStore((s) => s.activeTabId);
  const reloadKey = useBrowserStore((s) => s.reloadKey);
  const tab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  const url = tab ? tabUrl(tab) : "jai://home";

  const [throttle, setThrottle] = useState("No throttle");
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<number | null>(null);
  const [cleared, setCleared] = useState(0);

  const requests = useMemo(() => (isInternalUrl(url) ? buildRequests(url) : []), [url, reloadKey, cleared]);
  const factor = THROTTLE[throttle];
  const scaled = requests.map((r) => ({ ...r, ms: Math.round(r.ms * factor) }));
  const filtered = filter === "all" ? scaled : scaled.filter((r) => r.type === filter);
  const maxMs = Math.max(1, ...scaled.map((r) => r.ms));
  const totalKb = scaled.reduce((s, r) => s + r.sizeKb, 0);

  if (!isInternalUrl(url)) {
    return (
      <div className="grid h-full place-items-center px-6 text-center text-xs text-faint">
        <p>This is a cross-origin frame. Its network activity can&apos;t be inspected from here.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col text-xs">
      <div className="flex items-center gap-2 border-b border-line px-2 py-1 text-faint">
        <button type="button" onClick={() => { setCleared((c) => c + 1); setSelected(null); }} aria-label="Clear network log" className="grid h-6 w-6 place-items-center rounded hover:bg-ink/5 hover:text-ink">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by type" className="rounded border border-line bg-surface px-1.5 py-0.5 text-ink">
          {["all", "doc", "xhr", "js", "css", "font", "img"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={throttle} onChange={(e) => setThrottle(e.target.value)} aria-label="Throttle" className="rounded border border-line bg-surface px-1.5 py-0.5 text-ink">
          {Object.keys(THROTTLE).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <span className="ml-auto tabular-nums">{scaled.length} requests · {totalKb.toFixed(1)} kB</span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full table-fixed border-collapse">
          <thead className="sticky top-0 bg-surface text-left text-faint">
            <tr className="border-b border-line">
              <th className="w-[34%] px-2 py-1 font-medium">Name</th>
              <th className="w-[10%] px-2 py-1 font-medium">Status</th>
              <th className="w-[10%] px-2 py-1 font-medium">Type</th>
              <th className="w-[12%] px-2 py-1 font-medium">Size</th>
              <th className="w-[10%] px-2 py-1 font-medium">Time</th>
              <th className="w-[24%] px-2 py-1 font-medium">Waterfall</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => {
              const idx = scaled.indexOf(r);
              return (
                <tr
                  key={`${r.name}-${i}`}
                  onClick={() => setSelected(idx === selected ? null : idx)}
                  className={cn("cursor-default border-b border-line/40 hover:bg-ink/[0.03]", selected === idx && "bg-ink/[0.05]")}
                >
                  <td className="truncate px-2 py-1 text-ink">{r.name}</td>
                  <td className={cn("px-2 py-1 tabular-nums", r.status === 200 ? "text-mint" : "text-danger")}>{r.status}</td>
                  <td className={cn("px-2 py-1", TYPE_COLOR[r.type])}>{r.type}</td>
                  <td className="px-2 py-1 tabular-nums text-muted">{r.sizeKb.toFixed(1)} kB</td>
                  <td className="px-2 py-1 tabular-nums text-muted">{r.ms} ms</td>
                  <td className="px-2 py-1">
                    <span className="block h-2 rounded-full bg-accent/70" style={{ width: `${Math.max(6, (r.ms / maxMs) * 100)}%` }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected !== null && scaled[selected] && <Details req={scaled[selected]} onClose={() => setSelected(null)} />}
    </div>
  );
}

function Details({ req, onClose }: { req: NetRequest; onClose: () => void }) {
  const [tab, setTab] = useState<"headers" | "preview" | "timing">(req.response ? "preview" : "headers");
  return (
    <div className="max-h-[45%] shrink-0 overflow-auto border-t border-line bg-bg">
      <div className="flex items-center gap-1 border-b border-line px-2 py-1">
        {(["headers", "preview", "timing"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={cn("rounded px-2 py-0.5 text-xs capitalize", tab === t ? "bg-ink/[0.06] text-ink" : "text-muted hover:text-ink")}>
            {t}
          </button>
        ))}
        <button type="button" onClick={onClose} className="ml-auto text-xs text-faint hover:text-ink">close</button>
      </div>
      <div className="px-3 py-2 font-mono text-[11px] leading-relaxed">
        {tab === "headers" && (
          <div className="space-y-0.5 text-muted">
            <p><span className="text-faint">Request URL:</span> {req.name}</p>
            <p><span className="text-faint">Request Method:</span> GET</p>
            <p><span className="text-faint">Status Code:</span> <span className={req.status === 200 ? "text-mint" : "text-danger"}>{req.status}</span></p>
            <p><span className="text-faint">Content-Type:</span> {req.type === "xhr" ? "application/json" : req.type === "doc" ? "text/html" : req.type}</p>
            <p><span className="text-faint">Cache-Control:</span> public, max-age=31536000</p>
            <p><span className="text-faint">Server:</span> Vercel</p>
          </div>
        )}
        {tab === "preview" && (
          req.response !== undefined ? <JsonView value={req.response} /> : <p className="text-faint">No response body.</p>
        )}
        {tab === "timing" && (
          <div className="space-y-0.5 text-muted">
            <p>Queued: 0 ms</p>
            <p>DNS lookup: {Math.round(req.ms * 0.1)} ms</p>
            <p>Initial connection: {Math.round(req.ms * 0.2)} ms</p>
            <p>TTFB: {Math.round(req.ms * 0.4)} ms</p>
            <p>Content download: {Math.round(req.ms * 0.3)} ms</p>
            <p className="text-ink">Total: {req.ms} ms</p>
          </div>
        )}
      </div>
    </div>
  );
}
