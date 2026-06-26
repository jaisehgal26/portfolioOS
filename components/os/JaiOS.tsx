"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOSStore } from "@/store/os-store";
import { getAccentPreset, getWallpaperClass } from "@/data/system";
import { useGlobalShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { BootScreen } from "./BootScreen";
import { CrashScreen } from "./CrashScreen";
import { LoginScreen } from "./LoginScreen";
import { TopBar } from "./TopBar";
import { Desktop } from "./Desktop";
import { WindowManager } from "./WindowManager";
import { Dock } from "./Dock";
import { Spotlight } from "./Spotlight";
import { ContextMenu } from "./ContextMenu";
import { NotificationCenter } from "./NotificationCenter";
import { ShortcutsPanel } from "./ShortcutsPanel";
import { ToastViewport } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export function JaiOS() {
  const hasBooted = useOSStore((s) => s.hasBooted);
  const isLoggedIn = useOSStore((s) => s.isLoggedIn);
  const crashed = useOSStore((s) => s.crashed);
  const hydrate = useOSStore((s) => s.hydrate);
  const theme = useOSStore((s) => s.theme);
  const accent = useOSStore((s) => s.accent);
  const wallpaper = useOSStore((s) => s.wallpaper);
  const reducedPref = useOSStore((s) => s.reducedMotionPref);

  useGlobalShortcuts();

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
    <div className={cn("fixed inset-0 overflow-hidden", getWallpaperClass(wallpaper))}>
      {/* Depth + material: edge vignette and a faint film grain over the wallpaper. */}
      <div aria-hidden className="vignette pointer-events-none absolute inset-0" />
      <div aria-hidden className="noise pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply dark:opacity-[0.05] dark:mix-blend-screen" />

      {crashed && <CrashScreen />}

      <AnimatePresence mode="wait">
        {!hasBooted ? (
          <BootScreen key="boot" />
        ) : !isLoggedIn ? (
          <LoginScreen key="login" />
        ) : (
          <motion.div
            key="desktop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Desktop />
            {/* Window layer sits below dock/top-bar; empty areas pass clicks through */}
            <div className="pointer-events-none absolute inset-0 z-20 [isolation:isolate]">
              <WindowManager />
            </div>
            <TopBar />
            <Dock />
            <Spotlight />
            <ContextMenu />
            <NotificationCenter />
            <ShortcutsPanel />
            <ToastViewport />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
