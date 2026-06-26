export const profile = {
  name: "Jai Sehgal",
  role: "Frontend Developer",
  location: "India",
  experience: "4.5+ years",
  available: "Available for frontend roles",

  headline: "Frontend developer crafting polished, real-time, product-ready web experiences.",
  supporting:
    "I'm a Frontend Developer with 4.5+ years of experience building Next.js, React, TypeScript and SSE/WebSocket-powered interfaces — dashboards, chat systems, payment flows, AI-driven UIs, and scalable product experiences.",

  about: [
    "I'm a frontend developer who enjoys building interfaces that feel clear, fast, and thoughtfully designed. My work usually sits around complex product flows — real-time dashboards, payment systems, chat interfaces, AI-driven UIs, admin platforms, and healthcare tools.",
    "I like taking messy product requirements and shaping them into clean, usable, responsive experiences. I care about the details users actually feel: speed, clarity, feedback, and flow.",
  ],

  aboutFacts: [
    "Based in India",
    "4.5+ years experience",
    "Frontend-focused",
    "Comfortable with product, design & backend teams",
  ],

  aboutIntro:
    "I'm a frontend developer who builds polished, responsive, real-world product interfaces. My work usually sits around complex product flows — real-time dashboards, payment systems, chat interfaces, AI-driven UIs, healthcare tools, admin platforms, and scalable React/Next.js applications.",

  highlights: [
    "4.5+ years of frontend experience",
    "Strong in Next.js, React, TypeScript",
    "Real-time UI using SSE and WebSockets",
    "AI-driven frontend interfaces",
    "Dashboards, payments, chat, RBAC, healthcare workflows",
    "Production-ready component systems",
  ],

  coreStack: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "Redux", "Zustand", "SSE", "WebSockets"],

  summary:
    "Frontend Developer with 4.5+ years of experience specializing in Next.js, React.js, TypeScript, JavaScript, Redux/Zustand, and scalable frontend systems. Skilled in real-time applications using WebSockets and SSE, REST/GraphQL integrations, testing, performance optimization, accessibility, and production-ready UI development.",

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
  resume: "/resume",
} as const;

export const site = {
  name: "Jai Sehgal",
  title: "Jai Sehgal — Frontend Developer",
  description:
    "Frontend Developer specializing in Next.js, React, TypeScript, real-time UI, dashboards, and scalable product interfaces.",
  url: "https://jaisehgalportfolio.vercel.app",
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
