"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useOSStore } from "@/store/os-store";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { experienceYM } from "@jaios/content/profile";
import { cn } from "@/lib/utils";

const DUMP = [
  "panic: user requested total annihilation",
  "unmounting /portfolio … done",
  `flushing ${experienceYM()} years of experience to disk … ok`,
  "preserving good first impression … ok",
  "note: the work survived — it's just a website :)",
];

/** An original, on-brand "kernel panic" recovery console (not a Windows BSOD). */
export function CrashScreen() {
  const reboot = useOSStore((s) => s.reboot);
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduced ? DUMP.length : 0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setShown((v) => {
        if (v >= DUMP.length) {
          clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, 380);
    return () => clearInterval(id);
  }, [reduced]);

  const done = shown >= DUMP.length;

  return (
    <motion.div
      className="fixed inset-0 z-[300] overflow-hidden bg-[#14100c] text-[#efe7db]"
      animate={reduced ? undefined : { opacity: [1, 0.97, 1, 0.92, 1] }}
      transition={reduced ? undefined : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Warm accent glow */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(58rem 38rem at 50% 6%, rgb(var(--accent) / 0.2), transparent 60%)" }}
      />
      {/* CRT scanlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 3px)" }}
      />

      <div className="relative flex h-full max-w-3xl flex-col justify-center px-8 sm:px-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent">kernel panic</p>

        <h1
          className="mt-4 font-display text-5xl font-semibold leading-[1.04] tracking-tight sm:text-7xl"
          style={{ textShadow: "0.022em 0 rgba(224,122,78,0.6), -0.022em 0 rgba(79,110,247,0.45)" }}
        >
          Well, that
          <br />
          escalated.
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-[#cdbfae] sm:text-lg">
          You ran <span className="font-mono text-[#efe7db]">rm -rf</span>. Bold. JaiOS intercepted the
          blast radius and is quietly putting itself back together.
        </p>

        <div className="mt-7 font-mono text-[13px] leading-relaxed text-[#9fd8b0]">
          {DUMP.slice(0, shown).map((line, i) => (
            <motion.p
              key={i}
              initial={reduced ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="whitespace-pre-wrap break-words"
            >
              <span className="text-[#6f8f78]">$</span> {line}
            </motion.p>
          ))}
          {!done && !reduced && (
            <span className="ml-1 inline-block h-3.5 w-2 animate-pulse bg-[#9fd8b0] align-middle" />
          )}
        </div>

        <button
          type="button"
          onClick={reboot}
          className="mt-9 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-[#14100c] transition-transform hover:-translate-y-0.5"
        >
          <RotateCcw className="h-4 w-4" />
          Reboot JaiOS
        </button>

        <p className={cn("mt-8 font-mono text-[11px] tracking-wider text-white/35")}>
          JaiOS · recovery console · stop code JAI_RM_RF
        </p>
      </div>
    </motion.div>
  );
}
