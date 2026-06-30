"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@jaios/kernel/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  /** Unique id so the animated indicator never collides across instances. */
  layoutId: string;
  ariaLabel?: string;
  className?: string;
}

/**
 * Segmented control / tablist with roving focus (← → Home End) and an animated
 * active pill. The consumer renders the matching tabpanel.
 */
export function Tabs({ tabs, active, onChange, layoutId, ariaLabel, className }: TabsProps) {
  const reduced = usePrefersReducedMotion();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function focusTab(i: number) {
    const next = (i + tabs.length) % tabs.length;
    refs.current[next]?.focus();
    onChange(tabs[next].id);
  }

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      focusTab(i + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      focusTab(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusTab(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusTab(tabs.length - 1);
    }
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel ?? "Sections"}
      className={cn("flex flex-wrap gap-1 rounded-full border border-line bg-surface-2 p-1", className)}
    >
      {tabs.map((tab, i) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${layoutId}-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`${layoutId}-panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200",
              isActive ? "text-bg" : "text-muted hover:text-ink",
            )}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-ink"
                transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 38 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
