import { links } from "./profile";

export interface BrowserSite {
  id: string;
  title: string;
  /** Full URL including https:// */
  url: string;
  description?: string;
}

/**
 * Bookmarks shown on the JaiOS Browser start page. These open inside the
 * in-OS browser window (an iframe) so you can showcase live projects.
 *
 * 👉 ADD YOUR PROJECT LINKS HERE LATER.
 * Tip: sites deployed on Vercel / Netlify embed cleanly. Some third-party
 * sites block embedding (X-Frame-Options / CSP) — for those, the browser
 * shows an "Open in new tab" fallback automatically.
 */
export const browserSites: BrowserSite[] = [
  {
    id: "portfolio",
    title: "Portfolio",
    url: links.portfolio,
    description: "This portfolio — live on Vercel.",
  },
];
