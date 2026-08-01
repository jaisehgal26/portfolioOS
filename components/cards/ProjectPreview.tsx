import { AlertTriangle, Check, Sparkles, Wrench } from "lucide-react";
import type { ProjectPreview as PreviewKind } from "@/data/projects";
import { cn } from "@/lib/utils";

/** Static, frontend-only mini mockups that illustrate each project. */
export function ProjectPreview({ kind }: { kind: PreviewKind }) {
  switch (kind) {
    case "ai-chat":
      return <AiChatPreview />;
    case "payments":
      return <PaymentsPreview />;
    case "chat":
      return <ChatPreview />;
    case "healthcare":
      return <HealthcarePreview />;
    case "inventory":
      return <InventoryPreview />;
    case "portfolio":
      return <PortfolioSitePreview />;
    case "notepad":
      return <NotepadPreview />;
    case "formbuilder":
      return <FormBuilderPreview />;
  }
}

function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-line bg-surface p-3.5 shadow-soft", className)}>
      {children}
    </div>
  );
}

function AiChatPreview() {
  return (
    <Panel className="w-full">
      <div className="mb-2 flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-violet/12 text-violet">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <span className="text-xs font-medium text-muted">Assistant</span>
      </div>
      <div className="space-y-2">
        <div className="rounded-xl border border-violet/20 bg-violet/5 p-2.5">
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-violet">
            <Wrench className="h-3 w-3" /> Calling tool · search_docs()
          </p>
          <div className="h-1.5 w-3/4 rounded-full bg-violet/20" />
        </div>
        <p className="rounded-2xl rounded-tl-md bg-surface-2 px-3 py-2 text-xs leading-relaxed text-ink">
          Here&apos;s a summary of the three options
          <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 rounded-sm bg-violet animate-pulse-dot" />
        </p>
      </div>
    </Panel>
  );
}

