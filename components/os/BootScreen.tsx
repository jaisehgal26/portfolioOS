"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOSStore } from "@/store/os-store";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { JaiLogo } from "./JaiLogo";

const STEPS = [
  "Initializing portfolio shell",
  "Loading selected work",
  "Preparing UI components",
  "Ready",
];

export function BootScreen() {
  const boot = useOSStore((s) => s.boot);
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const per = reduced ? 280 : 620;
    const timers = STEPS.map((_, i) => setTimeout(() => setStep(i), i * per));
    const done = setTimeout(boot, STEPS.length * per + 350);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [boot, reduced]);

  return (
    <div className="wallpaper-aurora fixed inset-0 z-[200] flex flex-col items-center justify-center">
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center"
      >
        <JaiLogo className="h-20 w-20 drop-shadow-[0_14px_34px_rgba(240,97,47,0.4)]" />
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink">JaiOS</h1>
        <p className="mt-1.5 text-sm text-muted">Frontend craft, packaged as an operating system.</p>

        <div className="mt-8 h-5 overflow-hidden text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
              className="text-xs font-medium uppercase tracking-[0.2em] text-faint"
            >
              {STEPS[step]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-5 flex items-center gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>
      </motion.div>

      <button
        type="button"
        onClick={boot}
        className="absolute bottom-8 rounded-full border border-line bg-surface/70 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur transition-colors hover:text-ink"
      >
        Skip
      </button>
    </div>
  );
}
