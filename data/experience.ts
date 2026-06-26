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
    role: "Frontend Developer",
    location: "Remote",
    period: "May 2025 — Present",
    current: true,
    summary:
      "Building AI-driven product interfaces and high-performance Next.js apps for complex, real-world workflows.",
    contributions: [
      "Engineered an advanced chatbot interface using the Vercel AI SDK and Server-Sent Events.",
      "Built dynamic, adaptive UI that renders live tool calls, LLM actions and multi-step reasoning artifacts.",
      "Contributed to agentic solution architecture across voice bots and chatbots.",
      "Led frontend development of a high-performance job portal and career page with Next.js and MUI.",
    ],
    tech: ["Next.js", "React", "TypeScript", "Vercel AI SDK", "SSE", "MUI"],
    lesson: "Streaming UI needs first-class loading, partial, error and retry states — not just a happy path.",
    accent: "violet",
  },
  {
    id: "gigmo",
    company: "Gigmo Solutions",
    role: "Software Developer",
    location: "Gurugram, India",
    period: "June 2023 — April 2025",
    summary:
      "Owned real-time, money-critical surfaces: payments, low-latency chat and dynamic role-based access.",
    contributions: [
      "Led frontend design and development of a Payments module with React.js, Redux, TypeScript and backend APIs.",
      "Integrated SSE for real-time payment tracking.",
      "Built a scalable real-time chat application using WebSockets.",
      "Developed RBAC and dynamic permission management.",
      "Contributed to a recommendation system powered by prompt engineering and the ChatGPT API.",
    ],
    tech: ["React", "Redux", "TypeScript", "SSE", "WebSockets", "REST APIs"],
    lesson: "Real-time UX lives or dies on the edges — reconnects, ordering and honest delivery state.",
    accent: "accent",
  },
  {
    id: "wipro",
    company: "Wipro Technologies",
    role: "Project Engineer",
    location: "Remote",
    period: "September 2021 — May 2023",
    summary:
      "Built the reusable component and performance foundations for enterprise-scale React applications.",
    contributions: [
      "Built modular React components and integrated Redux for enterprise-scale applications.",
      "Improved UI consistency and user session duration.",
      "Enhanced performance and accessibility with WCAG-focused improvements.",
      "Converted complex wireframes into responsive React interfaces.",
    ],
    tech: ["React", "Redux", "JavaScript", "CSS3", "Accessibility"],
    lesson: "Consistency and accessibility compound — small component decisions scale across whole products.",
    accent: "blue",
  },
];
