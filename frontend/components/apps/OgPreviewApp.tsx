"use client";

import { useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { useOSStore } from "@/store/os-store";
import { cn } from "@/lib/utils";

interface OgResult {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  card: string | null;
}

export function OgPreviewApp() {
  const tryUnlock = useOSStore((s) => s.tryUnlock);
  const [input, setInput] = useState("https://jaisehgal.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OgResult | null>(null);

  async function preview() {
    const url = input.trim();
    if (!url) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/og-preview?url=${encodeURIComponent(url)}`);
      const data = (await res.json()) as OgResult & { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Preview failed");
        return;
      }
      setResult(data);
      tryUnlock("og-inspector");
    } catch {
      setError("Network error — try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <p className="text-sm text-muted">Paste a public URL to see how link previews render.</p>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && preview()}
          className="min-w-0 flex-1 rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
          placeholder="https://example.com"
        />
        <button
          type="button"
          onClick={preview}
          disabled={loading}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-bg hover:opacity-90 disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Preview
        </button>
      </div>

      {error && <p className="text-sm text-accent">{error}</p>}

      {result && (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
          {result.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={result.image} alt="" className="h-40 w-full object-cover" />
          )}
          <div className="space-y-1.5 p-4">
            <p className="line-clamp-2 font-semibold text-ink">{result.title ?? "No title"}</p>
            {result.description && <p className="line-clamp-3 text-sm text-muted">{result.description}</p>}
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("inline-flex items-center gap-1 text-xs text-accent hover:underline")}
            >
              {new URL(result.url).hostname}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
