"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = "json" | "base64";

function formatJson(raw: string): { out: string; err?: string } {
  try {
    return { out: JSON.stringify(JSON.parse(raw), null, 2) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid JSON";
    return { out: raw, err: msg };
  }
}

function minifyJson(raw: string): { out: string; err?: string } {
  try {
    return { out: JSON.stringify(JSON.parse(raw)) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid JSON";
    return { out: raw, err: msg };
  }
}

function encodeBase64(text: string): { out: string; err?: string } {
  try {
    const bytes = new TextEncoder().encode(text);
    let bin = "";
    for (const b of bytes) bin += String.fromCharCode(b);
    return { out: btoa(bin) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Encode failed";
    return { out: "", err: msg };
  }
}

function decodeBase64(text: string): { out: string; err?: string } {
  try {
    const bin = atob(text.trim());
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return { out: new TextDecoder().decode(bytes) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Decode failed";
    return { out: "", err: msg };
  }
}

export function DevToolsApp() {
  const [tab, setTab] = useState<Tab>("json");
  const [jsonIn, setJsonIn] = useState('{\n  "hello": "world"\n}');
  const [jsonOut, setJsonOut] = useState("");
  const [jsonErr, setJsonErr] = useState<string | null>(null);
  const [b64In, setB64In] = useState("Hello, JaiOS!");
  const [b64Out, setB64Out] = useState("");
  const [b64Err, setB64Err] = useState<string | null>(null);

  function runJson(mode: "format" | "minify" | "validate") {
    if (mode === "validate") {
      const { err } = formatJson(jsonIn);
      setJsonErr(err ?? null);
      setJsonOut(err ? "" : "Valid JSON ✓");
      return;
    }
    const { out, err } = mode === "format" ? formatJson(jsonIn) : minifyJson(jsonIn);
    setJsonErr(err ?? null);
    setJsonOut(err ? "" : out);
    if (!err) setJsonIn(out);
  }

  function runB64(mode: "encode" | "decode") {
    const { out, err } = mode === "encode" ? encodeBase64(b64In) : decodeBase64(b64In);
    setB64Err(err ?? null);
    setB64Out(err ? "" : out);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-1 border-b border-line px-3 py-2">
        {(["json", "base64"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium uppercase transition-colors",
              tab === t ? "bg-ink/5 text-ink" : "text-muted hover:text-ink",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        {tab === "json" ? (
          <>
            <textarea
              value={jsonIn}
              onChange={(e) => setJsonIn(e.target.value)}
              spellCheck={false}
              className="min-h-[180px] flex-1 resize-none rounded-xl border border-line bg-surface-2 p-3 font-mono text-xs text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="Paste JSON…"
            />
            <div className="flex flex-wrap gap-2">
              {(["format", "minify", "validate"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => runJson(m)}
                  className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold capitalize text-bg hover:opacity-90"
                >
                  {m}
                </button>
              ))}
            </div>
            {jsonErr && <p className="text-xs text-accent">{jsonErr}</p>}
            {jsonOut && !jsonErr && <p className="text-xs text-mint">{jsonOut}</p>}
          </>
        ) : (
          <>
            <textarea
              value={b64In}
              onChange={(e) => setB64In(e.target.value)}
              spellCheck={false}
              className="min-h-[120px] flex-1 resize-none rounded-xl border border-line bg-surface-2 p-3 font-mono text-xs text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="Text or Base64…"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => runB64("encode")}
                className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-bg hover:opacity-90"
              >
                Encode
              </button>
              <button
                type="button"
                onClick={() => runB64("decode")}
                className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ink/5"
              >
                Decode
              </button>
            </div>
            {b64Err && <p className="text-xs text-accent">{b64Err}</p>}
            {b64Out && !b64Err && (
              <pre className="max-h-32 overflow-auto rounded-xl border border-line bg-surface-2 p-3 font-mono text-xs text-ink">
                {b64Out}
              </pre>
            )}
          </>
        )}
      </div>
    </div>
  );
}
