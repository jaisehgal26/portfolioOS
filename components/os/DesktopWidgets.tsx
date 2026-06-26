"use client";

import { motion } from "framer-motion";
import { useOSStore } from "@/store/os-store";
import { profile, links } from "@/data/profile";
import { CopyButton } from "@/components/ui/CopyButton";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useCurrentTime } from "@/hooks/use-current-time";
import { Monogram } from "./Monogram";
import { WatchDial } from "./WatchDial";
import { cn } from "@/lib/utils";

function Widget({ className, children, delay = 0 }: { className?: string; children: React.ReactNode; delay?: number }) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("glass rounded-2xl p-4 shadow-soft", className)}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-faint">{children}</p>
  );
}

export function DesktopWidgets() {
  const openApp = useOSStore((s) => s.openApp);
  const now = useCurrentTime();

  const weekday = now ? now.toLocaleDateString([], { weekday: "long" }) : "";
  const month = now ? now.toLocaleDateString([], { month: "long" }) : "";

  return (
    <div className="flex w-64 flex-col gap-3">
      <Widget delay={0.04}>
        <div className="flex flex-col items-center gap-3 py-1" suppressHydrationWarning>
          <WatchDial brand className="h-28 w-28 drop-shadow-[0_6px_16px_rgb(var(--shadow-color)/0.18)]" />
          <div className="text-center">
            <Eyebrow>{weekday}</Eyebrow>
            <p className="mt-1 font-display text-base font-semibold tracking-tight text-ink">
              {month} {now ? now.getDate() : ""}
            </p>
          </div>
        </div>
      </Widget>

      <Widget delay={0.1}>
        <button
          type="button"
          onClick={() => openApp("about")}
          className="flex w-full items-center gap-3 text-left"
        >
          <Monogram size="sm" className="rounded-2xl" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{profile.name}</p>
            <p className="truncate text-xs text-muted">{profile.role} · {profile.experience}</p>
          </div>
        </button>
        <div className="mt-3 flex items-center gap-2 border-t border-line/70 pt-3">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="text-xs font-medium text-muted">{profile.available}</span>
        </div>
      </Widget>

      <Widget delay={0.16}>
        <Eyebrow>Latest focus</Eyebrow>
        <p className="mt-1.5 text-sm leading-relaxed text-ink">
          Building real-time, AI-assisted frontend systems.
        </p>
      </Widget>

      <Widget delay={0.22}>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <Eyebrow>Get in touch</Eyebrow>
            <p className="mt-1.5 truncate text-sm text-ink">{links.email}</p>
          </div>
          <CopyButton value={links.email} label="Copy email" toast="Email copied" />
        </div>
      </Widget>
    </div>
  );
}
