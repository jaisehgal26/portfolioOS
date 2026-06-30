"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Check, Heart, X } from "lucide-react";
import { AppScroll } from "@jaios/ui/AppShell";
import { StateDemo } from "@/components/cards/StateCard";
import { useOSStore } from "@jaios/kernel/store";
import { usePrefersReducedMotion } from "@jaios/kernel/hooks/use-reduced-motion";
import { cn } from "@jaios/ui/utils";

function Lab({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-5 shadow-soft">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <div className="mt-4 flex min-h-[7rem] items-center justify-center rounded-2xl border border-line bg-surface-2/50 p-4">
        {children}
      </div>
    </div>
  );
}

function ButtonLab() {
  const [count, setCount] = useState(0);
  const reduced = usePrefersReducedMotion();
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        type="button"
        whileTap={reduced ? undefined : { scale: 0.94 }}
        onClick={() => setCount((c) => c + 1)}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg"
      >
        <Heart className="h-4 w-4" /> Tap me
      </motion.button>
      <span className="text-xs text-muted">{count} interactions</span>
    </div>
  );
}

function NotificationLab() {
  const pushToast = useOSStore((s) => s.pushToast);
  return (
    <button
      type="button"
      onClick={() => pushToast("Here's a toast notification")}
      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink shadow-soft transition-transform hover:-translate-y-0.5"
    >
      <Bell className="h-4 w-4 text-accent" /> Trigger toast
    </button>
  );
}

function ValidationLab() {
  const [email, setEmail] = useState("");
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const show = email.length > 0;
  return (
    <div className="w-full max-w-xs">
      <div
        className={cn(
          "flex items-center justify-between rounded-xl border bg-surface px-3 py-2 transition-colors",
          !show ? "border-line" : valid ? "border-mint/50" : "border-danger/50",
        )}
      >
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          aria-label="Email"
          className="w-full bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
        />
        {show && (valid ? <Check className="h-4 w-4 text-mint" /> : <X className="h-4 w-4 text-danger" />)}
      </div>
      <p className={cn("mt-1.5 text-xs", !show ? "text-faint" : valid ? "text-mint" : "text-danger")}>
        {!show ? "Type to validate in real time" : valid ? "Looks good" : "Enter a valid email"}
      </p>
    </div>
  );
}

function CardPlaygroundLab() {
  const [wide, setWide] = useState(false);
  const reduced = usePrefersReducedMotion();
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <motion.div
        layout={!reduced}
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-soft",
          wide ? "w-full" : "w-40",
        )}
      >
        <span className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-blue to-violet" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">Aurora Lamp</p>
          {wide && <p className="truncate text-xs text-muted">Responsive layout shift</p>}
        </div>
      </motion.div>
      <button
        type="button"
        onClick={() => setWide((w) => !w)}
        className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted hover:text-ink"
      >
        Toggle layout
      </button>
    </div>
  );
}

export function ExperimentsApp() {
  return (
    <AppScroll>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Experiments</h1>
        <p className="mt-1 text-sm text-muted">Small interactive frontend ideas — playgrounds for craft.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Lab title="Button interaction lab">
          <ButtonLab />
        </Lab>
        <Lab title="Notification demo">
          <NotificationLab />
        </Lab>
        <Lab title="Live form validation">
          <ValidationLab />
        </Lab>
        <Lab title="Responsive card playground">
          <CardPlaygroundLab />
        </Lab>
        <Lab title="Payment status demo">
          <StateDemo kind="payment" />
        </Lab>
        <Lab title="Table empty state">
          <StateDemo kind="table-empty" />
        </Lab>
        <Lab title="Mini chat UI">
          <StateDemo kind="typing" />
        </Lab>
        <Lab title="Notification state">
          <StateDemo kind="notification" />
        </Lab>
        <Lab title="Reconnecting state">
          <StateDemo kind="reconnecting" />
        </Lab>
      </div>
    </AppScroll>
  );
}
