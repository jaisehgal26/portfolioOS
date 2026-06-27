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
  role: "Frontend Developer",
  location: "India",
  experience: `${EXP} years`,

  supporting: `I'm a Frontend Developer with ${EXP} years of experience building Next.js, React, TypeScript and SSE/WebSocket-powered interfaces — dashboards, chat systems, payment flows, AI-driven UIs, and scalable product experiences.`,

  aboutIntro:
    "I'm a frontend developer who builds polished, responsive, real-world product interfaces. My work usually sits around complex product flows — real-time dashboards, payment systems, chat interfaces, AI-driven UIs, healthcare tools, admin platforms, and scalable React/Next.js applications.",

  highlights: [
    `${EXP} years of frontend experience`,
    "Strong in Next.js, React, TypeScript",
    "Real-time UI using SSE and WebSockets",
    "AI-driven frontend interfaces",
    "Dashboards, payments, chat, RBAC, healthcare workflows",
    "Production-ready component systems",
  ],

  coreStack: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "Redux", "Zustand", "SSE", "WebSockets"],

  summary: `Frontend Developer with ${EXP} years of experience specializing in Next.js, React.js, TypeScript, JavaScript, Redux/Zustand, and scalable frontend systems. Skilled in real-time applications using WebSockets and SSE, REST/GraphQL integrations, testing, performance optimization, accessibility, and production-ready UI development.`,

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
  portfolio: "https://jaisehgalportfolio.vercel.app",
  portfolioLabel: "jaisehgalportfolio.vercel.app",
  resume: "/Jai_Sehgal_Resume.pdf",
  coverLetter: "/Jai_Sehgal_CoverLetter.pdf",
} as const;

export const site = {
  name: "Jai Sehgal",
  title: "Jai Sehgal — Frontend Developer",
  description:
    "Frontend Developer specializing in Next.js, React, TypeScript, real-time UI, dashboards, and scalable product interfaces.",
  url: "https://jaisehgalportfolio.vercel.app",
} as const;
