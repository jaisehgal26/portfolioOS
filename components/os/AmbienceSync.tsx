"use client";

import { useEffect } from "react";
import { useOSStore } from "@/store/os-store";
import { ambience } from "@/lib/ambience";

/** Keeps Web Audio ambience in sync with OS prefs — plays even when Music window is closed. */
export function AmbienceSync() {
  const hydrated = useOSStore((s) => s.hydrated);
  const track = useOSStore((s) => s.ambienceTrack);
  const volume = useOSStore((s) => s.ambienceVolume);
  const soundEnabled = useOSStore((s) => s.soundEnabled);
  const dnd = useOSStore((s) => s.dnd);

  useEffect(() => {
    if (!hydrated) return;
    ambience.setVolume(volume);
  }, [hydrated, volume]);

  useEffect(() => {
    if (!hydrated) return;
    const blocked = !soundEnabled || dnd;
    ambience.setMuted(blocked);
    if (!blocked) void ambience.setTrack(track);
    else if (track === "off") void ambience.setTrack("off");
  }, [hydrated, track, soundEnabled, dnd]);

  return null;
}
