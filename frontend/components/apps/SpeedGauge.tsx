"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useSmoothNumber } from "@/hooks/use-smooth-number";
import { GAUGE_TICKS, formatLatency, formatMbps, mbpsToGaugeAngle } from "@/lib/speed-test";
import type { SpeedPhase } from "@/lib/speed-test";

export type GaugeMode = "download" | "upload";

interface SpeedGaugeProps {
  mbps: number;
  mode: GaugeMode;
  phase: SpeedPhase;
  pingMs?: number;
  active?: boolean;
  className?: string;
}

const CX = 120;
const CY = 108;
const R = 78;

function polar(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY - radius * Math.sin(rad) };
}

export function SpeedGauge({ mbps, mode, phase, pingMs, active = false, className }: SpeedGaugeProps) {
  const smoothMbps = useSmoothNumber(mbps, `${phase}-${mode}`);
  const needleAngle = mbpsToGaugeAngle(smoothMbps);
  const ticks = useMemo(() => GAUGE_TICKS, []);

  const showPing = phase === "latency";
  const display = showPing ? formatLatency(pingMs) : formatMbps(smoothMbps);
  const unit = showPing ? "ms" : `Mbps ${mode === "download" ? "↓" : "↑"}`;

  const tip = polar(needleAngle, R - 4);

  return (
    <div className={cn("flex w-full max-w-[280px] flex-col items-center", className)}>
      <svg viewBox="0 0 240 118" className="h-auto w-full" aria-hidden>
        <path
          d={describeArc(180, 0, R)}
          fill="none"
          stroke="rgb(var(--line))"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {ticks.map((tick, i) => {
          const angle = 180 - (i / (ticks.length - 1)) * 180;
          const outer = polar(angle, R + 5);
          const inner = polar(angle, R - (i % 2 === 0 ? 9 : 5));
          return (
            <line
              key={tick}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="rgb(var(--muted))"
              strokeWidth={i % 2 === 0 ? 2 : 1}
              opacity={0.7}
            />
          );
        })}

        {ticks.map((tick, i) => {
          const angle = 180 - (i / (ticks.length - 1)) * 180;
          const pos = polar(angle, R + 16);
          return (
            <text
              key={`label-${tick}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-faint text-[8px] font-medium"
            >
              {tick}
            </text>
          );
        })}

        <line
          x1={CX}
          y1={CY}
          x2={tip.x}
          y2={tip.y}
          stroke="rgb(var(--accent))"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={CX} cy={CY} r="5" fill="rgb(var(--accent))" />
        <circle cx={CX} cy={CY} r="2.5" fill="rgb(var(--bg))" />
      </svg>

      <div className="-mt-1 text-center">
        <p
          className={cn(
            "font-display text-4xl font-semibold tabular-nums tracking-tight text-ink",
            active && "text-accent",
            showPing && "text-amber-500",
          )}
        >
          {display}
        </p>
        <p className="mt-0.5 text-xs font-medium text-muted">{unit}</p>
      </div>
    </div>
  );
}

function describeArc(startAngle: number, endAngle: number, radius: number) {
  const start = polar(startAngle, radius);
  const end = polar(endAngle, radius);
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
}
