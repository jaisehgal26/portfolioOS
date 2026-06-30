import { profile } from "@jaios/content/profile";
import { projects } from "@jaios/content/projects";
import { experience } from "@jaios/content/experience";
import { skillGroups } from "@jaios/content/skills";
import { notes } from "@jaios/content/notes";
import { parsePath } from "../lib/routes";

export type ResType = "doc" | "xhr" | "js" | "css" | "font" | "img";

export interface NetRequest {
  name: string;
  status: number;
  type: ResType;
  sizeKb: number;
  ms: number;
  /** Real JSON payload for xhr rows (shown in the Preview tab). */
  response?: unknown;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function sizeOf(value: unknown): number {
  return Math.max(0.3, Math.round((JSON.stringify(value).length / 1024) * 10) / 10);
}

/** A believable, deterministic request waterfall for a given page URL. */
export function buildRequests(url: string): NetRequest[] {
  const path = parsePath(url) || "home";
  const [root, id] = path.split("/");

  const base: NetRequest[] = [
    { name: url, status: 200, type: "doc", sizeKb: 11.4, ms: 38 },
    { name: "/_next/static/chunks/main-app.js", status: 200, type: "js", sizeKb: 142.1, ms: 96 },
    { name: "/_next/static/css/app.css", status: 200, type: "css", sizeKb: 36.8, ms: 52 },
    { name: "Fraunces.woff2", status: 200, type: "font", sizeKb: 63.2, ms: 71 },
    { name: "PlusJakartaSans.woff2", status: 200, type: "font", sizeKb: 58.9, ms: 66 },
    { name: "icon.svg", status: 200, type: "img", sizeKb: 1.1, ms: 22 },
  ];

  const api: NetRequest[] = [];
  const add = (name: string, response: unknown) =>
    api.push({ name, status: response === undefined ? 404 : 200, type: "xhr", sizeKb: sizeOf(response), ms: 64, response });

  switch (root) {
    case "about":
    case "resume":
      add("/api/profile.json", profile);
      break;
    case "projects":
      if (id) add(`/api/projects/${id}.json`, projects.find((p) => p.id === id));
      else add("/api/projects.json", projects);
      break;
    case "experience":
      add("/api/experience.json", experience);
      break;
    case "skills":
      add("/api/skills.json", skillGroups);
      break;
    case "notes":
      if (id) add(`/api/notes/${id}.json`, notes.find((n) => n.id === id));
      else add("/api/notes.json", notes.map((n) => ({ id: n.id, title: n.title })));
      break;
    default:
      add("/api/profile.json", profile);
  }

  return [...base, ...api].map((r) => ({ ...r, ms: r.ms + (hash(r.name) % 60) }));
}
