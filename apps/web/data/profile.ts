import { content, EXPERIENCE_START, experienceYM, withYears } from "./content";

// Re-exported so existing imports (`@/data/profile`) keep working.
export { EXPERIENCE_START, experienceYM };

const p = content.profile;

export const profile = {
  name: p.name,
  role: p.role,
  location: p.location,
  experience: `${experienceYM()} years`,
  supporting: withYears(p.supporting),
  aboutIntro: p.aboutIntro,
  highlights: p.highlights.map(withYears),
  coreStack: p.coreStack,
  summary: withYears(p.summary),
  education: p.education,
};

export const links = content.links;

export const site = content.site;
