"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { hostOf } from "@jaios/kernel/lib/url";
import { useBrowserStore } from "@jaios/kernel/browser-store";

/** Renders an external site inside a sandboxed iframe (device framing added later). */
export function ExternalPage({ url }: { url: string }) {
  const reloadKey = useBrowserStore((s) => s.reloadKey);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 8000);
    return () => clearTimeout(t);
  }, [url, reloadKey]);

  return (
    <div className="relative h-full w-full">
      <iframe
        key={`${url}-${reloadKey}`}
        src={url}
        title={hostOf(url)}
        onLoad={() => setLoading(false)}
        className="h-full w-full border-0 bg-white"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
        referrerPolicy="no-referrer-when-downgrade"
        loading="lazy"
      />
      {loading && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-surface/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted shadow-soft">
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
            Loading {hostOf(url)}…
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
