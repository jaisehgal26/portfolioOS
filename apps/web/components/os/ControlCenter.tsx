"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BellOff, Check, Moon, Sun, SunDim, Volume2, VolumeX } from "lucide-react";
import { useOSStore } from "@/store/os-store";
import { WALLPAPERS, ACCENTS } from "@/data/system";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

function Tile({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-xs font-medium transition-colors",
        active
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-line bg-surface text-muted hover:text-ink",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

export function ControlCenter() {
  const open = useOSStore((s) => s.controlCenterOpen);
  const close = useOSStore((s) => s.closeControlCenter);
  const theme = useOSStore((s) => s.theme);
  const toggleTheme = useOSStore((s) => s.toggleTheme);
  const dnd = useOSStore((s) => s.dnd);
  const toggleDnd = useOSStore((s) => s.toggleDnd);
  const soundEnabled = useOSStore((s) => s.soundEnabled);
  const setSoundEnabled = useOSStore((s) => s.setSoundEnabled);
  const brightness = useOSStore((s) => s.brightness);
  const setBrightness = useOSStore((s) => s.setBrightness);
  const wallpaper = useOSStore((s) => s.wallpaper);
  const setWallpaper = useOSStore((s) => s.setWallpaper);
  const accent = useOSStore((s) => s.accent);
  const setAccent = useOSStore((s) => s.setAccent);
  const reduced = usePrefersReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <>
          <button
            aria-label="Close control center"
            tabIndex={-1}
            onClick={close}
            className="fixed inset-0 z-[60] cursor-default"
          />
          <motion.aside
            aria-label="Control center"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: reduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong fixed right-2.5 top-12 z-[70] w-[min(20rem,calc(100vw-1.25rem))] space-y-3 rounded-3xl p-4 shadow-window"
          >
            <div className="grid grid-cols-3 gap-2">
              <Tile
                active={theme === "dark"}
                onClick={toggleTheme}
                icon={theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                label="Dark"
              />
              <Tile
                active={dnd}
                onClick={toggleDnd}
                icon={<BellOff className="h-5 w-5" />}
                label="Focus"
              />
              <Tile
                active={soundEnabled}
                onClick={() => setSoundEnabled(!soundEnabled)}
                icon={soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                label="Sound"
              />
            </div>

            <div className="rounded-2xl border border-line bg-surface p-3.5">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-faint">
                <SunDim className="h-4 w-4" /> Brightness
              </div>
              <input
                type="range"
                min={40}
                max={100}
                value={Math.round(brightness * 100)}
                onChange={(e) => setBrightness(Number(e.target.value) / 100)}
                aria-label="Brightness"
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-accent"
              />
            </div>

            <div className="rounded-2xl border border-line bg-surface p-3.5">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-faint">Wallpaper</p>
              <div className="grid grid-cols-4 gap-2">
                {WALLPAPERS.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWallpaper(w.id)}
                    aria-label={w.label}
                    aria-pressed={wallpaper === w.id}
                    className={cn(
                      "h-9 overflow-hidden rounded-lg border-2 transition-colors",
                      wallpaper === w.id ? "border-accent" : "border-line hover:border-line-strong",
                    )}
                  >
                    <span className={cn("block h-full w-full", w.className)} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-line bg-surface p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-faint">Accent</p>
              <div className="flex gap-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAccent(a.id)}
                    aria-label={a.label}
                    aria-pressed={accent === a.id}
                    className={cn(
                      "grid h-6 w-6 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-surface transition-transform hover:scale-110",
                      accent === a.id ? "ring-ink/40" : "ring-transparent",
                    )}
                    style={{ background: `rgb(${theme === "dark" ? a.dark : a.light})` }}
                  >
                    {accent === a.id && <Check className="h-3 w-3 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
