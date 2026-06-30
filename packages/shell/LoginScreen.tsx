"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Monitor } from "lucide-react";
import { useOSStore } from "@jaios/kernel/store";
import { usePrefersReducedMotion } from "@jaios/kernel/hooks/use-reduced-motion";
import { useCurrentTime } from "@jaios/kernel/hooks/use-current-time";
import { Monogram } from "@jaios/ui/Monogram";
import { cn } from "@jaios/ui/utils";
import { profile } from "@jaios/content/profile";

const WORLDS = [
  { id: "os", label: "Desktop", desc: "The macOS experience", Icon: Monitor },
  { id: "browser", label: "Browser", desc: "Everything runs in the browser", Icon: Globe },
] as const;

export function LoginScreen() {
  const login = useOSStore((s) => s.login);
  const shellMode = useOSStore((s) => s.shellMode);
  const setShellMode = useOSStore((s) => s.setShellMode);
  const reduced = usePrefersReducedMotion();
  const now = useCurrentTime();
  const [pwd, setPwd] = useState("");
  const [shake, setShake] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const time = now ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
  const date = now ? now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) : "";

  function submit() {
    if (pwd.trim()) login();
    else setShake((n) => n + 1);
  }

  return (
    <div className="wallpaper-aurora fixed inset-0 z-[190] flex flex-col items-center justify-between px-5 py-16 sm:py-20">
      {/* Lock-screen clock */}
      <div className="text-center" suppressHydrationWarning>
        <p className="text-sm font-medium text-muted">{date}</p>
        <p className="font-display text-7xl font-semibold tracking-tight text-ink sm:text-8xl">{time}</p>
      </div>

      {/* User tile */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full max-w-xs flex-col items-center"
      >
        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          aria-label={`Sign in as ${profile.name}`}
          className="group flex flex-col items-center gap-3 rounded-3xl p-2 outline-none"
        >
          <Monogram size="xl" className="transition-transform group-hover:scale-105 group-focus-visible:scale-105" />
          <span className="font-display text-xl font-semibold tracking-tight text-ink">{profile.name}</span>
        </button>

        {/* World chooser — enter the macOS desktop or the browser shell */}
        <div
          role="radiogroup"
          aria-label="Choose your world"
          className="mt-5 grid w-full grid-cols-2 gap-2.5"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
              e.preventDefault();
              setShellMode(shellMode === "os" ? "browser" : "os");
            }
          }}
        >
          {WORLDS.map((w) => {
            const active = shellMode === w.id;
            return (
              <button
                key={w.id}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                onClick={() => setShellMode(w.id)}
                className={cn(
                  "flex flex-col items-start gap-1.5 rounded-2xl border p-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent",
                  active ? "border-accent bg-accent/[0.06]" : "border-line bg-surface/70 hover:border-line-strong",
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-lg transition-colors",
                    active ? "bg-accent/15 text-accent" : "bg-surface-2 text-muted",
                  )}
                >
                  <w.Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-ink">{w.label}</span>
                <span className="text-[11px] leading-tight text-muted">{w.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Password field (any password works — it's a demo) */}
        <motion.div
          key={shake}
          animate={shake && !reduced ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-5 flex w-full items-center gap-2 rounded-full border border-line bg-surface/80 px-2 py-1.5 shadow-soft backdrop-blur"
        >
          <input
            ref={inputRef}
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Enter password"
            aria-label="Password"
            className="min-w-0 flex-1 bg-transparent px-2 text-sm text-ink placeholder:text-faint focus:outline-none"
          />
          <button
            type="button"
            onClick={submit}
            aria-label="Sign in"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-bg transition-transform hover:-translate-y-0.5"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

        <p className="mt-2 text-[11px] text-faint">Any password works</p>
      </motion.div>
    </div>
  );
}
