export type AchievementTier = "bronze" | "silver" | "gold";

export type AchievementId =
  | "first-boot"
  | "spotlight-user"
  | "secret-finder"
  | "signal-clear"
  | "full-clearance"
  | "return-agent"
  | "kernel-panic"
  | "snake-charmer"
  | "piano-virtuoso"
  | "offline-operator"
  | "installed"
  | "changelog-reader"
  | "command-master"
  | "explorer"
  | "night-owl"
  | "wallpaper-artist"
  | "tour-complete"
  | "konami-code"
  | "speed-typist"
  | "tile-master"
  | "archive-diver"
  | "classified-access"
  | "og-inspector";

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  tier: AchievementTier;
  hidden: boolean;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-boot",
    title: "First Boot",
    description: "Logged into JaiOS for the first time.",
    tier: "bronze",
    hidden: false,
    icon: "🚀",
  },
  {
    id: "spotlight-user",
    title: "Spotlight User",
    description: "Opened Spotlight search.",
    tier: "bronze",
    hidden: false,
    icon: "🔍",
  },
  {
    id: "explorer",
    title: "Explorer",
    description: "Opened 6 different apps in one session.",
    tier: "bronze",
    hidden: false,
    icon: "🗺️",
  },
  {
    id: "changelog-reader",
    title: "Ship Log",
    description: "Opened the Changelog timeline.",
    tier: "bronze",
    hidden: false,
    icon: "📜",
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Switched to dark theme.",
    tier: "bronze",
    hidden: false,
    icon: "🌙",
  },
  {
    id: "wallpaper-artist",
    title: "Wallpaper Artist",
    description: "Changed the desktop wallpaper.",
    tier: "bronze",
    hidden: false,
    icon: "🎨",
  },
  {
    id: "tour-complete",
    title: "Tour Graduate",
    description: "Completed the recruiter guided tour.",
    tier: "bronze",
    hidden: false,
    icon: "🧭",
  },
  {
    id: "snake-charmer",
    title: "Snake Charmer",
    description: "Scored 10+ in Snake.",
    tier: "silver",
    hidden: false,
    icon: "🐍",
  },
  {
    id: "piano-virtuoso",
    title: "Piano Virtuoso",
    description: "Reached round 8 in Piano Echo.",
    tier: "silver",
    hidden: false,
    icon: "🎹",
  },
  {
    id: "offline-operator",
    title: "Offline Operator",
    description: "Opened an app while offline.",
    tier: "silver",
    hidden: false,
    icon: "📡",
  },
  {
    id: "command-master",
    title: "Command Master",
    description: "Ran 8 unique Terminal commands.",
    tier: "silver",
    hidden: false,
    icon: "⌨️",
  },
  {
    id: "installed",
    title: "Installed",
    description: "Added JaiOS to your home screen.",
    tier: "gold",
    hidden: false,
    icon: "📲",
  },
  {
    id: "secret-finder",
    title: "Secret Finder",
    description: "Discovered the classified folder.",
    tier: "bronze",
    hidden: true,
    icon: "✨",
  },
  {
    id: "return-agent",
    title: "Return Agent",
    description: "Came back to the secret folder.",
    tier: "silver",
    hidden: true,
    icon: "🕵️",
  },
  {
    id: "signal-clear",
    title: "Signal Clear",
    description: "Decoded the intercepted transmission.",
    tier: "silver",
    hidden: true,
    icon: "📻",
  },
  {
    id: "full-clearance",
    title: "Full Clearance",
    description: "Declassified every dossier line.",
    tier: "gold",
    hidden: true,
    icon: "🛡️",
  },
  {
    id: "kernel-panic",
    title: "Kernel Panic",
    description: "Triggered a catastrophic rm -rf /.",
    tier: "gold",
    hidden: true,
    icon: "💥",
  },
  {
    id: "konami-code",
    title: "Konami Code",
    description: "Entered the classic cheat sequence.",
    tier: "gold",
    hidden: true,
    icon: "🎮",
  },
  {
    id: "speed-typist",
    title: "Speed Typist",
    description: "Typed 60+ WPM in the typing test.",
    tier: "silver",
    hidden: false,
    icon: "⌨️",
  },
  {
    id: "tile-master",
    title: "Tile Master",
    description: "Reached the 2048 tile.",
    tier: "gold",
    hidden: false,
    icon: "🧩",
  },
  {
    id: "archive-diver",
    title: "Archive Diver",
    description: "Opened the Archive folder in Files.",
    tier: "bronze",
    hidden: false,
    icon: "📦",
  },
  {
    id: "classified-access",
    title: "Classified Access",
    description: "Found the hidden .classified folder.",
    tier: "silver",
    hidden: true,
    icon: "🔐",
  },
  {
    id: "og-inspector",
    title: "OG Inspector",
    description: "Ran a link preview in the OG app.",
    tier: "bronze",
    hidden: false,
    icon: "🔗",
  },
];

export const ACHIEVEMENTS_BY_ID = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
) as Record<AchievementId, Achievement>;

export const TIER_ORDER: AchievementTier[] = ["gold", "silver", "bronze"];
