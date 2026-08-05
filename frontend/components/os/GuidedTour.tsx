"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { TOUR_STEPS } from "@/data/tour-steps";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { markTourDone } from "@/lib/tour";
import { useOSStore } from "@/store/os-store";
import { cn } from "@/lib/utils";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PAD = 8;
const TOOLTIP_GAP = 16;
const VIEWPORT_PAD = 16;
const ESTIMATED_CARD_H = 280;

function tooltipStyle(
  rect: Rect | null,
  placement: (typeof TOUR_STEPS)[number]["placement"],
): React.CSSProperties {
  const maxW = Math.min(320, window.innerWidth - VIEWPORT_PAD * 2);
  const base: React.CSSProperties = {
    position: "fixed",
    width: maxW,
    maxWidth: maxW,
    zIndex: 2,
    maxHeight: `calc(100vh - ${VIEWPORT_PAD * 2}px)`,
    overflowY: "auto",
  };

  if (!rect || placement === "center") {
    return {
      ...base,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "min(22rem, calc(100vw - 2rem))",
      maxWidth: "min(22rem, calc(100vw - 2rem))",
    };
  }

  const centerX = rect.left + rect.width / 2;
  const clampedLeft = Math.min(
    Math.max(VIEWPORT_PAD + maxW / 2, centerX),
    window.innerWidth - VIEWPORT_PAD - maxW / 2,
  );

  if (placement === "top") {
    // Anchor card above target via `bottom` — avoids translateY(-100%) fighting Framer Motion
    const bottom = window.innerHeight - rect.top + TOOLTIP_GAP;
    const needsCenterFallback = rect.top < ESTIMATED_CARD_H + VIEWPORT_PAD;

    if (needsCenterFallback) {
      return {
        ...base,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    return {
      ...base,
      left: clampedLeft,
      bottom,
      transform: "translateX(-50%)",
    };
  }

  if (placement === "bottom") {
    const top = rect.top + rect.height + TOOLTIP_GAP;
    const overflowBottom = top + ESTIMATED_CARD_H > window.innerHeight - VIEWPORT_PAD;

    if (overflowBottom) {
      return {
        ...base,
        left: clampedLeft,
        bottom: window.innerHeight - rect.top + TOOLTIP_GAP,
        transform: "translateX(-50%)",
      };
    }

    return {
      ...base,
      left: clampedLeft,
      top,
      transform: "translateX(-50%)",
    };
  }

  if (placement === "right") {
    const left = rect.left + rect.width + TOOLTIP_GAP;
    const overflowRight = left + maxW > window.innerWidth - VIEWPORT_PAD;
    const top = Math.min(
      Math.max(VIEWPORT_PAD, rect.top),
      window.innerHeight - ESTIMATED_CARD_H - VIEWPORT_PAD,
    );

    if (overflowRight) {
      return {
        ...base,
        left: clampedLeft,
        bottom: window.innerHeight - rect.top + TOOLTIP_GAP,
        transform: "translateX(-50%)",
      };
    }

    return { ...base, left, top };
  }

  // left
  const top = Math.min(
    Math.max(VIEWPORT_PAD, rect.top),
    window.innerHeight - ESTIMATED_CARD_H - VIEWPORT_PAD,
  );
  return {
    ...base,
    left: Math.max(VIEWPORT_PAD, rect.left - TOOLTIP_GAP),
    top,
    transform: "translateX(-100%)",
  };
}

function getTargetRect(target?: string): Rect | null {
  if (!target || typeof document === "undefined") return null;
  const el = document.querySelector(`[data-tour="${target}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    top: r.top - PAD,
    left: r.left - PAD,
    width: r.width + PAD * 2,
    height: r.height + PAD * 2,
  };
}

export function GuidedTour() {
  const tourOpen = useOSStore((s) => s.tourOpen);
  const tourStep = useOSStore((s) => s.tourStep);
  const nextTourStep = useOSStore((s) => s.nextTourStep);
  const prevTourStep = useOSStore((s) => s.prevTourStep);
  const endTour = useOSStore((s) => s.endTour);
  const openApp = useOSStore((s) => s.openApp);
  const openFinderAt = useOSStore((s) => s.openFinderAt);
  const reduced = usePrefersReducedMotion();

  const step = TOUR_STEPS[tourStep];
  const isLast = tourStep >= TOUR_STEPS.length - 1;
  const [rect, setRect] = useState<Rect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const runAction = useCallback(
    (s: (typeof TOUR_STEPS)[number]) => {
      const action = s.action ?? { type: "none" as const };
      if (action.type === "open-finder") openFinderAt(action.section);
      else if (action.type === "open-app") openApp(action.appId);
    },
    [openApp, openFinderAt],
  );

  const refreshRect = useCallback(() => {
    if (!step?.target) {
      setRect(null);
      return;
    }
    setRect(getTargetRect(step.target));
  }, [step]);

  useEffect(() => {
    if (!tourOpen || !step) return;
    runAction(step);

    let cancelled = false;
    const tryRefresh = () => {
      if (cancelled) return;
      if (!step.target) {
        setRect(null);
        return;
      }
      setRect(getTargetRect(step.target));
    };

    tryRefresh();
    const timers = [80, 350, 600, 900].map((ms) => setTimeout(tryRefresh, ms));
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [tourOpen, tourStep, step, runAction]);

  useEffect(() => {
    if (!tourOpen) return;
    const onResize = () => refreshRect();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [tourOpen, refreshRect]);

  function finish(completed: boolean) {
    if (completed) markTourDone();
    endTour(completed);
  }

  if (!tourOpen || !step || !mounted) return null;

  const showSpotlight = Boolean(rect && step.placement !== "center");

  const tour = (
    <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-label="Guided tour">
      {/* Full-screen dim — always present for center steps; sits under spotlight cutout */}
      {!showSpotlight && (
        <div
          className="pointer-events-none fixed inset-0"
          style={{ background: "rgba(0,0,0,0.62)" }}
          aria-hidden
        />
      )}

      {/* Spotlight cutout — includes its own dim via box-shadow */}
      {showSpotlight && rect && (
        <div
          className="pointer-events-none fixed rounded-xl ring-2 ring-accent/80 transition-all duration-300"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.62)",
          }}
        />
      )}

      {/* Blocks clicks to the OS underneath (tooltip sits above this) */}
      <div className="fixed inset-0 z-[1]" aria-hidden />

      {/* Tooltip card — must be positioned + pointer-events-auto to receive clicks */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          style={tooltipStyle(rect, step.placement)}
          className="pointer-events-auto z-[2] rounded-2xl border border-line bg-surface p-5 shadow-card"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-faint">
                Step {tourStep + 1} of {TOUR_STEPS.length}
              </p>
              <h2 className="mt-1 font-display text-lg font-semibold text-ink">{step.title}</h2>
            </div>
            <button
              type="button"
              onClick={() => finish(false)}
              aria-label="Skip tour"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-faint hover:bg-ink/5 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>

          {/* Progress dots */}
          <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
            {TOUR_STEPS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === tourStep ? "w-4 bg-accent" : "w-1.5 bg-ink/15",
                )}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => finish(false)}
              className="text-xs font-medium text-muted hover:text-ink"
            >
              Skip tour
            </button>
            <div className="flex items-center gap-2">
              {tourStep > 0 && (
                <button
                  type="button"
                  onClick={prevTourStep}
                  className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-ink/5"
                >
                  <ArrowLeft className="h-3 w-3" /> Back
                </button>
              )}
              {isLast ? (
                <button
                  type="button"
                  onClick={() => {
                    openFinderAt("contact");
                    finish(true);
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-bg"
                >
                  Contact me <ArrowRight className="h-3 w-3" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextTourStep}
                  className="inline-flex items-center gap-1 rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-bg"
                >
                  Next <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return createPortal(tour, document.body);
}
