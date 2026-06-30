"use client";

import type { ReactNode } from "react";
import { useBrowserStore, tabUrl } from "@jaios/kernel/browser-store";
import { isInternalUrl, parsePath } from "./lib/routes";
import { cn } from "@jaios/ui/utils";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectPage } from "./pages/ProjectPage";
import { ExperiencePage } from "./pages/ExperiencePage";
import { SkillsPage } from "./pages/SkillsPage";
import { NotesPage } from "./pages/NotesPage";
import { NotePage } from "./pages/NotePage";
import { ResumePage } from "./pages/ResumePage";
import { ContactPage } from "./pages/ContactPage";
import { SearchPage } from "./pages/SearchPage";
import { SettingsPage } from "./pages/SettingsPage";
import { BookmarksPage } from "./pages/BookmarksPage";
import { HistoryPage } from "./pages/HistoryPage";
import { DownloadsPage } from "./pages/DownloadsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ExternalPage } from "./pages/ExternalPage";

function renderPage(url: string): ReactNode {
  if (!isInternalUrl(url)) return <ExternalPage url={url} />;
  const path = parsePath(url);
  const [root, id] = path.split("/");
  switch (root) {
    case "":
    case "home":
      return <HomePage />;
    case "about":
      return <AboutPage />;
    case "projects":
      return id ? <ProjectPage id={id} /> : <ProjectsPage />;
    case "experience":
      return <ExperiencePage />;
    case "skills":
      return <SkillsPage />;
    case "notes":
      return id ? <NotePage id={id} /> : <NotesPage />;
    case "resume":
      return <ResumePage />;
    case "contact":
      return <ContactPage />;
    case "search":
      return <SearchPage q={id ? decodeURIComponent(id) : ""} />;
    case "settings":
      return <SettingsPage />;
    case "bookmarks":
      return <BookmarksPage />;
    case "history":
      return <HistoryPage />;
    case "downloads":
      return <DownloadsPage />;
    default:
      return <NotFoundPage url={url} />;
  }
}

export type Device = "desktop" | "tablet" | "mobile";
const DEVICE_WIDTH: Record<Device, number | null> = { desktop: null, tablet: 768, mobile: 390 };

export function Viewport({ device = "desktop" }: { device?: Device }) {
  const tabs = useBrowserStore((s) => s.tabs);
  const activeTabId = useBrowserStore((s) => s.activeTabId);
  const reloadKey = useBrowserStore((s) => s.reloadKey);
  const tab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  const url = tab ? tabUrl(tab) : "jai://home";
  const external = !isInternalUrl(url);
  const width = DEVICE_WIDTH[device];

  if (external) {
    return (
      <main className="relative min-h-0 flex-1 overflow-hidden bg-bg">
        <div key={`${url}-${reloadKey}`} className="h-full">
          {renderPage(url)}
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-0 flex-1 overflow-y-auto bg-bg">
      <div key={`${url}-${reloadKey}`} className={cn(width ? "flex justify-center bg-surface-2/60 p-4" : "")}>
        <div
          id="jai-page-root"
          className={cn(width ? "overflow-hidden rounded-2xl border border-line bg-bg shadow-card" : "w-full")}
          style={width ? { width, maxWidth: "100%" } : undefined}
        >
          {renderPage(url)}
        </div>
      </div>
    </main>
  );
}
