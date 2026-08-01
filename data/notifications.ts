import { site } from "./profile";

export interface OSNotification {
  id: string;
  title: string;
  body?: string;
  icon?: string;
  read?: boolean;
  time?: string;
}

export const initialNotifications: OSNotification[] = [
  {
    id: "welcome",
    title: "Welcome to JaiOS",
    body: `${site.tagline} Open any app to explore.`,
    icon: "sparkles",
    time: "Just now",
  },
  {
    id: "search-tip",
    title: "Tip — quick search",
    body: "Press ⌘K / Ctrl K anytime to open Spotlight and jump anywhere.",
    icon: "search",
    time: "Just now",
  },
  {
    id: "resume",
    title: "Resume is ready",
    body: "Open the Resume app to view, print or download.",
    icon: "fileText",
    time: "Just now",
  },
  {
    id: "work",
    title: "Use cases",
    body: "Full-stack problems shipped for employers and clients — open Finder → Use cases.",
    icon: "folderKanban",
    time: "Just now",
  },
];
