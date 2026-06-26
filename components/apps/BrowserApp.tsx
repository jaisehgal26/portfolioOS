"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Globe,
  Home,
  Loader2,
  Lock,
  Monitor,
  Plus,
  RotateCw,
  Smartphone,
  Tablet,
} from "lucide-react";
import { useOSStore } from "@/store/os-store";
import { browserSites } from "@/data/sites";
import { cn } from "@/lib/utils";

type Device = "desktop" | "tablet" | "mobile";
const DEVICE_WIDTH: Record<Device, number | null> = { desktop: null, tablet: 768, mobile: 390 };

function normalizeUrl(input: string): string {
  const u = input.trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

function favicon(url: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostOf(url))}&sz=64`;
}

export function BrowserApp() {
  const browserUrl = useOSStore((s) => s.browserUrl);
  const clearBrowserUrl = useOSStore((s) => s.clearBrowserUrl);

  // History: "" represents the bookmarks start page.
  const [history, setHistory] = useState<string[]>([""]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [device, setDevice] = useState<Device>("desktop");
  const inputRef = useRef<HTMLInputElement>(null);

  const current = history[index] ?? "";
  const canBack = index > 0;
  const canForward = index < history.length - 1;

  const navigate = useCallback(
    (raw: string) => {
      const url = normalizeUrl(raw);
      setHistory((h) => [...h.slice(0, index + 1), url]);
      setIndex(index + 1);
    },
    [index],
  );

  // Open a URL requested by another app (store.openUrlInBrowser).
  useEffect(() => {
    if (!browserUrl) return;
    navigate(browserUrl);
    clearBrowserUrl();
  }, [browserUrl, navigate, clearBrowserUrl]);

  // Keep the address bar in sync with the current page.
  useEffect(() => {
    setInput(current);
  }, [current]);

  // Loading indicator with a safety timeout (some sites never fire onLoad).
  useEffect(() => {
    if (!current) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 8000);
    return () => clearTimeout(t);
  }, [current, reloadKey]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) navigate(input);
    inputRef.current?.blur();
  }

  function openExternal() {
    const url = current || normalizeUrl(input);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  const width = DEVICE_WIDTH[device];

  return (
    <div className="flex h-full flex-col bg-surface-2/40">
      {/* Chrome */}
      <div className="flex shrink-0 items-center gap-1.5 border-b border-line bg-surface px-2.5 py-2">
        <div className="flex items-center text-faint">
          <button
            type="button"
            onClick={() => canBack && setIndex((i) => i - 1)}
            disabled={!canBack}
            aria-label="Back"
            className={cn("grid h-8 w-8 place-items-center rounded-full transition-colors", canBack ? "hover:bg-ink/5 hover:text-ink" : "opacity-40")}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => canForward && setIndex((i) => i + 1)}
            disabled={!canForward}
            aria-label="Forward"
            className={cn("grid h-8 w-8 place-items-center rounded-full transition-colors", canForward ? "hover:bg-ink/5 hover:text-ink" : "opacity-40")}
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => (current ? setReloadKey((k) => k + 1) : undefined)}
            aria-label="Reload"
            className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <RotateCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </button>
          <button
            type="button"
            onClick={() => navigate("")}
            aria-label="Home"
            className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <Home className="h-4 w-4" />
          </button>
        </div>

        {/* Address bar */}
        <form onSubmit={onSubmit} className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1.5">
          {current ? <Lock className="h-3.5 w-3.5 shrink-0 text-mint" /> : <Globe className="h-3.5 w-3.5 shrink-0 text-faint" />}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search or enter a project URL…"
            aria-label="Address bar"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
          />
        </form>

        {/* Responsive preview toggle */}
        {current && (
          <div className="hidden items-center rounded-full border border-line bg-surface-2 p-0.5 sm:flex">
            {([
              ["desktop", Monitor],
              ["tablet", Tablet],
              ["mobile", Smartphone],
            ] as const).map(([d, Icon]) => (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                aria-label={`${d} preview`}
                aria-pressed={device === d}
                className={cn("grid h-7 w-7 place-items-center rounded-full transition-colors", device === d ? "bg-ink text-bg" : "text-muted hover:text-ink")}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={openExternal}
          aria-label="Open in new tab"
          title="Open in a new browser tab"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-faint transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      {/* Viewport */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {current ? (
          <div
            className={cn(
              "h-full w-full",
              width ? "flex justify-center overflow-auto bg-surface-2/70 p-4" : "",
            )}
          >
            <div
              className="relative h-full shrink-0"
              style={width ? { width, maxWidth: "100%" } : { width: "100%" }}
            >
              <iframe
                key={`${current}-${reloadKey}-${device}`}
                src={current}
                title="JaiOS browser"
                onLoad={() => setLoading(false)}
                className={cn("h-full w-full border-0 bg-white", width && "rounded-2xl border border-line shadow-card")}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
                referrerPolicy="no-referrer-when-downgrade"
                loading="lazy"
              />
              {loading && (
                <div className="pointer-events-none absolute inset-0 grid place-items-center bg-surface/60 backdrop-blur-sm">
                  <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted shadow-soft">
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    Loading {hostOf(current)}…
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <StartPage onOpen={navigate} />
        )}
      </div>
    </div>
  );
}

function StartPage({ onOpen }: { onOpen: (url: string) => void }) {
  return (
    <div className="h-full overflow-y-auto p-6 sm:p-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue to-violet text-white shadow-card">
          <Globe className="h-7 w-7" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">Browser</h1>
        <p className="mt-1 text-sm text-muted">
          Open live projects right here, or type any URL in the address bar.
        </p>
      </div>

      <div className="mx-auto mt-7 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {browserSites.map((site) => (
          <div
            key={site.id}
            className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 shadow-soft transition-colors hover:border-line-strong"
          >
            <button type="button" onClick={() => onOpen(site.url)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
              <img
                src={favicon(site.url)}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 rounded-lg border border-line bg-surface-2 object-contain p-1"
                loading="lazy"
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink">{site.title}</span>
                <span className="block truncate text-xs text-muted">
                  {site.description ?? hostOf(site.url)}
                </span>
              </span>
            </button>
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${site.title} in a new tab`}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-6 flex max-w-2xl items-center justify-center gap-1.5 text-center text-xs text-faint">
        <Plus className="h-3.5 w-3.5" />
        Add more project links in <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono">data/sites.ts</code>
      </p>
    </div>
  );
}
