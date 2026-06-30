import { content } from "./content";

export type ProjectPreview = "ai-chat" | "payments" | "chat" | "healthcare" | "inventory";
export type Accent = "accent" | "blue" | "violet" | "mint" | "amber";

export interface CaseStudy {
  overview: string;
  problem: string;
  role: string[];
  challenges: string[];
  uiStates: string[];
  architecture: string[];
  screens: string[];
  improved: string[];
  next: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  /** Short problem statement shown on the card. */
  summary: string;
  /** My contribution, one line. */
  contribution: string;
  stack: string[];
  /** Key frontend challenge, one line. */
  challenge: string;
  accent: Accent;
  preview: ProjectPreview;
  caseStudy: CaseStudy;
}

/** Sourced from data/content.json (the single source of truth). */
export const projects = content.projects as unknown as Project[];
