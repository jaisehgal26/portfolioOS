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
    body: "Frontend craft, packaged as an operating system. Open any app to explore.",
    icon: "sparkles",
    time: "Just now",
  },
  {
    id: "quick-hire",
    title: "Tip — for recruiters",
    body: "Open Quick Hire for a 30-second overview of my profile.",
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
    title: "Selected Work",
    body: "Projects includes 5 case studies with previews and details.",
    icon: "folderKanban",
    time: "Just now",
  },
];
