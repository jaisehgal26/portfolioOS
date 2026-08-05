export type KnowledgeSection =
  | "css"
  | "css-frameworks"
  | "backend"
  | "databases"
  | "auth"
  | "ai-libraries"
  | "ai-tools"
  | "dev-tools"
  | "chrome-extensions"
  | "workflow-tools";

export interface KnowledgeItem {
  id: string;
  section: KnowledgeSection;
  title: string;
  tags: string[];
  summary: string;
  /** Why I recommend it — the personal take. */
  recommendation: string;
  details?: string[];
  href?: string;
  hrefLabel?: string;
}

export const KNOWLEDGE_SECTIONS: { id: KnowledgeSection; label: string; description: string }[] = [
  {
    id: "css",
    label: "CSS",
    description: "Fundamentals, modern layout, and references I keep open while building.",
  },
  {
    id: "css-frameworks",
    label: "CSS frameworks",
    description: "Frameworks and component libraries — what I pick and when.",
  },
  {
    id: "backend",
    label: "Backend",
    description: "APIs, Python services, and server-side patterns I ship in production.",
  },
  {
    id: "databases",
    label: "Databases",
    description: "Postgres, caching, migrations, and serverless data platforms.",
  },
  {
    id: "auth",
    label: "Auth & security",
    description: "Sessions, passwords, access control, and safe public endpoints.",
  },
  {
    id: "ai-libraries",
    label: "AI libraries",
    description: "SDKs and packages for streaming, agents, and AI-powered UIs.",
  },
  {
    id: "ai-tools",
    label: "AI tools",
    description: "AI-powered dev tools — codegen, UI generation, PR review, and agents built for shipping code.",
  },
  {
    id: "dev-tools",
    label: "Dev tools",
    description: "Debuggers, profilers, and IDE tooling that save hours.",
  },
  {
    id: "chrome-extensions",
    label: "Chrome extensions",
    description: "Browser add-ons for frontend debugging and design QA.",
  },
  {
    id: "workflow-tools",
    label: "Workflow tools",
    description: "Package managers, deploy, design handoff — the rest of the stack.",
  },
];

