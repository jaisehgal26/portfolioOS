"use client";

import type { ReactNode } from "react";
import { useBrowserStore, tabUrl } from "@jaios/kernel/browser-store";
import { isInternalUrl, parsePath } from "./lib/routes";
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

export function Viewport() {
  const tabs = useBrowserStore((s) => s.tabs);
  const activeTabId = useBrowserStore((s) => s.activeTabId);
  const reloadKey = useBrowserStore((s) => s.reloadKey);
  const tab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  const url = tab ? tabUrl(tab) : "jai://home";
  const external = !isInternalUrl(url);

  return (
    <main className="relative min-h-0 flex-1 overflow-hidden bg-bg">
      <div key={`${url}-${reloadKey}`} className={external ? "h-full" : "h-full overflow-y-auto"}>
        {renderPage(url)}
      </div>
    </main>
  );
}
