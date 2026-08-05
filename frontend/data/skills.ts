import type { Accent } from "./projects";

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

/** Full-stack skill pillars — frontend and backend weighted equally. */
export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend Stack",
    icon: "code",
    description: "The client-side foundation for every product I ship.",
    usedIn: "QuickPad, FormForge, job portals, payment modules, and clinical dashboards.",
    skills: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3"],
    accent: "accent",
  },
  {
    id: "backend",
    title: "Backend Stack",
    icon: "server",
    description: "Server-side APIs, business logic and Python services.",
    usedIn: "QuickPad and FormForge — FastAPI services deployed on Vercel alongside Next.js.",
    skills: ["FastAPI", "Python", "REST APIs", "GraphQL", "Alembic", "Serverless functions"],
    accent: "blue",
  },
  {
    id: "ui",
    title: "UI Engineering",
    icon: "palette",
    description: "Design systems, editors and interaction-heavy interfaces.",
    usedIn: "FormForge builder, QuickPad editor, admin tools, and marketing sites.",
    skills: ["Tailwind CSS", "shadcn/ui", "MUI", "CodeMirror", "Styled Components", "@dnd-kit"],
    accent: "violet",
  },
  {
    id: "data",
    title: "Databases & State",
    icon: "database",
    description: "Persistent storage, caching and predictable client state.",
    usedIn: "Postgres schemas in FormForge, Redis in QuickPad, Redux/Zustand across client work.",
    skills: ["PostgreSQL", "Redis", "Neon", "Upstash", "Redux", "Zustand"],
    accent: "amber",
  },
  {
    id: "realtime",
    title: "Real-Time Systems",
    icon: "radio",
    description: "Live sync, streaming and event-driven product behaviour.",
    usedIn: "QuickPad (Yjs + WebSockets), payments, chat, dashboards, and streaming AI.",
    skills: ["WebSockets", "SSE", "Yjs", "Redis pub/sub", "Optimistic UI", "Reconnect states"],
    accent: "mint",
  },
  {
    id: "security",
    title: "Auth & Security",
    icon: "shield",
    description: "Sessions, access control and safe public endpoints.",
    usedIn: "QuickPad password notes, FormForge JWT auth, RBAC on healthcare and admin tools.",
    skills: ["JWT auth", "Argon2", "Rate limiting", "RBAC", "HttpOnly cookies", "Session unlock"],
    accent: "blue",
  },
  {
    id: "ai",
    title: "AI & Analytics",
    icon: "sparkles",
    description: "AI product surfaces, actionable analytics, and MCP-powered development for fast shipping.",
    usedIn: "Agentic chat UI, FormForge analytics, and faster full-stack shipping with Cursor MCPs and AI tooling.",
    skills: [
      "Vercel AI SDK",
      "ChatGPT API",
      "Streaming UI",
      "Cursor MCPs",
      "MCP integrations",
      "Recharts",
      "AI-assisted dev",
    ],
    accent: "violet",
  },
  {
    id: "testing",
    title: "Testing & Quality",
    icon: "flask",
    description: "Automated confidence across the stack before production.",
    usedIn: "pytest API suites and Playwright smoke tests on QuickPad and FormForge.",
    skills: ["pytest", "Playwright", "Jest", "React Testing Library", "Enzyme", "API test coverage"],
    accent: "mint",
  },
  {
    id: "devops",
    title: "Cloud & DevOps",
    icon: "rocket",
    description: "Shipping, hosting and the full delivery pipeline.",
    usedIn: "Every project — Vercel, Render, and Railway deployments, Neon Postgres, Upstash Redis, and CI/CD.",
    skills: ["Git", "GitHub", "Vercel", "Render", "Railway", "Upstash", "Neon", "CI/CD"],
    accent: "accent",
  },
];
