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
  | "experiments";

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
    inDock: true,
    onDesktop: true,
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
    inDock: true,
    onDesktop: true,
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
    inDock: true,
    onDesktop: true,
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
    inDock: true,
    onDesktop: true,
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
    inDock: true,
    onDesktop: true,
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
    inDock: true,
    onDesktop: true,
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
    inDock: true,
    onDesktop: true,
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
    inDock: true,
    onDesktop: true,
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
    inDock: true,
    onDesktop: true,
  },
  {
    id: "finder",
    name: "Portfolio Files",
    shortName: "Files",
    icon: "folder",
    accent: "amber",
    category: "system",
    description: "Browse the portfolio as files and folders",
    defaultSize: { w: 860, h: 560 },
    inDock: true,
    onDesktop: false,
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
];

export const getApp = (id: AppId): AppMeta => APPS.find((a) => a.id === id) ?? APPS[0];
