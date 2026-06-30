"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOSStore } from "@jaios/kernel/store";
import { getAccentPreset, getWallpaperClass } from "@jaios/kernel/data/system";
import { useGlobalShortcuts } from "@jaios/kernel/hooks/use-keyboard-shortcuts";
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
import { ControlCenter } from "./ControlCenter";
import { Calendar } from "./Calendar";
import { MissionControl } from "./MissionControl";
import { Screensaver } from "./Screensaver";
import { AppSwitcher } from "./AppSwitcher";
import { ShortcutsPanel } from "./ShortcutsPanel";
import { ToastViewport } from "@jaios/ui/Toast";
import { cn } from "@jaios/ui/utils";

export function JaiOS() {
  const hasBooted = useOSStore((s) => s.hasBooted);
  const isLoggedIn = useOSStore((s) => s.isLoggedIn);
  const crashed = useOSStore((s) => s.crashed);
  const brightness = useOSStore((s) => s.brightness);
  const hydrate = useOSStore((s) => s.hydrate);
  const theme = useOSStore((s) => s.theme);
  const accent = useOSStore((s) => s.accent);
  const wallpaper = useOSStore((s) => s.wallpaper);
  const reducedPref = useOSStore((s) => s.reducedMotionPref);
  const addNotification = useOSStore((s) => s.addNotification);
  const liveFired = useRef(false);

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

  // A notification arrives over the session (once), so the OS feels live.
  useEffect(() => {
    if (!isLoggedIn || liveFired.current) return;
    liveFired.current = true;
    const t1 = setTimeout(
      () => addNotification({ title: "Tip — Spotlight", body: "Press ⌘K / Ctrl K to jump anywhere.", icon: "search", time: "now" }),
      9000,
    );
    return () => clearTimeout(t1);
  }, [isLoggedIn, addNotification]);

  return (
    <div className={cn("fixed inset-0 overflow-hidden", getWallpaperClass(wallpaper))}>
      {/* Depth + material: edge vignette and a faint film grain over the wallpaper. */}
      <div aria-hidden className="vignette pointer-events-none absolute inset-0" />
      <div aria-hidden className="noise pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply dark:opacity-[0.05] dark:mix-blend-screen" />

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
            <ControlCenter />
            <Calendar />
            <MissionControl />
            <AppSwitcher />
            <Screensaver />
            <ShortcutsPanel />
            <ToastViewport />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
