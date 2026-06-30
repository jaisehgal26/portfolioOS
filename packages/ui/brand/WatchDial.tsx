"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@jaios/kernel/hooks/use-reduced-motion";

const I = "rgb(var(--ink))";
const ACCENT = "rgb(var(--accent))";

/** Twelve applied hour markers (cardinal ones longer/bolder). */
const markers = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30 * Math.PI) / 180;
  const cardinal = i % 3 === 0;
  const outer = 41;
  const inner = cardinal ? 33 : 37.5;
  return {
    key: i,
    x1: 50 + outer * Math.sin(a),
    y1: 50 - outer * Math.cos(a),
    x2: 50 + inner * Math.sin(a),
    y2: 50 - inner * Math.cos(a),
    cardinal,
  };
});

/**
 * A mechanical-automatic watch dial. Hands are rotated imperatively via refs in
 * a requestAnimationFrame loop so the second hand *sweeps* smoothly (it ticks
 * once per second when reduced motion is preferred). Colors come from theme
 * tokens, so it adapts to light/dark and the chosen accent automatically.
 */
export function WatchDial({ className, brand = false }: { className?: string; brand?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const hourRef = useRef<SVGGElement>(null);
  const minRef = useRef<SVGGElement>(null);
  const secRef = useRef<SVGGElement>(null);

  useEffect(() => {
    let raf = 0;
    let timer: ReturnType<typeof setInterval> | undefined;

    function render() {
      const d = new Date();
      const s = d.getSeconds() + (reduced ? 0 : d.getMilliseconds() / 1000);
      const m = d.getMinutes() + s / 60;
      const h = (d.getHours() % 12) + m / 60;
      hourRef.current?.setAttribute("transform", `rotate(${h * 30} 50 50)`);
      minRef.current?.setAttribute("transform", `rotate(${m * 6} 50 50)`);
      secRef.current?.setAttribute("transform", `rotate(${s * 6} 50 50)`);
    }

    render();
    if (reduced) {
      timer = setInterval(render, 1000);
    } else {
      const loop = () => {
        render();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      if (timer) clearInterval(timer);
    };
  }, [reduced]);

  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Analog clock">
      <defs>
        <radialGradient id="dialFace" cx="50%" cy="36%" r="72%">
          <stop offset="0%" stopColor="rgb(var(--surface))" />
          <stop offset="100%" stopColor="rgb(var(--surface-2))" />
        </radialGradient>
      </defs>

      {/* Case + bezel */}
      <circle cx="50" cy="50" r="49" fill="rgb(var(--surface-2))" stroke="rgb(var(--line-strong))" strokeWidth="1.4" />
      <circle cx="50" cy="50" r="45.5" fill="url(#dialFace)" stroke="rgb(var(--line))" strokeWidth="0.75" />

      {/* Hour markers */}
      {markers.map((mk) => (
        <line
          key={mk.key}
          x1={mk.x1}
          y1={mk.y1}
          x2={mk.x2}
          y2={mk.y2}
          stroke={I}
          strokeOpacity={mk.cardinal ? 0.85 : 0.38}
          strokeWidth={mk.cardinal ? 2.2 : 1}
          strokeLinecap="round"
        />
      ))}

      {brand && (
        <>
          <text x="50" y="33" textAnchor="middle" fill={I} fillOpacity="0.7" style={{ fontSize: 5, letterSpacing: 1.4, fontWeight: 600 }}>
            JAIOS
          </text>
          <text x="50" y="71" textAnchor="middle" fill={I} fillOpacity="0.4" style={{ fontSize: 3.4, letterSpacing: 1 }}>
            automatic
          </text>
        </>
      )}

      {/* Hour hand */}
      <g ref={hourRef}>
        <line x1="50" y1="56" x2="50" y2="31" stroke={I} strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* Minute hand */}
      <g ref={minRef}>
        <line x1="50" y1="58" x2="50" y2="20" stroke={I} strokeWidth="2.1" strokeLinecap="round" />
      </g>
      {/* Sweeping second hand */}
      <g ref={secRef}>
        <line x1="50" y1="62" x2="50" y2="16" stroke={ACCENT} strokeWidth="0.9" strokeLinecap="round" />
        <circle cx="50" cy="22" r="1.6" fill={ACCENT} />
        <circle cx="50" cy="62" r="2.2" fill={ACCENT} />
      </g>

      {/* Center cap */}
      <circle cx="50" cy="50" r="2.6" fill={I} />
      <circle cx="50" cy="50" r="1.1" fill={ACCENT} />
    </svg>
  );
}
