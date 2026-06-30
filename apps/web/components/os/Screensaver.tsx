"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCurrentTime } from "@jaios/kernel/hooks/use-current-time";
import { usePrefersReducedMotion } from "@jaios/kernel/hooks/use-reduced-motion";

const IDLE_MS = 60_000;

/** Idle screensaver — dims to a clock after inactivity; any input wakes it. */
export function Screensaver() {
  const [idle, setIdle] = useState(false);
  const idleRef = useRef(false);
  const now = useCurrentTime();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function reset() {
      if (idleRef.current) {
        idleRef.current = false;
        setIdle(false);
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        idleRef.current = true;
        setIdle(true);
      }, IDLE_MS);
    }
    const events = ["mousemove", "mousedown", "keydown", "wheel", "touchstart", "pointerdown"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, []);

  const time = now ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
  const date = now ? now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) : "";

  return (
    <AnimatePresence>
      {idle && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.6 }}
          className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-[#0d0b09] text-[#efe7db]"
        >
          <p className="font-display text-8xl font-semibold tabular-nums" suppressHydrationWarning>
            {time}
          </p>
          <p className="mt-2 text-lg text-[#efe7db]/70" suppressHydrationWarning>
            {date}
          </p>
          <p className="absolute bottom-10 text-xs uppercase tracking-[0.3em] text-[#efe7db]/40">
            move to wake
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
