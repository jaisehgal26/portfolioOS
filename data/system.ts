export interface Wallpaper {
  id: string;
  label: string;
  className: string;
}

export const WALLPAPERS: Wallpaper[] = [
  { id: "aurora", label: "Aurora", className: "wallpaper-aurora" },
  { id: "dawn", label: "Dawn", className: "wallpaper-dawn" },
  { id: "mist", label: "Mist", className: "wallpaper-mist" },
  { id: "meadow", label: "Meadow", className: "wallpaper-meadow" },
];

export interface AccentPreset {
  id: string;
  label: string;
  /** RGB channel triplets applied to --accent. */
  light: string;
  dark: string;
}

export const ACCENTS: AccentPreset[] = [
  { id: "terracotta", label: "Terracotta", light: "226 106 78", dark: "240 132 102" },
  { id: "blue", label: "Blue", light: "79 110 247", dark: "126 150 250" },
  { id: "violet", label: "Violet", light: "138 122 240", dark: "162 148 246" },
  { id: "mint", label: "Mint", light: "47 175 137", dark: "80 198 162" },
];

export const getWallpaperClass = (id: string) =>
  WALLPAPERS.find((w) => w.id === id)?.className ?? WALLPAPERS[0].className;

export const getAccentPreset = (id: string) =>
  ACCENTS.find((a) => a.id === id) ?? ACCENTS[0];
