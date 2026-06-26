"use client";

import {
  Accessibility,
  Boxes,
  CheckCircle2,
  Gauge,
  GitBranch,
  Layers,
  Radio,
  Smartphone,
  TestTube,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { AppScroll } from "@/components/ui/AppShell";
import { useOSStore } from "@/store/os-store";
import { getApp } from "@/data/apps";
import { cn } from "@/lib/utils";

const health: { label: string; status: string; icon: LucideIcon }[] = [
  { label: "Responsive", status: "Active", icon: Smartphone },
  { label: "Accessible", status: "Checked", icon: Accessibility },
  { label: "Performance-focused", status: "Enabled", icon: Gauge },
  { label: "Component-driven", status: "Enabled", icon: Boxes },
  { label: "Real-time ready", status: "Enabled", icon: Radio },
  { label: "SEO-ready", status: "Enabled", icon: Gauge },
];

const capabilities: { label: string; note: string; icon: LucideIcon }[] = [
  { label: "UI architecture", note: "Composable, typed component systems", icon: Layers },
  { label: "Motion design", note: "Purposeful, reduced-motion aware", icon: Wand2 },
  { label: "State management", note: "Redux, Zustand, React Query", icon: GitBranch },
  { label: "API integration", note: "REST, GraphQL, SSE, WebSockets", icon: Radio },
  { label: "Testing mindset", note: "Jest, RTL — confidence to ship", icon: TestTube },
  { label: "Production deployment", note: "Vercel, Netlify, CI/CD", icon: Gauge },
];

export function SystemMonitorApp() {
  const mode = useOSStore((s) => s.mode);
  const theme = useOSStore((s) => s.theme);
  const windows = useOSStore((s) => s.windows);
  const focusedId = useOSStore((s) => s.focusedId);

  const session = [
    { k: "Mode", v: mode },
    { k: "Theme", v: theme },
    { k: "Open apps", v: String(windows.length) },
    { k: "Active app", v: focusedId ? getApp(focusedId).shortName : "Desktop" },
  ];

  return (
    <AppScroll>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">System Monitor</h1>
        <p className="mt-1 text-sm text-muted">A playful read-out of how this portfolio — and how I build — holds up.</p>
      </div>

      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-faint">Portfolio health</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {health.map((h) => (
          <div key={h.label} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint/12 text-mint">
              <h.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{h.label}</p>
              <p className="inline-flex items-center gap-1 text-xs font-medium text-mint">
                <CheckCircle2 className="h-3 w-3" /> {h.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-faint">Frontend capabilities</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {capabilities.map((c) => (
          <div key={c.label} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 shadow-soft">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
              <c.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{c.label}</p>
              <p className="mt-0.5 text-xs text-muted">{c.note}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-faint">Session</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {session.map((s) => (
          <div key={s.k} className="rounded-2xl border border-line bg-surface p-3.5 shadow-soft">
            <p className="text-xs font-medium uppercase tracking-wider text-faint">{s.k}</p>
            <p className="mt-1 text-sm font-semibold capitalize text-ink">{s.v}</p>
          </div>
        ))}
      </div>
    </AppScroll>
  );
}
