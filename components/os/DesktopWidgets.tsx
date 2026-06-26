"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import { useOSStore } from "@/store/os-store";
import { profile, links } from "@/data/profile";
import { CopyButton } from "@/components/ui/CopyButton";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

function Widget({ className, children, delay = 0 }: { className?: string; children: React.ReactNode; delay?: number }) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("glass rounded-3xl p-4 shadow-soft", className)}
    >
      {children}
    </motion.div>
  );
}

export function DesktopWidgets() {
  const openApp = useOSStore((s) => s.openApp);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex w-64 flex-col gap-3">
      {/* Date */}
      <Widget delay={0.05}>
        <div className="flex items-center justify-between" suppressHydrationWarning>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              {now ? now.toLocaleDateString([], { weekday: "long" }) : ""}
            </p>
            <p className="font-display text-4xl font-semibold leading-none text-ink">
              {now ? now.getDate() : ""}
            </p>
          </div>
          <p className="text-sm font-medium text-muted">
            {now ? now.toLocaleDateString([], { month: "long" }) : ""}
          </p>
        </div>
      </Widget>

      {/* Profile */}
      <Widget delay={0.1}>
        <button type="button" onClick={() => openApp("about")} className="flex w-full items-center gap-3 text-left">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-accent to-amber font-display text-base font-semibold text-white shadow-soft">
            JS
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{profile.name}</p>
            <p className="truncate text-xs text-muted">{profile.role} · {profile.experience}</p>
          </div>
        </button>
      </Widget>

      {/* Now building (equalizer) */}
      <Widget delay={0.15}>
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-violet/12 text-violet">
            <Radio className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-faint">Now building</p>
            <p className="truncate text-sm font-semibold text-ink">Polished UI systems</p>
          </div>
          <div className="flex items-end gap-0.5" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-violet animate-typing-dot"
                style={{ height: 14, animationDelay: `${i * 0.14}s` }}
              />
            ))}
          </div>
        </div>
      </Widget>

      {/* Focus */}
      <Widget delay={0.2}>
        <p className="text-xs font-medium uppercase tracking-wider text-faint">Latest focus</p>
        <p className="mt-1 text-sm leading-relaxed text-ink">
          Building real-time, AI-assisted frontend systems.
        </p>
      </Widget>

      {/* Contact */}
      <Widget delay={0.25}>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-faint">Get in touch</p>
            <p className="truncate text-sm text-ink">{links.email}</p>
          </div>
          <CopyButton value={links.email} label="Copy email" toast="Email copied" />
        </div>
      </Widget>
    </div>
  );
}
