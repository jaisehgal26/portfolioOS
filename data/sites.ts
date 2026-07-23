import { portfolioProjects } from "./project-portfolio";

export interface BrowserSite {
  id: string;
  title: string;
  /** Full URL including https:// */
  url: string;
  description?: string;
}

/** Live project demos — derived from Finder → Projects so links stay in sync. */
export const browserSites: BrowserSite[] = portfolioProjects
  .filter((p) => p.liveUrl)
  .map((p) => ({
    id: p.id,
    title: p.title,
    url: p.liveUrl!,
    description: p.overview,
  }));
