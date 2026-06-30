import content from "./content.json";

/** Single source of truth for all portfolio text. */
export { content };

/** First day on the job, parsed from content.json (month is 0-indexed). */
const [startY, startM, startD] = content.profile.experienceStart.split("-").map(Number);
export const EXPERIENCE_START = new Date(startY, startM - 1, startD);

/**
 * Experience as "years.months" (e.g. "4.8"), counted from EXPERIENCE_START.
 * Recomputed on every call so it stays current without manual edits.
 */
export function experienceYM(now: Date = new Date()): string {
  let months =
    (now.getFullYear() - EXPERIENCE_START.getFullYear()) * 12 +
    (now.getMonth() - EXPERIENCE_START.getMonth());
  if (now.getDate() < EXPERIENCE_START.getDate()) months -= 1;
  if (months < 0) months = 0;
  return `${Math.floor(months / 12)}.${months % 12}`;
}

/** Replace the {{years}} token in content strings with the live figure. */
export function withYears(text: string): string {
  return text.replace(/\{\{years\}\}/g, experienceYM());
}
