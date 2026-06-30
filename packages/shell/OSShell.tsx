"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useOSStore } from "@jaios/kernel/store";
import { getWallpaperClass } from "@jaios/kernel/data/system";
import { useGlobalShortcuts } from "@jaios/kernel/hooks/use-keyboard-shortcuts";
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

/**
 * The macOS-style desktop shell. Mounted by the composition root only once the
 * user has booted, logged in, and chosen the "os" world. Global chrome (boot,
 * login, crash, theme/accent/brightness) lives in the root, not here.
 */
export function OSShell() {
  const wallpaper = useOSStore((s) => s.wallpaper);
  const addNotification = useOSStore((s) => s.addNotification);
  const liveFired = useRef(false);

  useGlobalShortcuts();

  // A notification arrives over the session (once), so the OS feels live.
  useEffect(() => {
    if (liveFired.current) return;
    liveFired.current = true;
    const t1 = setTimeout(
      () => addNotification({ title: "Tip — Spotlight", body: "Press ⌘K / Ctrl K to jump anywhere.", icon: "search", time: "now" }),
      9000,
    );
    return () => clearTimeout(t1);
  }, [addNotification]);

  return (
    <motion.div
      key="os"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={cn("fixed inset-0 overflow-hidden", getWallpaperClass(wallpaper))}
    >
      {/* Depth + material: edge vignette and a faint film grain over the wallpaper. */}
      <div aria-hidden className="vignette pointer-events-none absolute inset-0" />
      <div aria-hidden className="noise pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply dark:opacity-[0.05] dark:mix-blend-screen" />

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
  );
}
