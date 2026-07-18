"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote as QuoteIcon, RefreshCw } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useCurrentTime } from "@/hooks/use-current-time";
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

export function ClockWidget({ delay = 0 }: { delay?: number }) {
  const now = useCurrentTime();
  const weekday = now ? now.toLocaleDateString([], { weekday: "long" }) : "";
  const month = now ? now.toLocaleDateString([], { month: "long" }) : "";

  return (
    <Widget delay={delay}>
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
  );
}

export function DesktopWidgets() {
  return (
    <div className="flex w-64 flex-col gap-3">
      <ClockWidget delay={0.04} />
      <QuoteWidget delay={0.1} />
    </div>
  );
}

interface Quote {
  content: string;
  author: string;
}

/** Local quotes — no network required (offline-first). */
const QUOTES: Quote[] = [
  { content: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { content: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { content: "The details are not the details. They make the design.", author: "Charles Eames" },
  { content: "Programs must be written for people to read.", author: "Harold Abelson" },
  { content: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke" },
  { content: "Curiosity is a frontend superpower.", author: "Jai Sehgal" },
];

function pickQuote(exclude?: Quote): Quote {
  const pool = exclude ? QUOTES.filter((q) => q.content !== exclude.content) : QUOTES;
  return pool[Math.floor(Math.random() * pool.length)] ?? QUOTES[0];
}

export function QuoteWidget({ delay = 0 }: { delay?: number }) {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    setQuote(pickQuote());
  }, []);

  function refresh() {
    setQuote((prev) => pickQuote(prev ?? undefined));
  }

  return (
    <Widget delay={delay}>
      <div className="flex items-center justify-between">
        <Eyebrow>Thought of the day</Eyebrow>
        <button
          type="button"
          onClick={refresh}
          aria-label="New quote"
          className="grid h-6 w-6 place-items-center rounded-md text-faint transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      <QuoteIcon className="mt-2 h-4 w-4 text-accent/70" aria-hidden />

      {quote ? (
        <figure className="mt-1.5">
          <blockquote className="text-sm leading-relaxed text-ink">{quote.content}</blockquote>
          <figcaption className="mt-2 text-xs font-medium text-muted">— {quote.author}</figcaption>
        </figure>
      ) : null}
    </Widget>
  );
}
