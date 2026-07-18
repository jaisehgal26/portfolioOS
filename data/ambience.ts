export type AmbienceTrackId =
  | "off"
  | "rain"
  | "stream"
  | "night"
  | "fire"
  | "babble"
  | "steam"
  | "airplane"
  | "boat"
  | "bus"
  | "train";

export interface AmbienceTrack {
  id: AmbienceTrackId;
  label: string;
  summary: string;
  /** Lucide icon key — mapped in MusicApp */
  icon: string;
}

export const DEFAULT_AMBIENCE_VOLUME = 0.38;

export const AMBIENCE_TRACKS: AmbienceTrack[] = [
  { id: "rain", label: "Rain", summary: "Soft rainfall on a window", icon: "cloudRain" },
  { id: "stream", label: "Stream", summary: "Gentle flowing water", icon: "waves" },
  { id: "night", label: "Night", summary: "Crickets and a distant hum", icon: "moon" },
  { id: "fire", label: "Fire", summary: "Crackling campfire", icon: "flame" },
  { id: "babble", label: "Brook", summary: "Babbling creek over stones", icon: "droplets" },
  { id: "steam", label: "Steam", summary: "Kettle hiss and vapor", icon: "cloudFog" },
  { id: "airplane", label: "Airplane", summary: "Cabin drone at cruise", icon: "plane" },
  { id: "boat", label: "Boat", summary: "Engine hum and gentle waves", icon: "ship" },
  { id: "bus", label: "Bus", summary: "Idle engine rumble", icon: "bus" },
  { id: "train", label: "Train", summary: "Rhythmic rails and carriage sway", icon: "train" },
];

export function getAmbienceTrack(id: AmbienceTrackId): AmbienceTrack | undefined {
  if (id === "off") return undefined;
  return AMBIENCE_TRACKS.find((t) => t.id === id);
}
