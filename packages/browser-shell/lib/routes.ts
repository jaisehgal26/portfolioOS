import { profile } from "@jaios/content/profile";
import { projects } from "@jaios/content/projects";
import { notes } from "@jaios/content/notes";
import { hostOf, normalizeUrl } from "@jaios/kernel/lib/url";
import { HOME_URL } from "@jaios/kernel/browser-store";

const SCHEME = "jai://";

/** Static internal routes and their tab titles. */
export const STATIC_TITLES: Record<string, string> = {
  "": "New Tab",
  home: "New Tab",
  about: `About — ${profile.name}`,
  projects: `Projects — ${profile.name}`,
  experience: `Experience — ${profile.name}`,
  skills: `Skills — ${profile.name}`,
  notes: `Notes — ${profile.name}`,
  resume: `Résumé — ${profile.name}`,
  contact: `Contact — ${profile.name}`,
  bookmarks: "Bookmarks",
  history: "History",
  downloads: "Downloads",
  settings: "Settings",
};

export function isInternalUrl(url: string): boolean {
  return url.startsWith(SCHEME);
}

/** The path after `jai://`, trailing slashes trimmed. */
export function parsePath(url: string): string {
  if (!isInternalUrl(url)) return "";
  return url.slice(SCHEME.length).replace(/\/+$/, "");
}

/** First segment of an internal path (e.g. "projects" from "projects/healthcare"). */
export function pathRoot(url: string): string {
  return parsePath(url).split("/")[0] ?? "";
}

export function isKnownInternalPath(path: string): boolean {
  if (path in STATIC_TITLES) return true;
  const [root, id] = path.split("/");
  if (root === "projects" && id) return projects.some((p) => p.id === id);
  if (root === "notes" && id) return notes.some((n) => n.id === id);
  if (root === "search") return true;
  return false;
}

/** Turn omnibox input into a navigable URL (internal route, external site, or search). */
export function inputToUrl(input: string): string {
  const v = input.trim();
  if (!v) return HOME_URL;
  if (v.startsWith(SCHEME)) return v;
  const path = v.replace(/^\/+/, "");
  if (isKnownInternalPath(path)) return `${SCHEME}${path}`;
  if (/^https?:\/\//i.test(v) || /\.[a-z]{2,}(\/|$|:)/i.test(v) || v === "localhost") return normalizeUrl(v);
  return `${SCHEME}search/${encodeURIComponent(v)}`;
}

/** Tab/title for any URL. */
export function resolveTitle(url: string): string {
  if (!isInternalUrl(url)) return hostOf(url) || url;
  const path = parsePath(url);
  if (path in STATIC_TITLES) return STATIC_TITLES[path];
  const [root, id] = path.split("/");
  if (root === "projects" && id) {
    const p = projects.find((x) => x.id === id);
    return p ? `${p.title} — ${profile.name}` : "Project not found";
  }
  if (root === "notes" && id) {
    const n = notes.find((x) => x.id === id);
    return n ? `${n.title} — ${profile.name}` : "Note not found";
  }
  if (root === "search" && id) return `Search: ${decodeURIComponent(id)}`;
  return "Page not found";
}
