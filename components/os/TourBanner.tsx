"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Compass, X } from "lucide-react";
import { dismissTourBanner, isTourBannerDismissed, isTourDone } from "@/lib/tour";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useOSStore } from "@/store/os-store";

export function TourBanner() {
  const isLoggedIn = useOSStore((s) => s.isLoggedIn);
  const tourOpen = useOSStore((s) => s.tourOpen);
  const startTour = useOSStore((s) => s.startTour);
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || tourOpen) {
      setVisible(false);
      return;
    }
    setVisible(!isTourDone() && !isTourBannerDismissed());
  }, [isLoggedIn, tourOpen]);

  if (!visible) return null;

  function dismiss() {
    dismissTourBanner();
    setVisible(false);
  }

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.8 }}
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[35] flex justify-center px-4"
    >
      <div className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border border-line bg-surface/95 p-3.5 shadow-card backdrop-blur-xl">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/12 text-accent">
          <Compass className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">New here?</p>
          <p className="text-xs text-muted">Take a 60-second recruiter tour of JaiOS.</p>
        </div>
        <button
          type="button"
          onClick={startTour}
          className="shrink-0 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-bg"
        >
          Start tour
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss tour banner"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-faint hover:bg-ink/5 hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
