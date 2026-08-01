import type { AppId } from "./apps";

export type ChangelogTag = "feature" | "fix" | "pwa" | "easter-egg" | "polish" | "system";

export type ChangelogFilter = "all" | ChangelogTag | "features" | "fixes" | "easter-eggs";

export interface ChangelogEntry {
  id: string;
  date: string;
  version: string;
  title: string;
  tags: ChangelogTag[];
  summary: string;
  body: string[];
  why?: string;
  relatedApp?: AppId;
}

/** Newest first — append new ships at the top. */
export const CHANGELOG: ChangelogEntry[] = [
  {
    id: "use-cases",
    date: "2026-07-23",
    version: "1.14.0",
    title: "Use cases — problem domains at work",
    tags: ["feature", "system"],
    summary:
      "Eight use-case cards in Finder — streaming agents, payments, RBAC, live messaging, clinical ops, and more.",
    body: [
      "Finder → Use cases: narrative cards for professional work — UI, APIs, data, and auth in each story.",
      "Domains covered: agentic streaming UX, payment settlement, RBAC, real-time chat, healthcare ops, admin bulk tools, job portals, AI in-product.",
      "Spotlight, shortcuts, notifications, and guided tour link here directly.",
      "Kept separate from Projects — no public repo or live-demo links on these cards.",
    ],
    why: "Shows how I think about production problems without exposing client-specific URLs.",
    relatedApp: "finder",
  },
  {
    id: "projects-showcase",
    date: "2026-07-23",
    version: "1.13.0",
    title: "Projects — GitHub repos & live demos",
    tags: ["feature"],
    summary:
      "Finder → Projects: QuickPad, FormForge, and Old Portfolio — previews, stack, GitHub, and in-app live demo.",
    body: [
      "Each card: highlights, challenges, impact, and stack — same depth as use cases, with public links.",
      "GitHub opens in a new tab; Live demo opens in the in-app Browser.",
      "Browser bookmarks auto-populated from project live URLs.",
      "Mini previews for portfolio, notepad, and formbuilder mockups.",
    ],
    why: "Code and a running demo beat a bullet list — click through when you want proof.",
    relatedApp: "finder",
  },
  {
    id: "piano-app",
    date: "2026-07-19",
    version: "1.12.0",
    title: "Piano — keyboard & Echo game",
    tags: ["feature", "easter-egg"],
    summary: "Playable piano with keyboard bindings plus a Simon-style Echo memory game.",
    body: [
      "One octave (C4–C5) — click keys or use A–K / W E T Y U for sharps.",
      "Echo game: repeat growing melodies; Piano Virtuoso achievement at round 8.",
      "Web Audio synthesis — respects the master Sound toggle.",
    ],
    why: "Another lab toy like Snake — shows Web Audio and playful interaction.",
    relatedApp: "piano",
  },
  {
    id: "music-ambience",
    date: "2026-07-19",
    version: "1.11.0",
    title: "Music — focus ambience",
    tags: ["feature"],
    summary: "Synthesized background sounds — rain, stream, fire, travel, and more. No audio files to ship.",
    body: [
      "10 ambience tracks: Rain, Stream, Night, Fire, Brook, Steam, Airplane, Boat, Bus, Train.",
      "Web Audio synthesis — loops in the browser, volume slider, persists across reloads.",
      "Respects Sound toggle and Focus (DND). Keeps playing when the Music window is closed.",
    ],
    why: "OS atmosphere for focus — extends the existing sound engine without heavy assets.",
    relatedApp: "music",
  },
  {
    id: "knowledge",
    date: "2026-07-19",
    version: "1.10.0",
    title: "Knowledge — tool recommendations",
    tags: ["feature"],
    summary: "Curated recommendations for CSS, frameworks, AI libraries, AI dev tools (Cursor, v0, Bolt…), dev tools, and Chrome extensions.",
    body: [
      "7 sections: CSS, CSS frameworks, AI libraries, AI tools, dev tools, Chrome extensions, workflow tools.",
      "Each item has a personal “why I recommend it” note plus links.",
      "30 picks including Cursor, v0, Bolt, CodeRabbit, Tailwind, Vercel AI SDK, React DevTools, and more.",
    ],
    why: "Knowledge sharing — the tools and libraries behind how I actually build.",
    relatedApp: "knowledge",
  },
  {
    id: "shortcuts-plus",
    date: "2026-07-19",
    version: "1.9.0",
    title: "Keyboard shortcuts++",
    tags: ["feature", "polish"],
    summary: "Searchable, categorized shortcuts panel — 18 bindings, platform-aware labels.",
    body: [
      "Shortcuts moved to data/shortcuts.ts with Navigation, Windows, Apps, System groups.",
      "Live search filter; ⌘ vs Ctrl based on platform.",
      "Documents F3, app switcher, window close/minimize, Finder jumps, Spotlight arrows.",
    ],
    why: "Power users and recruiters who press keys notice polish.",
    relatedApp: "settings",
  },
  {
    id: "meta-case-study",
    date: "2026-07-19",
    version: "1.8.0",
    title: "Building JaiOS — meta case study",
    tags: ["feature", "system"],
    summary: "Technical write-up of the portfolio itself — architecture, state, PWA, trade-offs.",
    body: [
      "New Finder section: Building JaiOS with 7 chapters.",
      "ASCII architecture diagram, GitHub source link, offline static content.",
      "Covers Zustand, Serwist, accessibility, and why-not-Electron decisions.",
    ],
    why: "Senior engineering signal — I can explain my own system design, not just ship features.",
    relatedApp: "finder",
  },
  {
    id: "guided-tour",
    date: "2026-07-19",
    version: "1.7.0",
    title: "Recruiter guided tour",
    tags: ["feature", "polish"],
    summary: "60-second spotlight walkthrough — Finder, Spotlight, work, contact, and easter egg.",
    body: [
      "8-step tour with dim overlay, spotlight highlights, progress dots, Back / Next / Skip.",
      "CTAs on login screen, Help menu, and first-visit dismissible banner.",
      "Persists completion in localStorage; unlocks Tour Graduate achievement.",
      "Respects reduced-motion preferences for transitions.",
    ],
    why: "Recruiters often spend under two minutes — the tour controls the narrative.",
    relatedApp: "finder",
  },
  {
    id: "achievements",
    date: "2026-07-19",
    version: "1.6.0",
    title: "Achievement system",
    tags: ["feature", "easter-egg"],
    summary: "15 unlockable badges — discovery, Terminal, Secret, Snake, PWA, and more.",
    body: [
      "OS-wide achievements with bronze / silver / gold tiers.",
      "Unlock triggers: login, Spotlight, Secret clearance, kernel panic, Snake 10+, offline, install.",
      "Activity Monitor shows full badge grid; Terminal achievements command lists progress.",
      "sysinfo now prints live system stats — distinct from neofetch ASCII art.",
    ],
    why: "Rewards curiosity across the OS — Secret, Terminal, and PWA feel connected, not random.",
    relatedApp: "system-monitor",
  },
  {
    id: "terminal-commands",
    date: "2026-07-19",
    version: "1.5.1",
    title: "Terminal command expansion",
    tags: ["feature", "polish"],
    summary: "Portfolio CLI — skills, projects, theme, wallpaper, neofetch, changelog.",
    body: [
      "Grouped help: navigation, portfolio, system, and fun commands.",
      "skills [--filter], projects, contact, theme, wallpaper.",
      "neofetch ASCII banner; sysinfo live system readout.",
      "changelog prints last 3 ships; achievements lists all badges.",
    ],
    why: "Terminal is a memorable way to explore the portfolio — CLI UX without a backend.",
    relatedApp: "terminal",
  },
  {
    id: "changelog-app",
    date: "2026-07-19",
    version: "1.5.0",
    title: "Changelog timeline",
    tags: ["feature", "system"],
    summary: "This app — a shipped history of JaiOS, filterable by tag.",
    body: [
      "Standalone Changelog window with vertical timeline UI.",
      "Filter chips: All, Features, Fixes, Easter eggs, PWA, Polish.",
      "Expandable cards with “why it matters” and links to related apps.",
      "Available from Launchpad and Spotlight.",
    ],
    why: "Shows I ship iteratively and document my own work — not a one-and-done portfolio.",
    relatedApp: "launchpad",
  },
  {
    id: "pwa-offline",
    date: "2026-07-19",
    version: "1.4.0",
    title: "Offline-first PWA",
    tags: ["feature", "pwa"],
    summary: "Serwist service worker, install prompt, offline guards.",
    body: [
      "Precache app shell, JS, CSS, icons, and PDFs via Serwist.",
      "Install prompt for desktop/Android; iOS Add to Home Screen hint.",
      "Update banner when a new service worker is waiting.",
      "Browser and quote widget degrade gracefully offline.",
      "Top bar offline indicator.",
    ],
    why: "The OS metaphor only works if the OS boots without Wi‑Fi after one visit.",
    relatedApp: "settings",
  },
  {
    id: "secret-v2",
    date: "2026-07-18",
    version: "1.3.2",
    title: "Secret folder — signal tuner & dossier",
    tags: ["easter-egg", "polish"],
    summary: "Classified clearance game: decode a transmission, unredact dossier lines.",
    body: [
      "Frequency slider decodes a hidden message at ~73 MHz.",
      "Tap-to-reveal personnel file with dev confessions.",
      "4-tier clearance meter persisted in localStorage.",
      "Camouflaged sparkle button on desktop (bottom-left).",
    ],
    why: "Rewards curiosity — an engineering superpower I want on my team.",
    relatedApp: "secret",
  },
  {
    id: "desktop-widgets",
    date: "2026-07-15",
    version: "1.3.1",
    title: "Desktop widgets",
    tags: ["polish"],
    summary: "Mechanical clock and thought-of-the-day quote on the desktop.",
    body: [
      "SVG watch dial with sweeping second hand in the menu bar and widget.",
      "Local-only quote rotation — no external API dependency.",
      "Glass-style widget cards pinned to the desktop (lg+).",
    ],
    why: "Small craft details that make the desktop feel lived-in.",
    relatedApp: "clock",
  },
  {
    id: "system-monitor",
    date: "2026-07-10",
    version: "1.3.0",
    title: "System Monitor",
    tags: ["feature"],
    summary: "Portfolio health framed as a fake system monitor.",
    body: [
      "CPU-style process list mapped to skills with load bars.",
      "Memory tiers for skill groups, network/connectivity specs.",
      "Playful copy tied to real experience and stack.",
    ],
    why: "Turns a skills list into a memorable, on-brand story.",
    relatedApp: "system-monitor",
  },
  {
    id: "easter-eggs",
    date: "2026-07-05",
    version: "1.2.0",
    title: "Easter eggs — Terminal, Snake, Secret",
    tags: ["easter-egg"],
    summary: "Three hidden delights for curious visitors.",
    body: [
      "Terminal with `sudo rm -rf /` → playful BSOD and reboot.",
      "Snake mini-game with score tracking.",
      "Secret folder with résumé download and hidden links.",
    ],
    why: "Portfolios are interviews — easter eggs reveal how you think about delight.",
    relatedApp: "terminal",
  },
  {
    id: "finder-hub",
    date: "2026-06-28",
    version: "1.1.0",
    title: "Finder hub",
    tags: ["feature"],
    summary: "Career content unified in one Finder app with sidebar navigation.",
    body: [
      "About, Work, Experience, Skills, Notes, Resume, Contact as sections.",
      "Breadcrumb + sidebar router; folded apps hidden from desktop clutter.",
      "Spotlight “Sections” group for quick jumps.",
    ],
    why: "One front door for recruiters — less hunting, clearer narrative.",
    relatedApp: "finder",
  },
  {
    id: "window-system",
    date: "2026-06-20",
    version: "1.0.2",
    title: "Window system & Spotlight",
    tags: ["feature", "system"],
    summary: "Floating windows, dock, ⌘K Spotlight, Mission Control.",
    body: [
      "Drag, resize, minimize, maximize, z-index focus management.",
      "macOS-style dock with magnification and app indicators.",
      "Spotlight command palette for apps, sections, and actions.",
      "Keyboard shortcuts for power users.",
    ],
    why: "The core OS illusion — without windows, it’s just a webpage.",
    relatedApp: "finder",
  },
  {
    id: "jaios-launch",
    date: "2026-06-01",
    version: "1.0.0",
    title: "JaiOS shell — boot, login, desktop",
    tags: ["feature", "system"],
    summary: "Portfolio reimagined as a tiny operating system in the browser.",
    body: [
      "Boot screen → login → desktop with dock and menu bar.",
      "Theme, wallpaper, accent, and sound preferences.",
      "Built with Next.js, React, TypeScript, Tailwind, Zustand, Framer Motion.",
    ],
    why: "A portfolio should demonstrate full-stack engineering craft — not just list projects.",
    relatedApp: "about",
  },
];

export function getChangelogByFilter(filter: ChangelogFilter): ChangelogEntry[] {
  if (filter === "all") return CHANGELOG;
  if (filter === "features") return CHANGELOG.filter((e) => e.tags.includes("feature"));
  if (filter === "fixes") return CHANGELOG.filter((e) => e.tags.includes("fix"));
  if (filter === "easter-eggs") return CHANGELOG.filter((e) => e.tags.includes("easter-egg"));
  return CHANGELOG.filter((e) => e.tags.includes(filter));
}

export const CHANGELOG_FILTERS: { id: ChangelogFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "features", label: "Features" },
  { id: "fixes", label: "Fixes" },
  { id: "easter-eggs", label: "Easter eggs" },
  { id: "pwa", label: "PWA" },
  { id: "polish", label: "Polish" },
];
