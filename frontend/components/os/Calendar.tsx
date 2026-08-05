"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOSStore } from "@/store/os-store";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function Calendar() {
  const open = useOSStore((s) => s.calendarOpen);
  const close = useOSStore((s) => s.closeCalendar);
  const reduced = usePrefersReducedMotion();
  const [offset, setOffset] = useState(0); // months from the current month

  const today = new Date();
  const view = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const year = view.getFullYear();
  const month = view.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const isThisMonth = offset === 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <button
            aria-label="Close calendar"
            tabIndex={-1}
            onClick={close}
            className="fixed inset-0 z-[60] cursor-default"
          />
          <motion.div
            aria-label="Calendar"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: reduced ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong fixed right-2.5 top-12 z-[70] w-72 rounded-3xl p-4 shadow-window"
          >
            <div className="flex items-center justify-between px-1">
              <p className="font-display text-base font-semibold tracking-tight text-ink">
                {view.toLocaleDateString([], { month: "long", year: "numeric" })}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setOffset((o) => o - 1)}
                  aria-label="Previous month"
                  className="grid h-7 w-7 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-ink"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOffset((o) => o + 1)}
                  aria-label="Next month"
                  className="grid h-7 w-7 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-ink"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((d, i) => (
                <span key={i} className="text-[11px] font-semibold uppercase text-faint">{d}</span>
              ))}
              {cells.map((day, i) => {
                const isToday = isThisMonth && day === today.getDate();
                return (
                  <span
                    key={i}
                    className={cn(
                      "grid h-8 place-items-center rounded-full text-sm tabular-nums",
                      day === null ? "" : "text-ink",
                      isToday && "bg-accent font-semibold text-white",
                    )}
                  >
                    {day ?? ""}
                  </span>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
