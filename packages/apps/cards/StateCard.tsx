import {
  AlertTriangle,
  Ban,
  Bell,
  Check,
  CreditCard,
  Inbox,
  Lock,
  Plus,
  RotateCw,
  Search,
  Siren,
  WifiOff,
  XCircle,
} from "lucide-react";
import type { StateKind, UIStateItem } from "../data/ui-states";
import { Card } from "@jaios/ui/Card";

/** Renders the small live demo for a given UI state. Used in Experiments. */
export function StateDemo({ kind }: { kind: StateKind }) {
  switch (kind) {
    case "empty":
      return (
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-faint">
            <Inbox className="h-4 w-4" />
          </span>
          <p className="text-xs text-muted">No projects yet</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium text-bg">
            <Plus className="h-3 w-3" /> New
          </span>
        </div>
      );
    case "loading":
      return (
        <div className="w-full space-y-2">
          <div className="h-2.5 w-1/3 rounded-full bg-surface-2 animate-pulse" />
          <div className="h-2.5 w-full rounded-full bg-surface-2 animate-pulse" />
          <div className="h-2.5 w-4/5 rounded-full bg-surface-2 animate-pulse" />
          <div className="h-2.5 w-2/3 rounded-full bg-surface-2 animate-pulse" />
        </div>
      );
    case "streaming":
      return (
        <p className="text-xs leading-relaxed text-ink">
          Generating your summary
          <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 rounded-sm bg-violet animate-pulse-dot" />
        </p>
      );
    case "success":
      return (
        <div className="flex flex-col items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-mint/12 text-mint">
            <Check className="h-5 w-5" />
          </span>
          <p className="text-xs font-medium text-ink">Changes saved</p>
        </div>
      );
    case "error":
      return (
        <div className="flex items-center gap-2.5 rounded-xl border border-danger/30 bg-danger/8 px-3 py-2.5">
          <AlertTriangle className="h-4 w-4 shrink-0 text-danger" />
          <p className="text-xs text-ink">Couldn&apos;t load transactions.</p>
        </div>
      );
    case "retry":
      return (
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xs text-muted">Request timed out.</p>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-medium text-ink shadow-soft">
            <RotateCw className="h-3 w-3" /> Try again
          </span>
        </div>
      );
    case "offline":
      return (
        <div className="flex items-center gap-2.5 rounded-xl border border-amber/30 bg-amber/8 px-3 py-2.5">
          <WifiOff className="h-4 w-4 shrink-0 text-amber" />
          <p className="text-xs text-ink">Offline — we&apos;ll sync when you&apos;re back.</p>
        </div>
      );
    case "permission":
      return (
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-faint">
            <Lock className="h-4 w-4" />
          </span>
          <p className="text-xs text-muted">You don&apos;t have access to billing.</p>
        </div>
      );
    case "validation":
      return (
        <div className="w-full">
          <div className="flex items-center justify-between rounded-xl border border-danger/40 bg-danger/5 px-3 py-2">
            <span className="text-xs text-ink">jai@</span>
            <AlertTriangle className="h-3.5 w-3.5 text-danger" />
          </div>
          <p className="mt-1.5 text-[11px] text-danger">Enter a valid email address.</p>
        </div>
      );
    case "notification":
      return (
        <div className="flex w-full items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5 shadow-soft">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-blue/12 text-blue">
            <Bell className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-ink">New message</p>
            <p className="truncate text-[11px] text-muted">Aanya sent you a file</p>
          </div>
        </div>
      );
    case "payment":
      return (
        <div className="w-full rounded-xl border border-line bg-surface px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-amber/12 text-amber">
              <CreditCard className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-ink">Processing payment</p>
              <p className="text-[11px] text-muted">Hang tight — confirming with your bank.</p>
            </div>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-2">
            <div className="h-full w-1/3 rounded-full bg-amber/70 animate-pulse-dot" />
          </div>
        </div>
      );
    case "typing":
      return (
        <div className="flex flex-col gap-1.5">
          <span className="w-fit rounded-2xl rounded-tl-md bg-surface-2 px-3 py-2">
            <span className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-faint animate-typing-dot"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          </span>
          <span className="text-[11px] text-faint">Aanya is typing…</span>
        </div>
      );
    case "reconnecting":
      return (
        <div className="flex items-center gap-2.5 rounded-xl border border-amber/30 bg-amber/8 px-3 py-2.5">
          <RotateCw className="h-4 w-4 shrink-0 animate-spin text-amber" />
          <p className="text-xs text-ink">Reconnecting — attempt 2 of 3…</p>
        </div>
      );
    case "table-empty":
      return (
        <div className="w-full overflow-hidden rounded-xl border border-line">
          <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-faint">
            <span className="flex-1">Name</span>
            <span>Status</span>
          </div>
          <div className="flex flex-col items-center gap-1 px-3 py-4 text-center">
            <Search className="h-4 w-4 text-faint" />
            <p className="text-xs text-muted">No results match your filters</p>
          </div>
        </div>
      );
    case "dashboard-alert":
      return (
        <div className="flex w-full items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/8 px-3 py-2.5">
          <Siren className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          <div>
            <p className="text-xs font-semibold text-ink">Bed 12 · HR above threshold</p>
            <p className="text-[11px] text-muted">128 bpm — review recommended</p>
          </div>
        </div>
      );
    case "payment-failed":
      return (
        <div className="w-full rounded-xl border border-danger/30 bg-danger/8 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 shrink-0 text-danger" />
            <p className="text-xs font-medium text-ink">Payment declined</p>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] font-medium text-ink">
              <RotateCw className="h-3 w-3" /> Retry
            </span>
          </div>
        </div>
      );
    case "disabled":
      return (
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-surface-2 px-4 py-2 text-sm font-medium text-faint">
            <Ban className="h-4 w-4" /> Publish
          </span>
          <p className="text-[11px] text-faint">Add a title to enable</p>
        </div>
      );
    case "optimistic":
      return (
        <div className="flex flex-col items-end gap-1">
          <span className="w-fit rounded-2xl rounded-tr-md bg-blue/12 px-3 py-1.5 text-xs text-ink">Shipped it ✨</span>
          <span className="flex items-center gap-1 text-[11px] text-faint">
            <Check className="h-3 w-3" /> Sent · syncing
          </span>
        </div>
      );
  }
}

export function StateCard({ item }: { item: UIStateItem }) {
  return (
    <Card interactive className="flex h-full flex-col p-5">
      <div className="flex min-h-[6.5rem] flex-1 items-center justify-center rounded-2xl border border-line bg-surface-2/50 p-4">
        <StateDemo kind={item.kind} />
      </div>
      <div className="mt-4">
        <p className="text-sm font-semibold text-ink">{item.label}</p>
        <p className="mt-0.5 text-xs text-muted">{item.caption}</p>
        <p className="mt-1.5 text-[11px] leading-snug text-faint">
          <span className="font-medium">Used in:</span> {item.usedIn}
        </p>
      </div>
    </Card>
  );
}
