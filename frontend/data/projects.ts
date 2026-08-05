export type ProjectPreview = "ai-chat" | "payments" | "chat" | "healthcare" | "inventory" | "portfolio" | "notepad" | "formbuilder";

/** Card accent colors — must match keys in lib/accent.ts */
export type Accent = "accent" | "blue" | "violet" | "mint" | "amber";

/** Use one of these for `accent` in project-portfolio.ts */
export const PROJECT_ACCENTS = ["accent", "blue", "violet", "mint", "amber"] as const satisfies readonly Accent[];

export interface CaseStudy {
  overview: string;
  problem: string;
  role: string[];
  challenges: string[];
  uiStates: string[];
  architecture: string[];
  screens: string[];
  improved: string[];
  next: string[];
}

export interface Project {
  id: string;
  /** Use-case headline — not a product codename. */
  title: string;
  /** Domain tag, e.g. Fintech, Healthcare, Access control. */
  category: string;
  summary: string;
  contribution: string;
  stack: string[];
  challenge: string;
  accent: Accent;
  preview: ProjectPreview;
  caseStudy: CaseStudy;
}

/**
 * Work tab — USE CASES you have shipped for employers/clients (no public links).
 * Not a project gallery — each card is a problem class you have solved more than once.
 * Showcase repos live in data/project-portfolio.ts.
 *
 * HOW TO EDIT:
 * - title: name the use case ("Real-time payment settlement"), not the repo
 * - role[]: mix UI + API + DB + auth bullets in one list — alternate layers
 * - stack[]: interleave: ["Next.js", "PostgreSQL", "SSE", "Redis", "TypeScript"]
 * - Reorder array to put strongest / most relevant use cases first
 */