export const KNOWLEDGE: KnowledgeItem[] = [
  // —— CSS ——
  {
    id: "css-custom-properties",
    section: "css",
    title: "CSS custom properties",
    tags: ["css", "theming", "tokens"],
    summary: "Semantic variables for colors, spacing, and accents — one source of truth for light/dark and theme switches.",
    recommendation: "JaiOS runs on `--accent`, `--surface`, `--line` tokens. Faster than prop-drilling theme objects.",
    details: [
      "Store user picks in localStorage; hydrate before first paint.",
      "Map accent choices to RGB triplets for Tailwind arbitrary values.",
    ],
    href: "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties",
    hrefLabel: "MDN",
  },
  {
    id: "css-grid-flex",
    section: "css",
    title: "Grid + Flexbox",
    tags: ["layout", "responsive"],
    summary: "Flex for one-dimensional flows; Grid for two-dimensional layouts. Most product UIs need both, not a framework war.",
    recommendation: "Reach for Grid on dashboards and card grids; Flex on toolbars, form rows, and alignment.",
    href: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
    hrefLabel: "CSS-Tricks",
  },
  {
    id: "josh-comeau-css",
    section: "css",
    title: "Josh W. Comeau — interactive CSS",
    tags: ["learning", "css", "motion"],
    summary: "The clearest essays on modern CSS, gradients, and animation. Great for leveling up taste, not just syntax.",
    recommendation: "I send teammates his flexbox/grid guides before any layout review.",
    href: "https://www.joshwcomeau.com/css/",
    hrefLabel: "joshwcomeau.com",
  },
  {
    id: "mdn-css",
    section: "css",
    title: "MDN Web Docs — CSS",
    tags: ["reference", "standards"],
    summary: "Authoritative reference for properties, selectors, and browser behavior.",
    recommendation: "First stop when a style behaves differently across browsers.",
    href: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    hrefLabel: "MDN",
  },

  // —— CSS frameworks ——
  {
    id: "tailwind",
    section: "css-frameworks",
    title: "Tailwind CSS",
    tags: ["tailwind", "utility-first"],
    summary: "My default for product UIs — fast iteration, consistent scale, built-in dark mode.",
    recommendation: "Use for portfolios, dashboards, and greenfield React/Next apps where you own the design system.",
    details: ["Pair with CSS variables for accent tokens.", "Avoid @apply soup — keep utilities in components."],
    href: "https://tailwindcss.com/docs",
    hrefLabel: "tailwindcss.com",
  },
  {
    id: "shadcn-radix",
    section: "css-frameworks",
    title: "shadcn/ui + Radix",
    tags: ["shadcn", "radix", "components"],
    summary: "Accessible primitives you copy into the repo — full control, no version lock-in.",
    recommendation: "Best when you need dialogs, menus, and tabs fast but still want custom visuals.",
    href: "https://ui.shadcn.com/",
    hrefLabel: "ui.shadcn.com",
  },
  {
    id: "mui",
    section: "css-frameworks",
    title: "Material UI (MUI)",
    tags: ["mui", "enterprise", "react"],
    summary: "Dense data tables, date pickers, and form-heavy admin UIs out of the box.",
    recommendation: "Pick when the team already standardizes on MUI — don't fight the org.",
    href: "https://mui.com/material-ui/",
    hrefLabel: "mui.com",
  },
  {
    id: "framer-motion",
    section: "css-frameworks",
    title: "Framer Motion",
    tags: ["animation", "react"],
    summary: "Declarative motion for panels, lists, and micro-interactions.",
    recommendation: "Always gate behind prefers-reduced-motion. JaiOS window transitions use this.",
    href: "https://motion.dev/",
    hrefLabel: "motion.dev",
  },

  // —— Backend ——
  {
    id: "fastapi",
    section: "backend",
    title: "FastAPI",
    tags: ["python", "api", "async"],
    summary: "Modern Python API framework — Pydantic validation, OpenAPI docs, and async routes out of the box.",
    recommendation: "My default for product APIs beside Next.js. QuickPad and FormForge both run FastAPI services — typed request/response models catch bad payloads before they hit the DB.",
    details: [
      "Dependency injection for DB sessions, auth, and rate-limit checks.",
      "Auto-generated /docs for quick integration testing with the frontend team.",
    ],
    href: "https://fastapi.tiangolo.com/",
    hrefLabel: "fastapi.tiangolo.com",
  },
  {
    id: "pydantic",
    section: "backend",
    title: "Pydantic",
    tags: ["validation", "python", "types"],
    summary: "Data validation and settings management for Python — the backbone of FastAPI request models.",
    recommendation: "Define schemas once, validate at the boundary. Same mindset as Zod on the client — wrong shapes never reach business logic.",
    href: "https://docs.pydantic.dev/",
    hrefLabel: "docs.pydantic.dev",
  },
  {
    id: "zod",
    section: "backend",
    title: "Zod",
    tags: ["validation", "typescript", "schemas"],
    summary: "Schema validation for TypeScript — API responses, form input, env vars, and shared contracts with the frontend.",
    recommendation: "The TypeScript counterpart to Pydantic. I validate at every boundary: fetch responses, server actions, and tool-call JSON before it touches UI state.",
    details: [
      "Infer types from schemas with z.infer — one source of truth for runtime + compile time.",
      "Also useful for structured LLM outputs — validate agent JSON before rendering tool-call cards.",
    ],
    href: "https://zod.dev/",
    hrefLabel: "zod.dev",
  },
  {
    id: "sqlalchemy",
    section: "backend",
    title: "SQLAlchemy",
    tags: ["orm", "python", "postgres"],
    summary: "Python ORM and query builder for Postgres — models, relationships, and session management.",
    recommendation: "Pairs with Alembic for migrations. I keep queries explicit in hot paths instead of lazy-loading surprises in production.",
    details: [
      "Use async sessions with FastAPI for serverless-friendly handlers.",
      "Index foreign keys and filter columns you query on every list endpoint.",
    ],
    href: "https://www.sqlalchemy.org/",
    hrefLabel: "sqlalchemy.org",
  },
  {
    id: "alembic",
    section: "backend",
    title: "Alembic",
    tags: ["migrations", "postgres", "schema"],
    summary: "Database migration tool for SQLAlchemy — versioned schema changes with up/down revisions.",
    recommendation: "Every schema change gets a migration file, not a manual ALTER in prod. Review migrations like code — destructive changes need a rollout plan.",
    href: "https://alembic.sqlalchemy.org/",
    hrefLabel: "alembic.sqlalchemy.org",
  },
  {
    id: "pytest",
    section: "backend",
    title: "pytest",
    tags: ["testing", "python", "api"],
    summary: "Python test runner — fixtures, parametrized cases, and clean assertions for API suites.",
    recommendation: "API tests are the safety net behind auth and payment flows. I test happy path, 401/403, and validation errors — not just 200 OK.",
    href: "https://docs.pytest.org/",
    hrefLabel: "docs.pytest.org",
  },
  {
    id: "httpx",
    section: "backend",
    title: "HTTPX",
    tags: ["http", "testing", "async"],
    summary: "Modern HTTP client for Python — sync and async, great for calling external APIs and writing API tests.",
    recommendation: "Use with pytest and FastAPI TestClient for integration tests that hit real route handlers without spinning up a browser.",
    href: "https://www.python-httpx.org/",
    hrefLabel: "python-httpx.org",
  },

  // —— Databases ——
  {
    id: "postgresql",
    section: "databases",
    title: "PostgreSQL",
    tags: ["sql", "relational", "production"],
    summary: "Reliable relational database — JSONB, full-text search, constraints, and transactions done right.",
    recommendation: "Default when data has relationships and integrity rules. I model roles, notes, forms, and audit trails here — not in scattered JSON files.",
    details: [
      "Use constraints and foreign keys; let the DB enforce what the API promises.",
      "Explain ANALYZE on slow list endpoints before adding cache layers.",
    ],
    href: "https://www.postgresql.org/docs/",
    hrefLabel: "postgresql.org",
  },
  {
    id: "neon",
    section: "databases",
    title: "Neon",
    tags: ["postgres", "serverless", "branching"],
    summary: "Serverless Postgres — branching, autoscaling, and connection pooling for modern deploy targets.",
    recommendation: "What I use for production Postgres on Vercel/Railway stacks. Branch per feature for safe schema experiments without touching prod data.",
    details: [
      "Use the pooled connection string in serverless handlers — raw connections exhaust limits fast.",
      "Scale-to-zero saves cost on side projects; watch cold-start latency on first query.",
    ],
    href: "https://neon.tech/docs/introduction",
    hrefLabel: "neon.tech",
  },
  {
    id: "redis",
    section: "databases",
    title: "Redis",
    tags: ["cache", "pub-sub", "real-time"],
    summary: "In-memory data store — caching, pub/sub, rate-limit counters, and session backing.",
    recommendation: "QuickPad uses Redis pub/sub so multiple API instances broadcast Yjs updates. Also my go-to for rate limits and short-lived tokens.",
    href: "https://redis.io/docs/",
    hrefLabel: "redis.io",
  },
  {
    id: "upstash",
    section: "databases",
    title: "Upstash Redis",
    tags: ["serverless", "redis", "rate-limiting"],
    summary: "Serverless Redis with REST and SDK access — no connection-pool headaches on edge/serverless runtimes.",
    recommendation: "Drop-in when you need Redis from Vercel functions without managing a persistent connection. I use it for rate limits and lightweight queues.",
    href: "https://upstash.com/docs/redis",
    hrefLabel: "upstash.com",
  },
  {
    id: "prisma",
    section: "databases",
    title: "Prisma",
    tags: ["orm", "typescript", "migrations"],
    summary: "Type-safe ORM for Node/Next.js — schema-first models, migrations, and generated client types.",
    recommendation: "Reach for it on Next.js-only stacks where the API lives in route handlers. On Python services I stay with SQLAlchemy + Alembic.",
    href: "https://www.prisma.io/docs",
    hrefLabel: "prisma.io",
  },

  // —— Auth & security ——
  {
    id: "jwt",
    section: "auth",
    title: "JWT sessions",
    tags: ["auth", "tokens", "api"],
    summary: "Signed tokens for stateless auth — access tokens, refresh flows, and scoped API access.",
    recommendation: "FormForge and QuickPad use JWT for session unlock after password verification. Short expiry + HttpOnly cookies where the browser is involved; bearer tokens for API-only clients.",
    details: [
      "Never store sensitive claims in the payload — it's readable, not encrypted.",
      "Rotate signing keys and plan a logout story (blocklist or short TTL).",
    ],
    href: "https://jwt.io/introduction",
    hrefLabel: "jwt.io",
  },
  {
    id: "argon2",
    section: "auth",
    title: "Argon2 password hashing",
    tags: ["security", "passwords", "crypto"],
    summary: "Memory-hard password hashing — resistant to GPU cracking, winner of the Password Hashing Competition.",
    recommendation: "QuickPad hashes note passwords with Argon2 before storage. Plaintext passwords never touch the database — compare hashes server-side only.",
    href: "https://github.com/P-H-C/phc-winner-argon2",
    hrefLabel: "PHC Argon2",
  },
  {
    id: "rbac",
    section: "auth",
    title: "RBAC & permission maps",
    tags: ["authorization", "roles", "enterprise"],
    summary: "Role-based access control — map roles to permissions and enforce the same rules in UI guards and API middleware.",
    recommendation: "Healthcare and admin tools taught me to model permissions once and share them between frontend route guards and backend middleware. Drift between the two is how bugs become breaches.",
    details: [
      "Prefer resource + action permissions over hard-coded role checks in every handler.",
      "Log denied access attempts — they're early signals of misconfiguration or abuse.",
    ],
  },
  {
    id: "rate-limiting",
    section: "auth",
    title: "Rate limiting",
    tags: ["security", "abuse", "redis"],
    summary: "Throttle requests per IP, user, or API key — protect login, public endpoints, and expensive operations.",
    recommendation: "Public note creation and auth endpoints get rate limits first. Redis or Upstash counters with sliding windows — return 429 with Retry-After, not a silent hang.",
    details: [
      "Stricter limits on POST /login and password-unlock routes.",
      "Separate budgets for read vs write on shared public APIs.",
    ],
  },
  {
    id: "owasp-api",
    section: "auth",
    title: "OWASP API Security Top 10",
    tags: ["security", "reference", "checklist"],
    summary: "Industry checklist for API risks — broken auth, excessive data exposure, lack of rate limiting, and more.",
    recommendation: "I skim this before shipping any public endpoint. Good for interview prep and for catching gaps a feature checklist won't mention.",
    href: "https://owasp.org/API-Security/editions/2023/en/0x00-header/",
    hrefLabel: "owasp.org",
  },
  {
    id: "nextauth-better-auth",
    section: "auth",
    title: "Better Auth / Auth.js",
    tags: ["nextjs", "sessions", "oauth"],
    summary: "Auth libraries for Next.js — email/password, OAuth providers, and session management without rolling your own.",
    recommendation: "When the app is Next.js-first and doesn't need a separate Python API, start here instead of custom JWT glue. For split FastAPI + Next stacks, keep auth logic on the API and treat the client as a token holder.",
    href: "https://www.better-auth.com/docs",
    hrefLabel: "better-auth.com",
  },

  // —— AI libraries ——
  {
    id: "vercel-ai-sdk",
    section: "ai-libraries",
    title: "Vercel AI SDK",
    tags: ["ai", "streaming", "nextjs"],
    summary: "Hooks and helpers for streaming chat, tool calls, and structured outputs in Next.js.",
    recommendation: "What I used for agentic chat UIs — SSE streaming with less boilerplate.",
    href: "https://sdk.vercel.ai/docs",
    hrefLabel: "sdk.vercel.ai",
  },
  {
    id: "openai-sdk",
    section: "ai-libraries",
    title: "OpenAI Node SDK",
    tags: ["openai", "api"],
    summary: "Official client for chat completions, embeddings, and assistants.",
    recommendation: "Solid when you need direct API control outside the Vercel abstractions.",
    href: "https://platform.openai.com/docs/libraries",
    hrefLabel: "openai.com",
  },

  // —— AI tools (dev-focused — not chatbots) ——
  {
    id: "cursor",
    section: "ai-tools",
    title: "Cursor",
    tags: ["ide", "agent", "daily-driver"],
    summary: "AI-native code editor — codebase-aware chat, Composer for multi-file edits, and project rules.",
    recommendation: "What I use every day for engineering work. Best for scoped features, refactors, and navigating unfamiliar repos.",
    details: [
      "Set up .cursor/rules for project conventions.",
      "Composer for end-to-end features; inline edit for small fixes.",
    ],
    href: "https://cursor.com/",
    hrefLabel: "cursor.com",
  },
  {
    id: "agent-browser",
    section: "ai-tools",
    title: "agent-browser (Vercel)",
    tags: ["browser-automation", "agents", "testing"],
    summary: "Rust CLI for AI agents to control a real browser — snapshot + ref workflow instead of brittle CSS selectors.",
    recommendation: "Built for the agentic dev loop: open your app, snapshot the page, click/fill by @e1 refs. Great for smoke tests and self-testing agents.",
    details: [
      "Works with Cursor and Claude Code via shell or MCP.",
      "Compact accessibility-tree output — fewer tokens than dumping full DOM.",
    ],
    href: "https://agent-browser.dev/",
    hrefLabel: "agent-browser.dev",
  },
  {
    id: "google-stitch",
    section: "ai-tools",
    title: "Google Stitch",
    tags: ["ui-design", "prototyping", "gemini"],
    summary: "AI-native design canvas from Google Labs — text, voice, or image prompts to high-fidelity UI and interactive prototypes.",
    recommendation: "Fast ideation before code. Export to Figma or HTML/CSS, then rebuild properly in your stack.",
    details: [
      "Multi-screen flows with shared design language.",
      "DESIGN.md export for agent-friendly design specs.",
    ],
    href: "https://stitch.withgoogle.com/",
    hrefLabel: "stitch.withgoogle.com",
  },
  {
    id: "lovable",
    section: "ai-tools",
    title: "Lovable",
    tags: ["full-stack", "prototyping", "react"],
    summary: "Prompt-to-app builder — generates React frontends with Supabase backend hooks, live preview, and GitHub sync.",
    recommendation: "Strong for MVPs and client demos. Export to your repo and harden before production.",
    href: "https://lovable.dev/",
    hrefLabel: "lovable.dev",
  },
  {
    id: "framer-ai",
    section: "ai-tools",
    title: "Framer AI",
    tags: ["design", "landing-pages", "no-code"],
    summary: "Generate and iterate marketing sites and landing pages from prompts — design, layout, and copy in one flow.",
    recommendation: "Best for portfolio and marketing pages where polish matters more than custom app logic.",
    href: "https://www.framer.com/ai/",
    hrefLabel: "framer.com",
  },
  {
    id: "github-copilot",
    section: "ai-tools",
    title: "GitHub Copilot",
    tags: ["autocomplete", "vscode", "pair-programming"],
    summary: "Inline code completions and chat inside VS Code, JetBrains, and Neovim.",
    recommendation: "Solid for boilerplate JSX, test stubs, and repetitive types — always review before accepting.",
    href: "https://github.com/features/copilot",
    hrefLabel: "github.com",
  },
  {
    id: "v0",
    section: "ai-tools",
    title: "v0 by Vercel",
    tags: ["ui-generation", "react", "tailwind"],
    summary: "Generates React + Tailwind components and full screens from prompts — shadcn-aware output.",
    recommendation: "Great for layout scaffolding. I treat output as a draft, then wire real state and tokens.",
    href: "https://v0.dev/",
    hrefLabel: "v0.dev",
  },
  {
    id: "bolt",
    section: "ai-tools",
    title: "Bolt.new",
    tags: ["full-stack", "prototyping", "webcontainer"],
    summary: "Prompt-to-app in the browser — spins up a full stack prototype with live preview, no local setup.",
    recommendation: "Use for fast spikes and demos. Not production code — extract patterns, rebuild properly in your repo.",
    href: "https://bolt.new/",
    hrefLabel: "bolt.new",
  },
  {
    id: "coderabbit",
    section: "ai-tools",
    title: "CodeRabbit",
    tags: ["pr-review", "ci", "quality"],
    summary: "AI pull-request reviewer — catches bugs, suggests fixes, and summarizes diffs on GitHub.",
    recommendation: "Catches edge cases I miss in self-review. Pair with human review, not a replacement for it.",
    href: "https://www.coderabbit.ai/",
    hrefLabel: "coderabbit.ai",
  },
  {
    id: "continue-dev",
    section: "ai-tools",
    title: "Continue",
    tags: ["open-source", "vscode", "custom-models"],
    summary: "Open-source AI coding assistant — plug in your own models (local or API) inside VS Code/JetBrains.",
    recommendation: "Useful when you need model flexibility or want to run smaller models locally for privacy.",
    href: "https://www.continue.dev/",
    hrefLabel: "continue.dev",
  },
  {
    id: "windsurf",
    section: "ai-tools",
    title: "Windsurf",
    tags: ["ide", "agent", "codeium"],
    summary: "AI IDE with Cascade agent — multi-step edits, terminal commands, and deep codebase context.",
    recommendation: "Worth trying alongside Cursor if you want a second opinion on agent-style workflows.",
    href: "https://windsurf.com/",
    hrefLabel: "windsurf.com",
  },

  // —— Dev tools ——
  {
    id: "tanstack-query",
    section: "dev-tools",
    title: "TanStack Query",
    tags: ["data-fetching", "cache", "react"],
    summary: "Server state for React — caching, background refetch, mutations, and optimistic updates.",
    recommendation: "My default for anything that talks to an API: dashboards, lists, and forms. Stale-while-revalidate beats hand-rolled useEffect + fetch.",
    details: [
      "Invalidate queries after mutations so lists stay in sync with the server.",
      "Pairs well with streaming AI UIs — cache session metadata, stream the message body separately.",
    ],
    href: "https://tanstack.com/query/latest",
    hrefLabel: "tanstack.com",
  },
  {
    id: "chrome-devtools",
    section: "dev-tools",
    title: "Chrome DevTools",
    tags: ["debugging", "performance"],
    summary: "Elements, Network, Performance, and Application tabs — non-negotiable for full-stack debugging.",
    recommendation: "Network tab for SSE streams; Performance for layout jank; Application for PWA and storage.",
    href: "https://developer.chrome.com/docs/devtools/",
    hrefLabel: "Chrome docs",
  },
  {
    id: "react-devtools",
    section: "dev-tools",
    title: "React DevTools",
    tags: ["react", "debugging"],
    summary: "Inspect component tree, props, state, and profiler flame charts.",
    recommendation: "Profiler first when a list re-renders too often or streaming causes jank.",
    href: "https://react.dev/learn/react-developer-tools",
    hrefLabel: "react.dev",
  },
  {
    id: "typescript",
    section: "dev-tools",
    title: "TypeScript",
    tags: ["types", "safety"],
    summary: "Static types for props, API contracts, and agent tool schemas.",
    recommendation: "Strict mode on every project — catches bad data before it hits the UI.",
    href: "https://www.typescriptlang.org/docs/",
    hrefLabel: "typescriptlang.org",
  },
  {
    id: "lighthouse",
    section: "dev-tools",
    title: "Lighthouse",
    tags: ["performance", "a11y", "pwa"],
    summary: "Audits for performance, accessibility, SEO, and PWA readiness.",
    recommendation: "Run before shipping JaiOS-style PWAs — catches contrast and cache issues early.",
    href: "https://developer.chrome.com/docs/lighthouse/overview",
    hrefLabel: "Chrome docs",
  },

  // —— Chrome extensions ——
  {
    id: "ext-react-devtools",
    section: "chrome-extensions",
    title: "React Developer Tools",
    tags: ["react", "extension"],
    summary: "Browser extension version of React DevTools — inspect any React site.",
    recommendation: "Install on Chrome for debugging production builds and third-party apps.",
    href: "https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi",
    hrefLabel: "Chrome Web Store",
  },
  {
    id: "ext-whatfont",
    section: "chrome-extensions",
    title: "WhatFont",
    tags: ["typography", "design"],
    summary: "Hover to identify fonts, size, weight, and line-height on any page.",
    recommendation: "Quick design QA when matching a handoff or auditing a live site.",
    href: "https://chromewebstore.google.com/detail/whatfont/jabopobgcpjmedljpbcaablpmlmfcogm",
    hrefLabel: "Chrome Web Store",
  },
  {
    id: "ext-colorzilla",
    section: "chrome-extensions",
    title: "ColorZilla",
    tags: ["color", "picker"],
    summary: "Eyedropper and gradient tools for grabbing colors from the screen.",
    recommendation: "Faster than screenshot → Figma when you just need one hex value.",
    href: "https://chromewebstore.google.com/detail/colorzilla/bhlhnicpbhignbdhedgjhgdocnmhomnp",
    hrefLabel: "Chrome Web Store",
  },
  {
    id: "ext-json-formatter",
    section: "chrome-extensions",
    title: "JSON Formatter",
    tags: ["api", "debugging"],
    summary: "Pretty-prints JSON responses in the browser — readable API debugging.",
    recommendation: "Essential when inspecting REST and webhook payloads during integration work.",
    href: "https://chromewebstore.google.com/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa",
    hrefLabel: "Chrome Web Store",
  },
  {
    id: "ext-wappalyzer",
    section: "chrome-extensions",
    title: "Wappalyzer",
    tags: ["stack", "research"],
    summary: "Detects frameworks, analytics, and CMS on any website.",
    recommendation: "Useful for competitive research — see what stack a portfolio or product runs.",
    href: "https://www.wappalyzer.com/",
    hrefLabel: "wappalyzer.com",
  },

  // —— Workflow tools ——
  {
    id: "pnpm",
    section: "workflow-tools",
    title: "pnpm",
    tags: ["package-manager", "monorepo"],
    summary: "Fast, disk-efficient package manager — strict node_modules and great monorepo support.",
    recommendation: "JaiOS uses pnpm. Prefer it over npm for consistent installs and workspace setups.",
    href: "https://pnpm.io/",
    hrefLabel: "pnpm.io",
  },
  {
    id: "figma",
    section: "workflow-tools",
    title: "Figma",
    tags: ["design", "handoff"],
    summary: "Design source of truth — inspect spacing, export assets, comment on flows.",
    recommendation: "I build from Figma tokens where possible; Dev Mode for CSS snippets.",
    href: "https://www.figma.com/",
    hrefLabel: "figma.com",
  },
  {
    id: "vercel",
    section: "workflow-tools",
    title: "Vercel",
    tags: ["deploy", "nextjs", "preview"],
    summary: "Deploy Next.js with preview URLs per PR — ideal for portfolio and client demos.",
    recommendation: "How JaiOS ships. Preview deploys beat emailing zip files.",
    href: "https://vercel.com/",
    hrefLabel: "vercel.com",
  },
  {
    id: "github",
    section: "workflow-tools",
    title: "GitHub",
    tags: ["git", "collaboration"],
    summary: "Repos, PRs, Actions, and Copilot — the collaboration layer.",
    recommendation: "PR descriptions + small diffs > giant commits. Actions for lint/build on push.",
    href: "https://github.com/",
    hrefLabel: "github.com",
  },
];

export function getKnowledgeBySection(section: KnowledgeSection): KnowledgeItem[] {
  return KNOWLEDGE.filter((item) => item.section === section);
}

export function searchKnowledge(query: string, section?: KnowledgeSection | "all"): KnowledgeItem[] {
  const q = query.trim().toLowerCase();
  const items = section && section !== "all" ? getKnowledgeBySection(section) : KNOWLEDGE;
  if (!q) return items;
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.recommendation.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q)),
  );
}
