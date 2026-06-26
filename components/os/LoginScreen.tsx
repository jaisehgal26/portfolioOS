"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Code2 } from "lucide-react";
import { useOSStore, type Mode } from "@/store/os-store";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { profile } from "@/data/profile";

export function LoginScreen() {
  const login = useOSStore((s) => s.login);
  const openApp = useOSStore((s) => s.openApp);
  const mode = useOSStore((s) => s.mode);
  const reduced = usePrefersReducedMotion();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const time = now
    ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  const date = now
    ? now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })
    : "";

  function enter(m: Mode) {
    login(m);
    // Recruiters get the 30-second overview front and center.
    if (m === "recruiter") openApp("quick-hire");
  }

  return (
    <div className="wallpaper-aurora fixed inset-0 z-[190] flex flex-col items-center justify-center px-5">
      {/* Clock */}
      <div className="mb-10 text-center" suppressHydrationWarning>
        <p className="font-display text-6xl font-semibold tracking-tight text-ink sm:text-7xl">{time}</p>
        <p className="mt-1 text-sm font-medium text-muted">{date}</p>
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-strong w-full max-w-sm rounded-4xl p-7 text-center shadow-window"
      >
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-accent to-amber text-white shadow-card ring-2 ring-white/30">
          <span className="font-display text-2xl font-semibold">JS</span>
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
          {profile.name}
        </h1>
        <p className="text-sm text-muted">{profile.role}</p>

        <button
          type="button"
          onClick={() => enter(mode)}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
        >
          Enter Portfolio
          <ArrowRight className="h-4 w-4" />
        </button>

        <p className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-faint">Continue as</p>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => enter("recruiter")}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-line bg-surface/70 px-3 py-3 text-sm font-medium text-ink transition-colors hover:border-line-strong"
          >
            <Briefcase className="h-5 w-5 text-accent" />
            Recruiter
          </button>
          <button
            type="button"
            onClick={() => enter("engineer")}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-line bg-surface/70 px-3 py-3 text-sm font-medium text-ink transition-colors hover:border-line-strong"
          >
            <Code2 className="h-5 w-5 text-violet" />
            Engineer
          </button>
        </div>
        <p className="mt-4 text-xs text-faint">
          Recruiter keeps it concise. Engineer adds technical depth.
        </p>
      </motion.div>
    </div>
  );
}