export const projects: Project[] = [
  {
    id: "agentic-streaming",
    title: "Streaming agent & tool-call UX",
    category: "AI product surfaces",
    summary:
      "Long-running AI tasks where users need to see tools, reasoning and progress — not a spinner and silence.",
    contribution:
      "End-to-end streaming surfaces — keyed UI state machines, SSE contracts, and recoverable multi-step runs.",
    stack: ["Next.js", "TypeScript", "Vercel AI SDK", "SSE", "REST APIs", "Tailwind CSS"],
    challenge: "Make opaque agent runs readable, trustworthy and recoverable.",
    accent: "violet",
    preview: "ai-chat",
    caseStudy: {
      overview:
        "When an assistant runs tools over many steps, the interface becomes the product. Streams arrive out of order, partial failures need retry paths, and users must understand what the system is doing before the final answer lands.",
      problem:
        "Agent runs feel like a black box: request in, silence, answer out. Without a narrated stream, users cannot trust slow work, cancel safely, or debug a bad tool call.",
      role: [
        "Built keyed message renderers with per-part state machines (pending → streaming → done → error).",
        "Co-defined SSE event shapes with the API so tool calls and reasoning artifacts map to stable UI nodes.",
        "Handled reconnect and partial-run recovery without duplicating conversation state.",
        "Surfaced auth and rate-limit failures as explicit UI states instead of silent hangs.",
      ],
      challenges: [
        "Rendering unbounded, out-of-order streams without layout jumps.",
        "Keeping client trees consistent when the API replays or corrects chunks.",
        "Designing retry flows that preserve context across failed tool steps.",
      ],
      uiStates: ["Empty", "Streaming", "Tool-call", "Reasoning", "Error + retry", "Final answer"],
      architecture: [
        "SSE reducer into a keyed message model shared with API types.",
        "Component-level state machines per stream part.",
        "Recoverable error boundaries tied to run ids.",
      ],
      screens: ["Streaming bubbles", "Tool-call cards", "Reasoning timeline"],
      improved: [
        "Turned opaque runs into inspectable, accountable workflows.",
        "Reduced abandonment on slow multi-step tasks.",
      ],
      next: ["Run replay", "Virtualized long transcripts"],
    },
  },
  {
    id: "payment-settlement",
    title: "Real-time payment settlement UX",
    category: "Fintech",
    summary:
      "Money in flight — users, finance and support all need the same live truth about a transaction.",
    contribution:
      "Payment timelines, Redux reconciliation, and webhook-aware status modelling across UI and Postgres.",
    stack: ["React", "Redux", "TypeScript", "SSE", "PostgreSQL", "REST APIs"],
    challenge: "Latency users cannot avoid — uncertainty they should never feel.",
    accent: "accent",
    preview: "payments",
    caseStudy: {
      overview:
        "Payments are asynchronous by nature. The use case is making pending → processing → settled/failed legible in the UI while Postgres and webhooks remain the source of truth after refresh or reconnect.",
      problem:
        "Users panic during settlement windows. Support tickets spike when the UI and database disagree. Duplicate submits make ambiguous states expensive.",
      role: [
        "Designed per-transaction timelines and distinct success, failure and retry treatments.",
        "Built a normalized client store reconciled against SSE feeds and REST snapshots.",
        "Aligned idempotent payment intents and webhook transitions with shared status enums.",
        "Mapped API error payloads to actionable next steps — retry, receipt, or contact support.",
      ],
      challenges: [
        "Reconciling streams with Postgres rows when event order diverges.",
        "Preventing double-submit without blocking legitimate retries.",
        "Showing progress without promising settlement before webhook confirmation.",
      ],
      uiStates: ["Pending", "Processing", "Succeeded", "Failed", "Retrying", "Receipt"],
      architecture: [
        "SSE + REST into a keyed transaction store.",
        "Shared status machine with the payments API.",
        "Webhook-confirmed transitions only surfaced after server ack.",
      ],
      screens: ["Status timeline", "Detail drawer", "Receipt view"],
      improved: [
        "Cut support anxiety during settlement waits.",
        "Gave finance and support a shared live view of state.",
      ],
      next: ["Settlement diff when stream and DB disagree"],
    },
  },
  {
    id: "rbac-permissions",
    title: "Role-based access & permission-driven UI",
    category: "Access control",
    summary:
      "Same product, different operators — doctors, admins, finance — each with different data and actions.",
    contribution:
      "RBAC across routes, components and APIs — permissions enforced on the server, reflected honestly in the UI.",
    stack: ["React", "TypeScript", "JWT", "PostgreSQL", "REST APIs", "Redux"],
    challenge: "Hide unauthorized actions without hiding the fact that roles differ.",
    accent: "blue",
    preview: "healthcare",
    caseStudy: {
      overview:
        "Multi-role products fail when the UI only hides buttons. The use case is permission matrices that flow from JWT claims through API scopes into what each role can see, edit, or approve — in healthcare, admin and fintech settings alike.",
      problem:
        "Leaking an action a nurse cannot perform on the server is a safety issue. Leaking financial actions across roles is a compliance issue. Client-only guards are never enough.",
      role: [
        "Modelled role → permission maps shared between frontend route guards and API middleware.",
        "Built view switchers that change data scope and controls together, not cosmetic tabs.",
        "Handled forbidden states with clear messaging instead of broken screens.",
        "Audited mutating endpoints to ensure UI affordances match server enforcement.",
      ],
      challenges: [
        "Keeping role drift in sync when permissions change without redeploying all clients.",
        "Rendering dense admin surfaces where every row action may be role-gated.",
        "Testing matrix edge cases — impersonation, expired sessions, partial scopes.",
      ],
      uiStates: ["Role switch", "Scoped list", "Forbidden", "Elevated action", "Session expired"],
      architecture: [
        "JWT claims → permission resolver → route and component gates.",
        "API returns 403 shapes the UI can render consistently.",
        "Feature flags per role for gradual rollouts.",
      ],
      screens: ["Role switcher", "Scoped tables", "Permission-denied panel"],
      improved: [
        "Reduced unauthorized-action errors in clinical and admin flows.",
        "Made role differences obvious to users instead of confusing.",
      ],
      next: ["Fine-grained field-level permissions"],
    },
  },
  {
    id: "live-messaging",
    title: "Live messaging, presence & delivery truth",
    category: "Real-time collaboration",
    summary:
      "Chat that must feel instant on good networks and honest on bad ones — reconnects included.",
    contribution:
      "WebSocket clients, optimistic sends, presence channels and offline queues reconciled with persisted messages.",
    stack: ["React", "WebSockets", "Redis", "TypeScript", "REST APIs", "Redux"],
    challenge: "Feel fast without lying about delivery when sockets flap.",
    accent: "blue",
    preview: "chat",
    caseStudy: {
      overview:
        "Messaging products live in the edges: typing indicators while disconnected, messages composed offline, read receipts across devices. The use case is optimistic UI bounded by server acks and a recovery story users can trust.",
      problem:
        "A chat that loses messages on reconnect destroys the product. A chat that shows 'delivered' too early destroys trust.",
      role: [
        "Implemented multiplexed sockets with heartbeat and exponential backoff reconnect.",
        "Designed optimistic append reconciled by server-issued message ids.",
        "Built presence and typing on a side channel backed by Redis.",
        "Flushed offline queues on reconnect without duplicate threads in the UI.",
      ],
      challenges: [
        "Ordering and deduping after reconnect without visible jumps.",
        "Matching delivery state to Redis presence when connections flap.",
        "Keeping input enabled during reconnect with clear status affordances.",
      ],
      uiStates: ["Typing", "Online", "Delivered", "Reconnecting", "Offline queue"],
      architecture: [
        "Socket client with backoff + idempotent send tokens.",
        "Message store keyed by server id.",
        "Presence fan-out separate from message stream.",
      ],
      screens: ["Thread view", "Typing indicator", "Reconnect banner"],
      improved: [
        "Maintained low-latency feel on flaky mobile networks.",
        "Eliminated 'lost message' support tickets after reconnects.",
      ],
      next: ["Cross-device read cursor sync"],
    },
  },
  {
    id: "clinical-live-ops",
    title: "Clinical live ops & high-stakes dashboards",
    category: "Healthcare",
    summary:
      "Vitals, alerts and long forms under time pressure — where misread UI has real consequences.",
    contribution:
      "Live vitals boards, threshold alerts, PAC workflows and discharge summaries tied to clinical APIs.",
    stack: ["React", "WebSockets", "PostgreSQL", "TypeScript", "RBAC", "REST APIs"],
    challenge: "Dense, live data that must stay calm and unambiguous.",
    accent: "mint",
    preview: "healthcare",
    caseStudy: {
      overview:
        "ICU and OT tooling combines streaming vitals, legally sensitive forms and role-specific views. The use case is making critical changes impossible to miss without cry-wolf alert fatigue.",
      problem:
        "Clinicians scan fast. A missed threshold or a form that loses progress mid-shift is not a UX bug — it is an operational risk.",
      role: [
        "Piped WebSocket vitals into charts with explicit, configurable thresholds.",
        "Built PAC forms with inline validation aligned to server field rules.",
        "Scoped dashboards per role using API-driven data filters, not hidden DOM.",
        "Shipped discharge summaries from authoritative Postgres patient history.",
      ],
      challenges: [
        "Alert design that cannot be missed or ignored on noisy feeds.",
        "Recoverable validation on multi-screen clinical workflows.",
        "Performance when many vitals update per second across a ward view.",
      ],
      uiStates: ["Live vitals", "Threshold breach", "Form error", "Discharge review"],
      architecture: [
        "Stream → chart pipeline with threshold config per patient.",
        "Form engine with server-aligned validation messages.",
        "RBAC-scoped REST queries per clinical role.",
      ],
      screens: ["Vitals board", "PAC form", "Discharge summary"],
      improved: [
        "Gave each role the right slice of patient data under pressure.",
        "Made threshold breaches visually unmistakable.",
      ],
      next: ["Clinician-configurable alert profiles"],
    },
  },
  {
    id: "admin-bulk-ops",
    title: "Operational admin, bulk edits & inventory control",
    category: "Enterprise admin",
    summary:
      "Thousands of rows, batch actions, stock thresholds — operators need speed without dangerous mistakes.",
    contribution:
      "High-density tables, batch mutations, auth sessions and Postgres-backed alerts for low-stock workflows.",
    stack: ["React", "Redux", "PostgreSQL", "Firebase Auth", "JWT", "Tailwind CSS"],
    challenge: "Bulk speed with server-enforced safety rails.",
    accent: "amber",
    preview: "inventory",
    caseStudy: {
      overview:
        "Inventory and ops admin is a use case of filters, selection, batch updates and threshold-driven notifications. The UI must stay fast while every mutation respects role scope and partial-failure semantics.",
      problem:
        "Operators lose hours in spreadsheets-in-disguise. A batch update that half-fails without clarity creates inventory drift.",
      role: [
        "Built sortable, selectable tables with filter state that survives navigation.",
        "Wired Firebase Auth into JWT sessions with HttpOnly cookies and role guards.",
        "Integrated REST bulk endpoints with optimistic UI bounded by per-row acks.",
        "Surfaced Postgres-derived low-stock alerts without blocking core flows.",
      ],
      challenges: [
        "Partial batch failure — surfacing which rows succeeded and which did not.",
        "Keeping selection and scroll performant on large datasets.",
        "Aligning every mutating action with server authorization rules.",
      ],
      uiStates: ["Filtered table", "Batch bar", "Partial failure", "Stock alert"],
      architecture: [
        "Redux + derived selectors for stock thresholds.",
        "Bulk API with row-level error payloads.",
        "JWT middleware mirrored in client route guards.",
      ],
      screens: ["Inventory grid", "Batch action bar", "Alert cards"],
      improved: [
        "Cut time to spot and act on low stock.",
        "Made bulk edits traceable and recoverable.",
      ],
      next: ["Audit trail per inventory mutation"],
    },
  },
  {
    id: "job-portal-funnels",
    title: "Job portals & high-traffic content funnels",
    category: "Talent & growth",
    summary:
      "Search-heavy, SEO-sensitive career surfaces where performance and clarity directly affect conversion.",
    contribution:
      "Next.js job portals and career pages — fast listings, application flows and MUI-driven responsive layouts.",
    stack: ["Next.js", "React", "TypeScript", "MUI", "REST APIs", "SSR"],
    challenge: "Make complex hiring funnels feel simple on mobile and desktop.",
    accent: "violet",
    preview: "portfolio",
    caseStudy: {
      overview:
        "Job portals combine search, filters, role pages and application handoffs. The use case is SSR-friendly listing performance, accessible forms and career content that still ships quickly as requirements change.",
      problem:
        "Slow listing pages hurt SEO and drop-off. Application flows that break on mobile kill conversion. Marketing and engineering need to iterate without rewriting the shell each time.",
      role: [
        "Led Next.js architecture for listing, detail and application routes with shared layout primitives.",
        "Built filter and search UX with debounced queries against paginated REST APIs.",
        "Optimised LCP on content-heavy pages with SSR and image discipline.",
        "Structured MUI theming so career brand updates do not fork the codebase.",
      ],
      challenges: [
        "Balancing rich job metadata with fast first paint.",
        "Accessible multi-step apply flows on small screens.",
        "Keeping API pagination and UI filter state in sync across deep links.",
      ],
      uiStates: ["Search", "Filtered list", "Job detail", "Apply flow", "Confirmation"],
      architecture: [
        "App Router with SSR listings and client islands for interactivity.",
        "Shared filter state in URL query params for shareable searches.",
        "MUI theme tokens for marketing + app consistency.",
      ],
      screens: ["Job board", "Role detail", "Application form"],
      improved: [
        "Improved listing performance and mobile apply completion.",
        "Gave recruiting a funnel they could iterate without full redeploys.",
      ],
      next: ["Saved searches and candidate return paths"],
    },
  },
  {
    id: "ai-in-product",
    title: "AI-assisted recommendations inside product flows",
    category: "Product intelligence",
    summary:
      "Suggestions and prompts embedded where users already work — not a separate chat window bolted on.",
    contribution:
      "In-context LLM suggestions with guardrails, loading states and fallbacks when models are slow or wrong.",
    stack: ["React", "TypeScript", "ChatGPT API", "REST APIs", "Redis", "SSE"],
    challenge: "Helpful suggestions without blocking the core task or hallucinating actions.",
    accent: "mint",
    preview: "ai-chat",
    caseStudy: {
      overview:
        "Recommendation and assistive AI works best inside existing workflows — inventory suggestions, draft replies, classification hints. The use case is latency-aware UI, cached responses and clear human override.",
      problem:
        "Bolt-on chat distracts. Slow or wrong suggestions erode trust faster than no AI at all. Products need assistive patterns that fail open.",
      role: [
        "Embedded suggestion panels with explicit accept/dismiss and undo paths.",
        "Cached and debounced prompt calls via Redis to protect rate limits and cost.",
        "Designed loading, empty and low-confidence states so users keep working.",
        "Worked with backend on prompt templates and output validation before render.",
      ],
      challenges: [
        "Keeping suggestions non-blocking when model latency spikes.",
        "Preventing unsafe actions from being one click away from a hallucination.",
        "Measuring acceptance rate without creepy over-tracking.",
      ],
      uiStates: ["Suggestion loading", "Accepted", "Dismissed", "Low confidence", "Fallback manual"],
      architecture: [
        "Async suggestion fetch with stale-while-revalidate caching.",
        "Server-side prompt assembly and output schema validation.",
        "Feature-flagged rollout per operator role.",
      ],
      screens: ["Suggestion chip", "Expandable draft", "Manual override"],
      improved: [
        "Reduced time on repetitive catalog decisions.",
        "Kept operators in flow when the model was uncertain.",
      ],
      next: ["Feedback loop from accept/dismiss into prompt tuning"],
    },
  },
];
