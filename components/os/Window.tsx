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
/** Space kept clear at the bottom for the dock, so windows never slip under it. */
const DOCK_RESERVE = 74;

type SnapZone = "max" | "left" | "right" | null;

/** Target rect for a snap zone (max / left-half / right-half). Client only. */
function snapRect(zone: Exclude<SnapZone, null>) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const top = TOP_BAR + 8;
  const h = vh - top - DOCK_RESERVE;
  if (zone === "max") return { x: 8, y: top, w: vw - 16, h };
  const w = Math.floor(vw / 2) - 12;
  const x = zone === "left" ? 8 : Math.ceil(vw / 2) + 4;
  return { x, y: top, w, h };
}

const RESIZE_HANDLES: { dir: string; className: string }[] = [
  { dir: "n", className: "left-3 right-3 top-0 h-1.5 cursor-ns-resize" },
  { dir: "s", className: "left-3 right-3 bottom-0 h-1.5 cursor-ns-resize" },
  { dir: "e", className: "top-3 bottom-3 right-0 w-1.5 cursor-ew-resize" },
  { dir: "w", className: "top-3 bottom-3 left-0 w-1.5 cursor-ew-resize" },
  { dir: "ne", className: "top-0 right-0 h-3 w-3 cursor-nesw-resize" },
  { dir: "nw", className: "top-0 left-0 h-3 w-3 cursor-nwse-resize" },
  { dir: "se", className: "bottom-0 right-0 h-3 w-3 cursor-nwse-resize" },
  { dir: "sw", className: "bottom-0 left-0 h-3 w-3 cursor-nesw-resize" },
];

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
  const [snap, setSnap] = useState<SnapZone>(null);
  const dragging = useRef(false);
  const resizing = useRef(false);
  const posRef = useRef(pos);
  const sizeRef = useRef(size);
  const snapRef = useRef<SnapZone>(null);
  posRef.current = pos;
  sizeRef.current = size;

  useEffect(() => {
    if (!dragging.current) setPos({ x: win.x, y: win.y });
  }, [win.x, win.y]);
  useEffect(() => {
    if (!resizing.current) setSize({ w: win.w, h: win.h });
  }, [win.w, win.h]);

  function applySnap(zone: Exclude<SnapZone, null>) {
    const r = snapRect(zone);
    if (zone === "max") {
      if (!win.maximized) toggleMaximize(win.id);
      return;
    }
    setPos({ x: r.x, y: r.y });
    setSize({ w: r.w, h: r.h });
    setWindowRect(win.id, r);
  }

  function startDrag(e: React.PointerEvent) {
    if (win.maximized || isMobile) return;
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    focusWindow(win.id);
    dragging.current = true;
    const startX = e.clientX;
    const startY = e.clientY;
    const origin = { ...posRef.current };
    function move(ev: PointerEvent) {
      const nx = clamp(origin.x + ev.clientX - startX, -sizeRef.current.w + 120, window.innerWidth - 120);
      const maxY = Math.max(TOP_BAR, window.innerHeight - DOCK_RESERVE - sizeRef.current.h);
      const ny = clamp(origin.y + ev.clientY - startY, TOP_BAR, maxY);
      setPos({ x: nx, y: ny });
      let zone: SnapZone = null;
      if (ev.clientY <= TOP_BAR + 4) zone = "max";
      else if (ev.clientX <= 6) zone = "left";
      else if (ev.clientX >= window.innerWidth - 6) zone = "right";
      snapRef.current = zone;
      setSnap(zone);
    }
    function up() {
      dragging.current = false;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      const zone = snapRef.current;
      snapRef.current = null;
      setSnap(null);
      if (zone) applySnap(zone);
      else setWindowRect(win.id, { x: posRef.current.x, y: posRef.current.y });
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startResize(e: React.PointerEvent, dir: string) {
    if (win.maximized || isMobile) return;
    e.stopPropagation();
    focusWindow(win.id);
    resizing.current = true;
    const startX = e.clientX;
    const startY = e.clientY;
    const o = { x: posRef.current.x, y: posRef.current.y, w: sizeRef.current.w, h: sizeRef.current.h };
    function move(ev: PointerEvent) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let { x, y, w, h } = o;
      if (dir.includes("e")) w = o.w + dx;
      if (dir.includes("s")) h = o.h + dy;
      if (dir.includes("w")) {
        w = o.w - dx;
        x = o.x + dx;
      }
      if (dir.includes("n")) {
        h = o.h - dy;
        y = o.y + dy;
      }
      if (w < MIN_W) {
        if (dir.includes("w")) x = o.x + (o.w - MIN_W);
        w = MIN_W;
      }
      if (h < MIN_H) {
        if (dir.includes("n")) y = o.y + (o.h - MIN_H);
        h = MIN_H;
      }

      // Keep every edge inside the viewport (top bar above, dock below, 8px sides).
      const minX = 8;
      const minY = TOP_BAR;
      const maxRight = window.innerWidth - 8;
      const maxBottom = window.innerHeight - DOCK_RESERVE;
      if (dir.includes("w") && x < minX) {
        w += x - minX;
        x = minX;
      }
      if (dir.includes("n") && y < minY) {
        h += y - minY;
        y = minY;
      }
      if (x + w > maxRight) w = maxRight - x;
      if (y + h > maxBottom) h = maxBottom - y;
      w = Math.max(MIN_W, w);
      h = Math.max(MIN_H, h);

      setPos({ x, y });
      setSize({ w, h });
    }
    function up() {
      resizing.current = false;
      setWindowRect(win.id, { x: posRef.current.x, y: posRef.current.y, w: sizeRef.current.w, h: sizeRef.current.h });
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
    ? {
        left: 8,
        top: TOP_BAR + 8,
        width: "calc(100vw - 16px)",
        height: `calc(100vh - ${TOP_BAR + 8 + DOCK_RESERVE}px)`,
        zIndex: win.zIndex,
      }
    : { left: pos.x, top: pos.y, width: size.w, height: size.h, zIndex: win.zIndex };

  const preview = snap ? snapRect(snap) : null;

  return (
    <>
      {preview && (
        <div
          aria-hidden
          className="pointer-events-none fixed rounded-2xl border-2 border-accent/50 bg-accent/10 backdrop-blur-sm transition-all duration-100"
          style={{ left: preview.x, top: preview.y, width: preview.w, height: preview.h, zIndex: win.zIndex - 1 }}
        />
      )}
      <motion.section
        aria-label={app.name}
        onPointerDown={() => focusWindow(win.id)}
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 28 }}
        transition={{ duration: reduced ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
        style={{ ...style, transformOrigin: "50% 120%" }}
        className={cn(
          "glass-strong pointer-events-auto absolute flex flex-col overflow-hidden rounded-2xl shadow-window transition-shadow",
          focused ? "ring-1 ring-accent/20" : "opacity-[0.985] ring-0",
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
          <span className="text-[13px] font-medium tracking-tight text-ink">{app.name}</span>
        </div>
        <div className="w-12" aria-hidden />
      </header>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-hidden bg-surface/95">{children}</div>

      {/* Resize handles (all edges + corners) */}
      {!win.maximized &&
        RESIZE_HANDLES.map((h) => (
          <div
            key={h.dir}
            role="presentation"
            onPointerDown={(e) => startResize(e, h.dir)}
            className={cn("absolute z-10", h.className)}
          />
        ))}

        {/* Grip dot in the corner */}
        {!win.maximized && (
          <div className="pointer-events-none absolute bottom-1.5 right-1.5 h-2 w-2 rounded-br-md border-b-2 border-r-2 border-line-strong" />
        )}
      </motion.section>
    </>
  );
}
