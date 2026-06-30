import type { Accent } from "./projects";
import { content } from "./content";

export interface SkillGroup {
  id: string;
  title: string;
  /** Lucide icon key, mapped inside SkillGroupCard. */
  icon: string;
  description: string;
  /** "Used in …" line connecting the skills to real work. */
  usedIn: string;
  skills: string[];
  accent: Accent;
}

/** Sourced from data/content.json (the single source of truth). */
export const skillGroups = content.skills as unknown as SkillGroup[];
