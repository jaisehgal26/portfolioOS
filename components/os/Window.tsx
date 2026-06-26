"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Maximize2, Minus, X } from "lucide-react";
import { useOSStore, type OSWindow } from "@/store/os-store";
import { getApp } from "@/data/apps";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { AppIcon } from "./AppIcon";
import { clamp } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TOP_BAR = 44;
const MIN_W = 360;
const MIN_H = 300;

interface WindowProps {
  win: OSWindow;
  isMobile: boolean;
  children: React.ReactNode;
}

export function Window({ win, isMobile, children }: WindowProps) {
  const app = getApp(win.id);
  const reduced = usePrefersReducedMotion();
  const focusWindow = useOSStore((s) => s.focusWindow);
  const closeWindow = useOSStore((s) => s.closeWindow);
  const minimizeWindow = useOSStore((s) => s.minimizeWindow);
  const toggleMaximize = useOSStore((s) => s.toggleMaximize);
  const setWindowRect = useOSStore((s) => s.setWindowRect);
  const focused = useOSStore((s) => s.focusedId) === win.id;

  const [pos, setPos] = useState({ x: win.x, y: win.y });
  const [size, setSize] = useState({ w: win.w, h: win.h });
  const dragging = useRef(false);
  const resizing = useRef(false);
  const posRef = useRef(pos);
  const sizeRef = useRef(size);
  posRef.current = pos;
  sizeRef.current = size;

  useEffect(() => {
    if (!dragging.current) setPos({ x: win.x, y: win.y });
  }, [win.x, win.y]);
  useEffect(() => {
    if (!resizing.current) setSize({ w: win.w, h: win.h });
  }, [win.w, win.h]);

  function startDrag(e: React.PointerEvent) {
    if (win.maximized || isMobile) return;
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    focusWindow(win.id);
    dragging.current = true;
    const startX = e.clientX;
    const startY = e.clientY;
    const origin = { ...posRef.current };
    function move(ev: PointerEvent) {
      const nx = clamp(origin.x + ev.clientX - startX, -size.w + 120, window.innerWidth - 120);
      const ny = clamp(origin.y + ev.clientY - startY, TOP_BAR, window.innerHeight - 56);
      setPos({ x: nx, y: ny });
    }
    function up() {
      dragging.current = false;
      setWindowRect(win.id, { x: posRef.current.x, y: posRef.current.y });
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startResize(e: React.PointerEvent) {
    if (win.maximized || isMobile) return;
    e.stopPropagation();
    focusWindow(win.id);
    resizing.current = true;
    const startX = e.clientX;
    const startY = e.clientY;
    const origin = { ...sizeRef.current };
    function move(ev: PointerEvent) {
      const nw = clamp(origin.w + ev.clientX - startX, MIN_W, window.innerWidth - posRef.current.x - 16);
      const nh = clamp(origin.h + ev.clientY - startY, MIN_H, window.innerHeight - posRef.current.y - 16);
      setSize({ w: nw, h: nh });
    }
    function up() {
      resizing.current = false;
      setWindowRect(win.id, { w: sizeRef.current.w, h: sizeRef.current.h });
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  // ---- Mobile: full-screen app view ----
  if (isMobile) {
    return (
      <motion.section
        aria-label={app.name}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto fixed inset-x-0 z-30 flex flex-col bg-surface"
        style={{ top: TOP_BAR, bottom: 0 }}
      >
        <header className="flex items-center gap-2 border-b border-line px-3 py-2.5">
          <button
            type="button"
            onClick={() => minimizeWindow(win.id)}
            aria-label="Back to apps"
            className="inline-flex h-9 items-center gap-1 rounded-full px-2 text-sm font-medium text-muted hover:text-ink"
          >
            <ChevronLeft className="h-5 w-5" />
            Apps
          </button>
          <div className="mx-auto flex items-center gap-2">
            <AppIcon app={app} size="sm" />
            <span className="font-medium text-ink">{app.name}</span>
          </div>
          <button
            type="button"
            onClick={() => closeWindow(win.id)}
            aria-label={`Close ${app.name}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </motion.section>
    );
  }

  // ---- Desktop: floating window ----
  const style = win.maximized
    ? { left: 8, top: TOP_BAR + 8, width: "calc(100vw - 16px)", height: `calc(100vh - ${TOP_BAR + 16}px)`, zIndex: win.zIndex }
    : { left: pos.x, top: pos.y, width: size.w, height: size.h, zIndex: win.zIndex };

  return (
    <motion.section
      aria-label={app.name}
      onPointerDown={() => focusWindow(win.id)}
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
      transition={{ duration: reduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={style}
      className={cn(
        "glass-strong pointer-events-auto absolute flex flex-col overflow-hidden rounded-2xl shadow-window",
        focused ? "ring-1 ring-accent/25" : "ring-0",
      )}
    >
      {/* Title bar */}
      <header
        onPointerDown={startDrag}
        onDoubleClick={() => toggleMaximize(win.id)}
        className="flex h-11 shrink-0 cursor-grab items-center gap-3 border-b border-line/70 px-3.5 active:cursor-grabbing"
      >
        {/* Original window controls */}
        <div className="group flex items-center gap-2" data-no-drag>
          <button
            type="button"
            onClick={() => closeWindow(win.id)}
            aria-label={`Close ${app.name}`}
            className="grid h-3.5 w-3.5 place-items-center rounded-full bg-danger/90 text-danger transition-colors hover:text-white"
          >
            <X className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
          <button
            type="button"
            onClick={() => minimizeWindow(win.id)}
            aria-label={`Minimize ${app.name}`}
            className="grid h-3.5 w-3.5 place-items-center rounded-full bg-amber/90 text-amber transition-colors hover:text-white"
          >
            <Minus className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
          <button
            type="button"
            onClick={() => toggleMaximize(win.id)}
            aria-label={win.maximized ? `Restore ${app.name}` : `Maximize ${app.name}`}
            className="grid h-3.5 w-3.5 place-items-center rounded-full bg-mint/90 text-mint transition-colors hover:text-white"
          >
            <Maximize2 className="h-2 w-2 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        </div>

        <div className="pointer-events-none mx-auto flex items-center gap-2">
          <AppIcon app={app} size="xs" />
          <span className="text-sm font-medium text-ink">{app.name}</span>
        </div>
        <div className="w-12" aria-hidden />
      </header>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-hidden bg-surface/95">{children}</div>

      {/* Resize handle */}
      {!win.maximized && (
        <div
          onPointerDown={startResize}
          role="presentation"
          className="absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize"
        >
          <div className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-br-md border-b-2 border-r-2 border-line-strong" />
        </div>
      )}
    </motion.section>
  );
}
