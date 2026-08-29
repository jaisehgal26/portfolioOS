"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { links } from "@/data/profile";
import { cn } from "@/lib/utils";

const CALENDLY_URL = "https://calendly.com/sehgaljai81/30min";

const PRESETS = [
  { label: "Resume", url: links.resume.startsWith("http") ? links.resume : `${links.portfolio}${links.resume}` },
  { label: "GitHub", url: links.github },
  { label: "LinkedIn", url: links.linkedin },
  { label: "Portfolio", url: links.portfolio },
  { label: "Calendly", url: CALENDLY_URL },
] as const;

export function QrApp() {
  const [url, setUrl] = useState<string>(PRESETS[3].url);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    QRCode.toDataURL(url, { width: 240, margin: 2, color: { dark: "#1a1612", light: "#faf8f5" } })
      .then((d) => {
        if (!cancelled) setDataUrl(d);
      })
      .catch((e) => {
        if (!cancelled) {
          setDataUrl(null);
          setError(e instanceof Error ? e.message : "Could not generate QR");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div className="flex h-full flex-col items-center gap-4 p-5">
      <div className="flex w-full flex-wrap justify-center gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setUrl(p.url)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              url === p.url ? "bg-ink text-bg" : "border border-line text-muted hover:bg-ink/5 hover:text-ink",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
        placeholder="https://…"
      />

      <div className="grid h-[260px] w-[260px] place-items-center rounded-2xl border border-line bg-surface shadow-soft">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt="QR code" className="h-[240px] w-[240px]" />
        ) : error ? (
          <p className="px-4 text-center text-xs text-accent">{error}</p>
        ) : (
          <div className="h-[240px] w-[240px] animate-pulse rounded-xl bg-ink/5" />
        )}
      </div>
    </div>
  );
}
