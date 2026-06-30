"use client";

import { Monitor, Smartphone, Tablet } from "lucide-react";
import { cn } from "@jaios/ui/utils";
import type { Device } from "./Viewport";

const OPTIONS: [Device, typeof Monitor][] = [
  ["desktop", Monitor],
  ["tablet", Tablet],
  ["mobile", Smartphone],
];

export function DeviceToolbar({ device, setDevice }: { device: Device; setDevice: (d: Device) => void }) {
  return (
    <div className="hidden items-center rounded-full border border-line bg-surface-2 p-0.5 sm:flex">
      {OPTIONS.map(([d, Icon]) => (
        <button
          key={d}
          type="button"
          onClick={() => setDevice(d)}
          aria-label={`${d} view`}
          aria-pressed={device === d}
          className={cn(
            "grid h-7 w-7 place-items-center rounded-full transition-colors",
            device === d ? "bg-ink text-bg" : "text-muted hover:text-ink",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
