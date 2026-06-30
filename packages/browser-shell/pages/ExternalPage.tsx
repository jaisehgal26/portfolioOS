"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { favicon, hostOf } from "@jaios/kernel/lib/url";
import { CopyButton } from "@jaios/ui/CopyButton";
import { useBrowserStore } from "@jaios/kernel/browser-store";

/**
 * Hosts that send X-Frame-Options / CSP frame-ancestors and refuse to be
 * embedded. We show a friendly interstitial for these instead of a blank frame.
 */
const BLOCKED = [
  "github.com",
  "linkedin.com",
  "x.com",
  "twitter.com",
  "google.com",
  "facebook.com",
  "instagram.com",
  "youtube.com",
  "figma.com",
  "notion.so",
];

function isBlockedHost(host: string): boolean {
  const h = host.toLowerCase().replace(/^www\./, "");
  return BLOCKED.some((b) => h === b || h.endsWith(`.${b}`));
}

export function ExternalPage({ url }: { url: string }) {
  const reloadKey = useBrowserStore((s) => s.reloadKey);
  const host = hostOf(url);
  const blocked = isBlockedHost(host);

  const [loading, setLoading] = useState(true);
  // If a frame never fires onLoad it's almost certainly being blocked.
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (blocked) return;
    setLoading(true);
    setTimedOut(false);
    const done = setTimeout(() => setLoading(false), 8000);
    const guard = setTimeout(() => setTimedOut(true), 4000);
    return () => {
      clearTimeout(done);
      clearTimeout(guard);
    };
  }, [url, reloadKey, blocked]);

  if (blocked || timedOut) {
    return <Interstitial url={url} host={host} />;
  }

  return (
    <div className="relative h-full w-full">
      <iframe
        key={`${url}-${reloadKey}`}
        src={url}
        title={host}
        onLoad={() => {
          setLoading(false);
          setTimedOut(false);
        }}
        className="h-full w-full border-0 bg-white"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
        referrerPolicy="no-referrer-when-downgrade"
        loading="lazy"
      />
      {loading && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-surface/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted shadow-soft">
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
            Loading {host}…
          </div>
        </div>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/90 px-3 py-1.5 text-xs font-medium text-muted shadow-soft backdrop-blur transition-colors hover:text-ink"
      >
        <ExternalLink className="h-3.5 w-3.5" /> Open in real tab
      </a>
    </div>
  );
}

function Interstitial({ url, host }: { url: string; host: string }) {
  return (
    <div className="grid h-full place-items-center bg-surface-2/40 px-6 py-12 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-line bg-surface shadow-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={favicon(url)} alt="" width={32} height={32} className="h-8 w-8 rounded" />
        </span>

        <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink">{host}</h1>

        <div className="mt-6 flex items-center justify-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
          >
            <ExternalLink className="h-4 w-4" /> Open {host}
          </a>
          <CopyButton value={url} label="Copy link" toast="Link copied" />
        </div>
      </div>
    </div>
  );
}
