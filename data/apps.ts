import type { Accent } from "./projects";

export type AppId =
  | "quick-hire"
  | "about"
  | "resume"
  | "projects"
  | "case-studies"
  | "skills"
  | "experience"
  | "contact"
  | "finder"
  | "browser"
  | "notes"
  | "settings"
  | "ui-gallery"
  | "system-monitor"
  | "experiments"
  | "text-viewer"
  | "terminal"
  | "snake"
  | "secret"
  | "trash";

export type AppCategory = "favorites" | "career" | "case-studies" | "system" | "lab";

export interface AppMeta {
  id: AppId;
  name: string;
  shortName: string;
  /** Lucide icon key, mapped in AppIcon. */
  icon: string;
  accent: Accent;
  category: AppCategory;
  description: string;
  defaultSize: { w: number; h: number };
  inDock: boolean;
  onDesktop: boolean;
}

export const APPS: AppMeta[] = [
  {
    id: "quick-hire",
    name: "Quick Hire",
    shortName: "Quick Hire",
    icon: "zap",
    accent: "accent",
    category: "favorites",
    description: "Everything a recruiter needs in 30 seconds",
    defaultSize: { w: 860, h: 600 },
    inDock: false,
    onDesktop: false,
  },
  {
    id: "about",
    name: "About Jai",
    shortName: "About",
    icon: "user",
    accent: "violet",
    category: "favorites",
    description: "Who I am and what I build",
    defaultSize: { w: 760, h: 560 },
    inDock: false,
    onDesktop: false,
  },
  {
    id: "resume",
    name: "Resume",
    shortName: "Resume",
    icon: "fileText",
    accent: "blue",
    category: "favorites",
    description: "Interactive resume — summary, experience, skills",
    defaultSize: { w: 820, h: 580 },
    inDock: false,
    onDesktop: false,
  },
  {
    id: "projects",
    name: "Projects",
    shortName: "Projects",
    icon: "folderKanban",
    accent: "accent",
    category: "career",
    description: "Selected work with previews and details",
    defaultSize: { w: 880, h: 600 },
    inDock: false,
    onDesktop: false,
  },
  {
    id: "case-studies",
    name: "Case Studies",
    shortName: "Cases",
    icon: "bookOpen",
    accent: "amber",
    category: "case-studies",
    description: "Deep dives into how the work was built",
    defaultSize: { w: 880, h: 600 },
    inDock: false,
    onDesktop: false,
  },
  {
    id: "skills",
    name: "Skills",
    shortName: "Skills",
    icon: "blocks",
    accent: "mint",
    category: "career",
    description: "Tools grouped by how I use them",
    defaultSize: { w: 820, h: 580 },
    inDock: false,
    onDesktop: false,
  },
  {
    id: "experience",
    name: "Experience",
    shortName: "Experience",
    icon: "briefcase",
    accent: "blue",
    category: "career",
    description: "Career timeline and roles",
    defaultSize: { w: 840, h: 580 },
    inDock: false,
    onDesktop: false,
  },
  {
    id: "ui-gallery",
    name: "UI Gallery",
    shortName: "UI Gallery",
    icon: "palette",
    accent: "violet",
    category: "lab",
    description: "Real product UI states, polished",
    defaultSize: { w: 900, h: 600 },
    inDock: false,
    onDesktop: false,
  },
  {
    id: "contact",
    name: "Contact",
    shortName: "Contact",
    icon: "mail",
    accent: "accent",
    category: "favorites",
    description: "Get in touch",
    defaultSize: { w: 600, h: 520 },
    inDock: false,
    onDesktop: false,
  },
  {
    id: "finder",
    name: "Dossier",
    shortName: "Dossier",
    icon: "folder",
    accent: "accent",
    category: "system",
    description: "Browse everything — about, work, experience, skills and more",
    defaultSize: { w: 960, h: 640 },
    inDock: true,
    onDesktop: true,
  },
  {
    id: "browser",
    name: "Browser",
    shortName: "Browser",
    icon: "globe",
    accent: "blue",
    category: "system",
    description: "Preview the portfolio and demos",
    defaultSize: { w: 920, h: 620 },
    inDock: true,
    onDesktop: false,
  },
  {
    id: "notes",
    name: "Frontend Notes",
    shortName: "Notes",
    icon: "notebook",
    accent: "mint",
    category: "lab",
    description: "How I think about frontend",
    defaultSize: { w: 800, h: 540 },
    inDock: false,
    onDesktop: false,
  },
  {
    id: "experiments",
    name: "Experiments",
    shortName: "Experiments",
    icon: "flask",
    accent: "amber",
    category: "lab",
    description: "Small interactive frontend demos",
    defaultSize: { w: 880, h: 600 },
    inDock: false,
    onDesktop: false,
  },
  {
    id: "system-monitor",
    name: "System Monitor",
    shortName: "Monitor",
    icon: "activity",
    accent: "mint",
    category: "system",
    description: "Portfolio health and capabilities",
    defaultSize: { w: 760, h: 540 },
    inDock: false,
    onDesktop: false,
  },
  {
    id: "settings",
    name: "Settings",
    shortName: "Settings",
    icon: "settings",
    accent: "violet",
    category: "system",
    description: "Theme, mode, wallpaper and accent",
    defaultSize: { w: 800, h: 560 },
    inDock: true,
    onDesktop: false,
  },
  {
    id: "text-viewer",
    name: "Text Viewer",
    shortName: "Viewer",
    icon: "fileText",
    accent: "accent",
    category: "system",
    description: "Read a text file",
    defaultSize: { w: 680, h: 560 },
    inDock: false,
    onDesktop: false,
  },
  {
    id: "terminal",
    name: "Terminal",
    shortName: "Terminal",
    icon: "terminal",
    accent: "mint",
    category: "system",
    description: "A tiny shell — try `help`",
    defaultSize: { w: 720, h: 460 },
    inDock: true,
    onDesktop: false,
  },
  {
    id: "snake",
    name: "Snake",
    shortName: "Snake",
    icon: "gamepad2",
    accent: "mint",
    category: "lab",
    description: "A quick game of Snake",
    defaultSize: { w: 520, h: 620 },
    inDock: false,
    onDesktop: false,
  },
  {
    id: "secret",
    name: "Secret",
    shortName: "Secret",
    icon: "sparkles",
    accent: "violet",
    category: "lab",
    description: "You found something hidden",
    defaultSize: { w: 560, h: 540 },
    inDock: false,
    onDesktop: false,
  },
  {
    id: "trash",
    name: "Trash",
    shortName: "Trash",
    icon: "trash",
    accent: "accent",
    category: "system",
    description: "Files you removed from the desktop",
    defaultSize: { w: 560, h: 520 },
    inDock: true,
    onDesktop: false,
  },
];

export const getApp = (id: AppId): AppMeta => APPS.find((a) => a.id === id) ?? APPS[0];
