import { links } from "./profile";

export interface MetaSection {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  /** ASCII diagram — rendered in a monospace block. */
  diagram?: string;
}

export const META_CASE_STUDY = {
  title: "Building JaiOS",
  subtitle: "A technical case study of this portfolio — architecture, trade-offs, and what I'd do differently.",
  github: `${links.github}/portfolioOS`,
  githubLabel: "github.com/jaisehgal26/portfolioOS",
  sections: [
    {
      id: "overview",
      title: "Overview — why an OS metaphor?",
      paragraphs: [
        "Most portfolios are a long scroll. JaiOS is the opposite: a desktop you explore — open apps, drag windows, search with Spotlight, discover easter eggs. The metaphor isn't decoration; it's a UX frame that lets me show product thinking, interaction design, and frontend craft in one surface.",
        "Recruiters get a memorable first impression. Engineers get a codebase they can actually read. Everyone gets a reason to stay longer than two minutes.",
      ],
    },
    {
      id: "architecture",
      title: "Architecture",
      paragraphs: [
        "JaiOS is a client-only shell on top of Next.js 15 App Router. There is no backend for the OS itself — every app is a React component, every window is state in Zustand, every animation is Framer Motion.",
      ],
      diagram: [
        "┌───────────────────────────────────────────────────┐",
        "│  Next.js App Router (app/page.tsx)                │",
        "│  ┌─────────────────────────────────────────────┐  │",
        "│  │  JaiOS shell (client)                       │  │",
        "│  │  TopBar · Dock · Desktop · WindowManager    │  │",
        "│  │              │                              │  │",
        "│  │              ▼                              │  │",
        "│  │  Zustand store (windows, theme, tour)       │  │",
        "│  │              │                              │  │",
        "│  │              ▼                              │  │",
        "│  │  App registry · Finder · Terminal · Cases   │  │",
        "│  └─────────────────────────────────────────────┘  │",
        "│  Serwist SW (prod) · static data in data/         │",
        "└───────────────────────────────────────────────────┘",
      ].join("\n"),
      bullets: [
        "Single-page OS: `components/os/JaiOS.tsx` orchestrates boot → login → desktop.",
        "Apps are lazy-free registry entries in `appRegistry.tsx` — add an app in three files.",
        "All portfolio content lives in `data/*.ts` — offline-safe, i18n-ready later.",
      ],
    },
    {
      id: "state",
      title: "State & persistence",
      paragraphs: [
        "Window management is the hardest part of a fake OS. Each window has position, size, z-index, minimized/maximized flags. Focus changes bump z-index so the active window always wins.",
      ],
      bullets: [
        "Zustand single store (`os-store.ts`) — no Redux boilerplate for a portfolio-scale app.",
        "`jaios-prefs` — theme, wallpaper, accent, sound, DND survive reloads.",
        "`jaios-session` — open windows + Finder section restore across refresh.",
        "`jaios-achievements` / `jaios-tour-done` — discovery progress without accounts.",
        "Drag + resize use pointer events on window chrome; snap zones for max / half-screen.",
      ],
    },
    {
      id: "performance",
      title: "Performance",
      bullets: [
        "Next.js `optimizePackageImports` for lucide-react and framer-motion — tree-shakes icon packs.",
        "Apps render only when opened; closed windows unmount content.",
        "PWA precaches the app shell via Serwist — repeat visits load from cache.",
        "Wallpaper + glass effects use CSS only — no canvas, no WebGL.",
        "First Load JS ~216 kB — acceptable for a rich interactive demo.",
      ],
    },
    {
      id: "offline",
      title: "Offline & PWA",
      paragraphs: [
        "Serwist service worker precaches static assets and the app shell. Install prompt + standalone mode make it feel like a real app on mobile.",
      ],
      bullets: [
        "Works offline: Finder, case studies, Terminal, achievements, changelog — all static data.",
        "Doesn't work offline: external iframes in Browser app, live API calls (none in core OS).",
        "Dedicated `~offline` fallback page when navigation fails without network.",
        "Browser app shows an offline guard instead of a broken iframe.",
      ],
    },
    {
      id: "accessibility",
      title: "Accessibility",
      bullets: [
        "`usePrefersReducedMotion` — disables boot animations, dock magnification, Framer transitions.",
        "Keyboard shortcuts: ⌘K Spotlight, ⌘1–4 quick apps, Esc closes overlays.",
        "ARIA on windows (`aria-label`), tour dialog (`role=\"dialog\"`), skip links on tour.",
        "Focus rings on interactive elements; semantic headings in every Finder section.",
        "Sound effects respect `soundEnabled` + Do Not Disturb.",
      ],
    },
    {
      id: "tradeoffs",
      title: "Trade-offs",
      bullets: [
        "Why not Electron? Zero install friction — it's a URL. Works on any device with a browser. Vercel deploys in seconds.",
        "Why Zustand over Context? Window state updates are frequent; Zustand avoids re-rendering the whole tree.",
        "Why manual changelog vs CMS? I ship iteratively — curated entries in `data/changelog.ts` prove consistency without infra.",
        "Why localStorage not a DB? No accounts, no server cost, no GDPR headaches. Achievements are fun, not competitive.",
        "What I'd add next: i18n (Hindi), drag-and-drop desktop files, ambient sound app.",
      ],
    },
  ] satisfies MetaSection[],
} as const;
