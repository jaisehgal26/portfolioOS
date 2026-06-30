"use client";

import { useEffect, useState } from "react";
import { Cookie, Database, FileJson, Server } from "lucide-react";
import { JsonView } from "./JsonView";

const KEYS = ["jaios-prefs", "jaios-browser", "jaios-browser-bookmarks", "jaios-browser-history", "jaios-session"];

const MANIFEST = { name: "Jai Sehgal — Frontend Developer", short_name: "JaiOS", display: "standalone", theme_color: "#FAF7F2" };

export function ApplicationPanel() {
  const [data, setData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const d: Record<string, unknown> = {};
    for (const k of KEYS) {
      const raw = window.localStorage.getItem(k);
      if (raw === null) continue;
      try {
        d[k] = JSON.parse(raw);
      } catch {
        d[k] = raw;
      }
    }
    setData(d);
  }, []);

  return (
    <div className="h-full overflow-auto px-3 py-2 text-xs">
      <Section icon={<Database className="h-3.5 w-3.5" />} title="Local Storage">
        {Object.keys(data).length === 0 ? (
          <p className="text-faint">No keys stored yet.</p>
        ) : (
          <div className="space-y-1.5 font-mono">
            {Object.entries(data).map(([k, v]) => (
              <div key={k} className="rounded-lg border border-line bg-surface p-2">
                <p className="text-accent">{k}</p>
                <div className="mt-1">
                  <JsonView value={v} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section icon={<Server className="h-3.5 w-3.5" />} title="Service Workers">
        <p className="text-muted">jaios-sw.js — <span className="text-mint">activated and running</span></p>
      </Section>

      <Section icon={<FileJson className="h-3.5 w-3.5" />} title="Manifest">
        <div className="font-mono">
          <JsonView value={MANIFEST} />
        </div>
      </Section>

      <Section icon={<Cookie className="h-3.5 w-3.5" />} title="Cookies">
        <p className="text-faint">No cookies — this site doesn&apos;t track you.</p>
      </Section>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
}
