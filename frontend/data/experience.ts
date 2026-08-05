import type { Accent } from "./projects";

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

export const experience: ExperienceItem[] = [
  {
    id: "velotio",
    company: "Velotio Technologies",
    role: "Software Engineer",
    location: "Remote",
    period: "May 2025 — Present",
    current: true,
    summary:
      "Building agentic AI platforms and full-stack product features — FastAPI services, SSE streaming, PostgreSQL-backed workflows, and adaptive React interfaces.",
    contributions: [
      "Delivered an agentic chatbot platform with FastAPI services, SSE-based streaming, and an adaptive React interface — users follow live tool calls, LLM actions, and multi-step reasoning in one experience.",
      "Improved visibility into voice bot and chatbot workflows with reusable UI components and authenticated backend APIs for OpenSearch results, guardrail feedback, evaluation outcomes, and PostgreSQL-backed datasets.",
      "Led end-to-end delivery of a job portal and careers platform using Next.js, FastAPI, PostgreSQL, SQLAlchemy, and Alembic — responsive candidate journeys, authenticated APIs, migrations, and SEO-optimized pages.",
    ],
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "FastAPI",
      "PostgreSQL",
      "SQLAlchemy",
      "Alembic",
      "Vercel AI SDK",
      "SSE",
      "OpenSearch",
    ],
    lesson: "Agentic UX needs the API and UI to tell the same story — streaming states, tool-call visibility, and server truth have to stay in sync.",
    accent: "violet",
  },
  {
    id: "gigmo",
    company: "Gigmo Solutions",
    role: "Software Development Engineer I (SDE-I)",
    location: "Gurugram, India",
    period: "June 2023 — April 2025",
    summary:
      "Owned money-critical and real-time product slices — payments, live chat, RBAC, and LLM-powered support recommendations across React frontends and FastAPI backends.",
    contributions: [
      "Led development of a real-time payments module with React.js, FastAPI, PostgreSQL, and SSE — backend APIs, transaction workflows, and live status updates across the payment lifecycle.",
      "Built a WebSocket-based chat system with message persistence, authentication, and role-based access control, securing workflows across frontend and backend services.",
      "Integrated LLM model APIs, prompt workflows, and backend services into a recommendation system that generated context-aware responses for customer-support interactions.",
    ],
    tech: [
      "React",
      "FastAPI",
      "PostgreSQL",
      "TypeScript",
      "SSE",
      "WebSockets",
      "JWT",
      "RBAC",
      "LLM APIs",
    ],
    lesson: "Real-time UX lives or dies on the edges — reconnects, ordering, auth boundaries, and honest delivery state on both client and server.",
    accent: "accent",
  },
  {
    id: "wipro",
    company: "Wipro Technologies",
    role: "Project Engineer",
    location: "Remote",
    period: "September 2021 — May 2023",
    summary:
      "Built reusable frontend foundations for enterprise React applications — component systems, Redux state, performance, and accessibility at scale.",
    contributions: [
      "Increased average user session duration by 2 minutes by building reusable React components and integrating Redux across enterprise applications, improving interface consistency and usability.",
      "Reduced page-load times by 15% through code optimization, lazy loading, and frontend performance improvements while achieving WCAG accessibility compliance.",
      "Delivered responsive, pixel-accurate interfaces from complex wireframes using React.js, Tailwind CSS, and Styled Components across browsers and devices.",
    ],
    tech: ["React", "Redux", "JavaScript", "Tailwind CSS", "Styled Components", "WCAG"],
    lesson: "Consistency and accessibility compound — small component and performance decisions scale across whole products.",
    accent: "blue",
  },
];
