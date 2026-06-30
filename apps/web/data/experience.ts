import type { Accent } from "./projects";
import { content } from "./content";

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  period: string;
  current?: boolean;
  summary: string;
  contributions: string[];
  tech: string[];
  lesson: string;
  accent: Accent;
}

/** Sourced from data/content.json (the single source of truth). */
export const experience = content.experience as unknown as ExperienceItem[];
