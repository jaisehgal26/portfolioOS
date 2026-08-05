/** First day on the job — experience is measured from here. */
export const EXPERIENCE_START = new Date(2021, 9, 1); // 1 Oct 2021 (month is 0-indexed)

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

const EXP = experienceYM();

export const profile = {
  name: "Jai Sehgal",
  role: "Software Engineer",
  location: "India",
  experience: `${EXP} years`,

  supporting: `I'm a Software Engineer with ${EXP} years of experience building full-stack products — Next.js and React on the surface, FastAPI and Postgres underneath, with real-time systems, auth, and AI-driven workflows shipped end to end.`,

  aboutIntro:
    "I'm a software engineer who ships complete product slices — not just screens. I work across UI, APIs, databases and deployment: real-time dashboards, payment flows, collaborative tools, form builders, healthcare ops, and agentic AI surfaces. I care about the seams where frontend state, server truth and auth have to agree.",

  highlights: [
    `${EXP} years building production software end to end`,
    "Full-stack delivery — Next.js, FastAPI, PostgreSQL, Redis",
    "Real-time systems — SSE, WebSockets, Yjs, pub/sub",
    "Auth & RBAC — JWT sessions, role-scoped APIs, public endpoints",
    "AI product surfaces — streaming agents, in-context suggestions",
    "Shipped on Vercel, Neon, Railway, Render",
  ],

  coreStack: [
    "Next.js",
    "React",
    "TypeScript",
    "FastAPI",
    "PostgreSQL",
    "Redis",
    "Tailwind CSS",
    "WebSockets",
  ],

  quote:
    "Software is a promise across every layer — the button, the API, the row in the database. My job is to engineer those layers so they still tell the same story when the network flakes, the model stalls, or three roles open the same screen.",
  quoteLabel: "On engineering systems that hold up",

  summary: `Software Engineer with ${EXP} years of experience across Next.js, React, TypeScript, FastAPI, PostgreSQL, and Redis. Builds real-time products with WebSockets and SSE, auth and RBAC, AI-assisted workflows, and production deployments on modern cloud platforms.`,

  education: {
    school: "Amity University",
    degree: "B.Tech, Computer Science & Engineering",
    location: "Gurugram, India",
    period: "2017 — 2021",
  },
} as const;

export const links = {
  email: "sehgaljai81@gmail.com",
  phone: "+91 9416102571",
  phoneHref: "tel:+919416102571",
  linkedin: "https://www.linkedin.com/in/jaisehgal26",
  linkedinLabel: "linkedin.com/in/jaisehgal26",
  github: "https://github.com/jaisehgal26",
  githubLabel: "github.com/jaisehgal26",
  portfolio: "https://jaisehgal.com",
  portfolioLabel: "jaisehgal.com",
  resume: "/Jai_Sehgal_Resume.pdf",
  coverLetter: "/Jai_Sehgal_CoverLetter.pdf",
  oldPortfolio: "https://oldportfolio.jaisehgal.com",
} as const;

export const site = {
  name: "Jai Sehgal",
  title: "Jai Sehgal — Software Engineer",
  description:
    "Software Engineer building full-stack products — Next.js, FastAPI, PostgreSQL, real-time systems, auth, and AI workflows.",
  tagline: "Software engineering, packaged as an operating system.",
  url: "https://jaisehgal.com",
} as const;

/** Single source of truth for search / social snippets (layout, JSON-LD, OG image). */
export const seo = {
  title: `${site.name} — Software Engineer`,
  titleWithPortfolio: `${site.name} — Software Engineer Portfolio`,
  description: `Jai Sehgal is a Software Engineer with ${EXP} years of experience building full-stack products — Next.js, FastAPI, PostgreSQL, real-time systems, auth, and AI workflows. Explore use cases and projects in an interactive OS-style portfolio (JaiOS).`,
  ogSubtitle: "Full-stack software engineer — Next.js, FastAPI, PostgreSQL, real-time systems, and AI workflows.",
  keywords: [
    "Jai Sehgal",
    "Jai Sehgal portfolio",
    "Software Engineer",
    "Full-stack developer",
    "Full-stack engineer",
    "Next.js",
    "FastAPI",
    "PostgreSQL",
    "TypeScript",
    "Python",
    "real-time systems",
    "WebSockets",
    "SSE",
    "JWT auth",
    "RBAC",
    "AI workflows",
    "JaiOS",
    "portfolio",
    "India",
  ],
} as const;
