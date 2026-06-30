import { links } from "@jaios/content/profile";
import type { Bookmark } from "@jaios/kernel/browser-store";

/** Seeded once into the browser store (internal pages + external links). */
export const DEFAULT_BOOKMARKS: Bookmark[] = [
  { id: "bm-about", label: "About", url: "jai://about" },
  { id: "bm-projects", label: "Projects", url: "jai://projects" },
  { id: "bm-experience", label: "Experience", url: "jai://experience" },
  { id: "bm-skills", label: "Skills", url: "jai://skills" },
  { id: "bm-resume", label: "Résumé", url: "jai://resume" },
  { id: "bm-contact", label: "Contact", url: "jai://contact" },
  { id: "bm-github", label: "GitHub", url: links.github },
  { id: "bm-linkedin", label: "LinkedIn", url: links.linkedin },
];
