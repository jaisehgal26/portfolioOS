"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useOSStore } from "@jaios/kernel/store";
import { getAccentPreset } from "@jaios/kernel/data/system";
import { BootScreen, LoginScreen, CrashScreen, OSShell } from "@jaios/shell";
import { BrowserShell } from "@jaios/browser-shell";

/**
 * Composition root. Owns boot/login and the global chrome (theme, accent,
 * reduced motion, brightness, crash), then mounts the OS or Browser shell
 * based on the persisted shellMode. Neither shell depends on the other.
 */
export function Root() {
  const hasBooted = useOSStore((s) => s.hasBooted);
  const isLoggedIn = useOSStore((s) => s.isLoggedIn);
  const shellMode = useOSStore((s) => s.shellMode);
  const crashed = useOSStore((s) => s.crashed);
  const brightness = useOSStore((s) => s.brightness);
  const hydrate = useOSStore((s) => s.hydrate);
  const theme = useOSStore((s) => s.theme);
  const accent = useOSStore((s) => s.accent);
  const reducedPref = useOSStore((s) => s.reducedMotionPref);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const preset = getAccentPreset(accent);
    document.documentElement.style.setProperty("--accent", theme === "dark" ? preset.dark : preset.light);
  }, [accent, theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("rm-off", reducedPref);
  }, [reducedPref]);

  return (
    <>
      {brightness < 1 && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[55] bg-black transition-opacity duration-200"
          style={{ opacity: (1 - brightness) * 0.7 }}
        />
      )}

      {crashed && <CrashScreen />}

      <AnimatePresence mode="wait">
        {!hasBooted ? (
          <BootScreen key="boot" />
        ) : !isLoggedIn ? (
          <LoginScreen key="login" />
        ) : shellMode === "browser" ? (
          <BrowserShell key="browser" />
        ) : (
          <OSShell key="os" />
        )}
      </AnimatePresence>
    </>
  );
}
