import { content } from "./content";

export interface Note {
  id: string;
  title: string;
  updated: string;
  preview: string;
  body: string[];
}

/** Sourced from data/content.json (the single source of truth). */
export const notes = content.notes as unknown as Note[];
