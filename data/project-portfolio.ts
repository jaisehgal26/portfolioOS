import type { Accent, ProjectPreview } from "./projects";

/**
 * Showcase projects in Finder → Projects.
 * Same card style as Work, but with public GitHub repos and live demos.
 *
 * Work tab  = professional modules built for employers / clients (no public links).
 * Projects  = things you can actually show — code + live URL.
 *
 * 👉 ADD YOUR PROJECTS HERE.
 * - githubUrl  → opens in a new browser tab
 * - liveUrl    → opens in the in-OS Browser app (iframe)
 */
export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  /** Short overview — what it is and what you built. */
  overview: string;
  /** Key things you built — you own the whole project. */
  highlights: string[];
  challenges: string[];
  impact: string[];
  stack: string[];
  accent: Accent;
  preview: ProjectPreview;
  /** Full GitHub repo URL — opens in a new tab. */
  githubUrl?: string;
  /** Deployed demo URL — opens in the in-app browser. */
  liveUrl?: string;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "quickpad",
    title: "QuickPad",
    category: "Privacy-Focused Collaborative Notepad",
    overview:
      "A no-signup, URL-based collaborative notepad — share notes through custom or randomly generated links, with real-time multi-user editing and privacy controls.",
    highlights: [
      "Built the full stack with Next.js, TypeScript, CodeMirror, Tailwind CSS, FastAPI, PostgreSQL, and Redis.",
      "Implemented real-time editing with Yjs and WebSockets, using Redis pub/sub for multi-instance sync.",
      "Added password-protected and read-only notes with Argon2 hashing, JWT session unlock, and rate limiting.",
      "Wrote pytest API tests and Playwright end-to-end smoke tests.",
    ],
    challenges: [
      "Keeping conflict-free sync across users, server instances, and reconnects.",
      "Offline IndexedDB recovery and persistent autosave without losing collaborative state.",
      "Secure sharing (password protection, read-only links, soft-delete expiration) without requiring accounts.",
    ],
    impact: [
      "Frictionless collaboration — open a link and start editing, no signup required.",
      "Production-grade real-time sync with automatic reconnection and offline resilience.",
      "Privacy-first sharing models backed by automated test coverage.",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "CodeMirror",
      "Tailwind CSS",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "Yjs",
      "WebSockets",
    ],
    accent: "violet",
    preview: "notepad",
    githubUrl: "https://github.com/jaisehgal26/quickpad",
    liveUrl: "https://quickpad.jaisehgal.com",
  },
  {
    id: "old-portfolio",
    title: "Old Portfolio",
    category: "Personal Site",
    overview:
      "My previous personal portfolio — a single-page Next.js site with scroll-based sections for about, services, skills, resume, testimonials, and contact, deployed on Vercel.",
    highlights: [
      "Built the full frontend with Next.js App Router, React 18, and TypeScript.",
      "Designed a dark, gold-accented single-page layout with Bootstrap 5 and custom CSS.",
      "Added scroll animations (AOS), a GSAP-powered custom cursor on desktop, and a typewriter hero.",
      "Structured resume content as animated timelines for experience, education, and projects.",
      "Integrated FormSubmit for contact, one-click resume download, and Vercel Analytics.",
    ],
    challenges: [
      "Keeping animations and the custom cursor smooth without hurting mobile performance — the cursor is disabled on screens ≤768px.",
      "Making long single-page sections (resume timeline, skills, services) easy to scan on smaller screens.",
      "Balancing visual polish with fast load times and solid SEO metadata.",
    ],
    impact: [
      "Served as my primary portfolio for recruiter and client outreach.",
      "Demonstrated real-world Next.js, TypeScript, Bootstrap, and animation library integration.",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Bootstrap",
      "AOS",
      "GSAP",
      "Vercel",
    ],
    accent: "blue",
    preview: "portfolio",
    githubUrl: "https://github.com/jaisehgal26/oldportfolio",
    liveUrl: "https://oldportfolio.jaisehgal.com",
  },
  // Copy the block above to add more showcase projects.
];
