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

export const skillGroups: SkillGroup[] = [
  {
    id: "core",
    title: "Core Frontend",
    icon: "code",
    description: "The foundation I build every product on.",
    usedIn: "Used across every project — from job portals to clinical dashboards.",
    skills: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3"],
    accent: "accent",
  },
  {
    id: "styling",
    title: "Styling & UI",
    icon: "palette",
    description: "Design systems and pixel-careful component styling.",
    usedIn: "Used to ship consistent, responsive UI across admin tools and marketing sites.",
    skills: ["Tailwind CSS", "MUI", "Styled Components", "Bootstrap", "shadcn/ui"],
    accent: "violet",
  },
  {
    id: "state",
    title: "State & Data",
    icon: "database",
    description: "Predictable state and data flow at scale.",
    usedIn: "Used for payment stores, inventory tables and cached dashboard data.",
    skills: ["Redux", "Zustand", "React Query", "SWR", "TanStack"],
    accent: "blue",
  },
  {
    id: "realtime",
    title: "Real-Time UX",
    icon: "radio",
    description: "Live, event-driven interfaces that stay correct.",
    usedIn: "Used for payment tracking, chat systems, live dashboards and streaming AI.",
    skills: ["WebSockets", "SSE", "Optimistic UI", "Reconnect states", "Event-driven updates"],
    accent: "mint",
  },
  {
    id: "api",
    title: "API Integration",
    icon: "plug",
    description: "Connecting UI to data cleanly and resiliently.",
    usedIn: "Used to integrate product, payment and clinical back ends.",
    skills: ["REST APIs", "GraphQL", "Axios"],
    accent: "amber",
  },
  {
    id: "ai",
    title: "AI Product UI",
    icon: "sparkles",
    description: "Turning AI workflows into interfaces people can read.",
    usedIn: "Used to build streaming chat, tool-call rendering and reasoning timelines.",
    skills: ["Vercel AI SDK", "ChatGPT API", "Streaming UI patterns"],
    accent: "violet",
  },
  {
    id: "testing",
    title: "Testing",
    icon: "flask",
    description: "Confidence to ship and change safely.",
    usedIn: "Used to lock behaviour on critical flows and shared components.",
    skills: ["Jest", "React Testing Library", "Enzyme"],
    accent: "blue",
  },
  {
    id: "delivery",
    title: "Delivery",
    icon: "rocket",
    description: "From commit to production, reliably.",
    usedIn: "Used to ship and preview every project on Vercel & Netlify.",
    skills: ["Git", "GitHub", "Vercel", "Netlify", "CI/CD"],
    accent: "accent",
  },
  {
    id: "tools",
    title: "Tools",
    icon: "wrench",
    description: "A fast, modern day-to-day workflow.",
    usedIn: "Used to move quickly without cutting corners on quality.",
    skills: ["Cursor IDE", "GitHub Copilot", "ChatGPT", "Postman"],
    accent: "mint",
  },
];