function PaymentsPreview() {
  return (
    <Panel className="w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted">Transaction</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-mint/12 px-2 py-0.5 text-[11px] font-semibold text-mint">
          <Check className="h-3 w-3" /> Succeeded
        </span>
      </div>
      <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">$2,480.00</p>
      <div className="mt-3 flex items-center">
        {["Pending", "Processing", "Settled"].map((s, i, arr) => (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-mint/15 text-mint">
                <Check className="h-3 w-3" />
              </span>
              <span className="text-[10px] text-faint">{s}</span>
            </div>
            {i < arr.length - 1 && <span className="mx-1 h-0.5 flex-1 -translate-y-2 rounded-full bg-mint/40" />}
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ChatPreview() {
  return (
    <Panel className="w-full">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex h-2 w-2 rounded-full bg-mint" />
        <span className="text-xs font-medium text-ink">Aanya</span>
        <span className="text-[10px] text-faint">online</span>
      </div>
      <div className="space-y-1.5">
        <p className="w-fit max-w-[80%] rounded-2xl rounded-tl-md bg-surface-2 px-3 py-1.5 text-xs text-ink">
          Did the deploy go through?
        </p>
        <p className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-md bg-blue/12 px-3 py-1.5 text-xs text-ink">
          Yep — live now ✓
        </p>
        <p className="text-right text-[10px] text-faint">Read · 9:41</p>
      </div>
    </Panel>
  );
}

function HealthcarePreview() {
  return (
    <Panel className="w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted">Bed 12 · Live vitals</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber/12 px-2 py-0.5 text-[11px] font-semibold text-amber">
          <AlertTriangle className="h-3 w-3" /> HR high
        </span>
      </div>
      <svg viewBox="0 0 160 40" className="mt-2 h-10 w-full" fill="none" aria-hidden>
        <path
          d="M2 22 L20 22 L26 10 L32 32 L40 22 L70 22 L76 8 L82 34 L90 22 L160 22"
          stroke="rgb(var(--mint))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="grid grid-cols-3 gap-2">
        {[
          { k: "HR", v: "118", c: "text-amber" },
          { k: "SpO₂", v: "98%", c: "text-mint" },
          { k: "BP", v: "120/80", c: "text-ink" },
        ].map((t) => (
          <div key={t.k} className="rounded-lg bg-surface-2 px-2 py-1.5">
            <p className={cn("font-display text-sm font-semibold", t.c)}>{t.v}</p>
            <p className="text-[10px] text-faint">{t.k}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function FormBuilderPreview() {
  return (
    <Panel className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted">Form builder</span>
        <span className="rounded-full bg-violet/12 px-2 py-0.5 text-[10px] font-semibold text-violet">Publish</span>
      </div>
      <div className="flex gap-2">
        <div className="w-1/3 space-y-1 rounded-lg border border-line bg-surface-2 p-1.5">
          <div className="h-1.5 w-full rounded bg-violet/20" />
          <div className="h-1.5 w-4/5 rounded bg-ink/8" />
          <div className="h-1.5 w-3/4 rounded bg-ink/8" />
        </div>
        <div className="flex-1 space-y-1.5 rounded-lg border border-violet/20 bg-violet/5 p-2">
          <div className="h-2 w-2/3 rounded bg-ink/12" />
          <div className="h-6 rounded border border-line bg-surface" />
          <div className="h-2 w-1/2 rounded bg-ink/10" />
          <div className="flex gap-1">
            <div className="h-4 flex-1 rounded border border-line bg-surface" />
            <div className="h-4 flex-1 rounded border border-line bg-surface" />
          </div>
        </div>
      </div>
    </Panel>
  );
}

function NotepadPreview() {
  return (
    <Panel className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted">quickpad.link/abc</span>
        <span className="rounded-full bg-violet/12 px-2 py-0.5 text-[10px] font-semibold text-violet">Live</span>
      </div>
      <div className="space-y-1.5 rounded-xl border border-line bg-surface p-2.5">
        <div className="h-1.5 w-3/4 rounded bg-ink/10" />
        <div className="h-1.5 w-full rounded bg-ink/10" />
        <div className="h-1.5 w-5/6 rounded bg-ink/10" />
        <div className="flex items-center gap-1 pt-1">
          <span className="h-3 w-0.5 animate-pulse rounded bg-violet" />
          <span className="text-[10px] text-faint">2 editing</span>
        </div>
      </div>
    </Panel>
  );
}

function PortfolioSitePreview() {
  return (
    <Panel className="w-full">
      <div className="mb-2 flex items-center gap-1.5 rounded-lg border border-line bg-ink/[0.03] px-2 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-amber" />
        <span className="h-1.5 w-1.5 rounded-full bg-mint" />
        <span className="h-1.5 w-1.5 rounded-full bg-blue" />
        <span className="ml-1 truncate text-[10px] text-faint">portfolio.dev</span>
      </div>
      <div className="space-y-2">
        <div className="h-8 rounded-lg bg-blue/10" />
        <div className="grid grid-cols-2 gap-1.5">
          <div className="h-10 rounded-lg border border-line bg-surface" />
          <div className="h-10 rounded-lg border border-line bg-surface" />
        </div>
      </div>
    </Panel>
  );
}

function InventoryPreview() {
  const rows = [
    { n: "Aurora Lamp", s: "128", ok: true },
    { n: "Linen Throw", s: "6", ok: false },
    { n: "Oak Stool", s: "54", ok: true },
  ];
  return (
    <Panel className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted">Inventory</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber/12 px-2 py-0.5 text-[11px] font-semibold text-amber">
          1 low stock
        </span>
      </div>
      <div className="overflow-hidden rounded-xl border border-line">
        {rows.map((r, i) => (
          <div
            key={r.n}
            className={cn(
              "flex items-center justify-between px-3 py-2 text-xs",
              i > 0 && "border-t border-line",
              !r.ok && "bg-amber/5",
            )}
          >
            <span className="text-ink">{r.n}</span>
            <span className={cn("font-semibold tabular-nums", r.ok ? "text-muted" : "text-amber")}>
              {r.s}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
