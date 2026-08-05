export interface Note {
  id: string;
  title: string;
  updated: string;
  preview: string;
  body: string[];
}

export const notes: Note[] = [
  {
    id: "problem-first",
    title: "Start from the failure, not the stack",
    updated: "Pinned",
    preview: "I pick tools after I know what breaks at 2 a.m.",
    body: [
      "Before I reach for a framework or a pattern, I try to name the moment the product fails: the user who refreshes during a payment, the collaborator who edits offline, the form that gets spammed on launch day. The stack is a consequence of those failures, not the starting point.",
      "That lens keeps me honest across frontend and backend. A beautiful UI with ambiguous server state is still a broken product. A fast API that returns the wrong shape under load is worse than a slow one that tells the truth.",
      "My default move is to sketch the unhappy paths first — duplicate submits, stale tabs, partial saves, rate-limit hits — then design the smallest system that recovers without asking the user to understand our architecture.",
      "When the failure modes are clear, the tech choices usually become boring in the right way: Postgres where truth matters, Redis where fan-out matters, optimistic UI only where rollback is cheap.",
    ],
  },
  {
    id: "agent-based-dev",
    title: "Agent-based development is a workflow, not autopilot",
    updated: "Aug 2, 2026",
    preview: "I use agents to remove friction, not to remove judgment.",
    body: [
      "Agent-based development clicked for me when I stopped asking tools to \"build the app\" and started giving them bounded missions: migrate this schema, wire this endpoint, trace this race. The agent is good at breadth; I'm still responsible for the contract.",
      "On QuickPad and FormForge that looked like spinning up parallel threads — one chasing WebSocket reconnect behaviour, another drafting pytest cases — while I held the product invariant in my head. The win isn't speed for its own sake; it's staying in flow on the hard decision while the repetitive glue gets drafted.",
      "I treat agent output like a junior engineer's PR: plausible, often helpful, never merged without reading the edges. Types, auth paths, and idempotency are where agents hallucinate confidence.",
      "The habit that stuck: keep a short living spec in the repo (even a markdown handoff) so every agent session re-grounds on the same constraints. Agents amplify a clear plan; they don't replace one.",
    ],
  },
  {
    id: "mcp-dev-loop",
    title: "MCPs changed my dev loop more than another chat tab",
    updated: "Jul 27, 2026",
    preview: "Context in the IDE beats context in a browser tab.",
    body: [
      "Hooking Vercel, Neon, GitHub, and Upstash into Cursor through MCPs didn't make me smarter — it removed the tax of context switching. I can ask \"what failed in the last deploy\" or \"show me slow queries\" without leaving the file I'm editing.",
      "The practical shift is investigative speed. When FormForge submissions spiked, I could correlate runtime logs, deployment state, and schema branches in one thread instead of four tabs and a forgotten filter.",
      "I still don't let MCP tools mutate production blindly. Read-heavy workflows — inspect, diff, explain, propose — are where they shine. Write paths get a human gate.",
      "For me MCPs are infrastructure for attention: fewer round trips, more time on the actual bug. That's the bar — not novelty, but whether I ship the fix tonight or next week.",
    ],
  },
  {
    id: "agentic-ui-trust",
    title: "Agentic UI is a trust problem dressed as a design problem",
    updated: "Jul 22, 2026",
    preview: "Show the work, or users assume you're hiding it.",
    body: [
      "Streaming chat broke the old request/response mental model. Users don't fear slowness as much as they fear opacity — a spinner with no story feels like a hang, not progress.",
      "My approach on agentic surfaces is narrative UI: tool calls, partial plans, explicit retries. Each visible step is a small proof that the system is still working and still accountable. Hiding intermediate states to look \"clean\" usually erodes trust faster than showing a messy timeline.",
      "The product question isn't \"can the model do it?\" but \"can a tired user understand what it's doing well enough to cancel, correct, or wait?\" That pushes design toward timelines and receipts, not single bubbles.",
      "Same principle elsewhere: payment pending, sync recovering, form saving. If the backend is doing something consequential, the interface should admit it in human terms.",
    ],
  },
  {
    id: "postgres-truth",
    title: "Postgres is where I want arguments to end",
    updated: "Jul 16, 2026",
    preview: "Caches coordinate; the database decides.",
    body: [
      "On full-stack products I treat Postgres as the court of final appeal. Redis, in-memory state, and client caches are allowed to be fast and wrong for milliseconds — not to invent a second reality.",
      "FormForge taught me this on autosave: the builder can be optimistic, but submission counts, slug uniqueness, and response limits need a single authoritative row. Alembic migrations then become part of the product story — every schema change is a behaviour change someone will notice.",
      "I design APIs so the client can be dumb about reconciliation: ids are stable, writes are idempotent where users double-click, and conflicts return something actionable instead of a generic 500.",
      "When teams debate \"eventual consistency\" I ask where the user feels the seam. If they can publish a form twice or lose an answer, we've pushed complexity to the wrong layer.",
    ],
  },
  {
    id: "public-endpoints",
    title: "Public endpoints are product surfaces under attack",
    updated: "Jul 11, 2026",
    preview: "A share link is an invite to the whole internet.",
    body: [
      "The moment QuickPad and FormForge expose a URL anyone can hit, abuse isn't a security appendix — it's day-one UX. Rate limits, caps, and soft deletes are how you protect real users from everyone else's bots.",
      "I design public flows assuming bad faith without punishing good faith: anonymous editors on a notepad, anonymous respondents on a form. JWT unlock for protected notes, HttpOnly cookies for sessions, Argon2 where passwords exist — each choice is about what happens when the link leaks.",
      "Backend validation isn't paranoia; it's product quality. A form that accepts infinite submissions looks fine in demos and ruins a launch under mild traffic.",
      "My checklist before shipping a public slug: what's the cost per anonymous action, what's the recovery path when limits hit, and can support explain to a customer why their link stopped working without reading server logs.",
    ],
  },
  {
    id: "realtime-edges",
    title: "Real-time sync is an edge-case engine",
    updated: "Jul 6, 2026",
    preview: "The happy path is easy; reconnects are the product.",
    body: [
      "Collaborative editing looks magical in a demo with two browsers on the same Wi‑Fi. The product is what happens when one tab sleeps, the socket drops, a deploy rolls mid-session, and both users keep typing.",
      "On QuickPad I leaned on Yjs for merge semantics but still had to own the transport story: heartbeat, backoff, Redis pub/sub when instances multiply. CRDTs solve edit conflicts; they don't solve \"am I still connected?\"",
      "IndexedDB recovery wasn't a nice-to-have — it was the difference between \"refresh killed my notes\" and \"refresh is boring.\" Offline isn't an edge case on mobile; it's Tuesday.",
      "I ship real-time features with the reconnect banner and the merge indicator designed first. If those feel calm, users forgive occasional lag. If they don't, no amount of low latency saves you.",
    ],
  },
  {
    id: "ui-honest-states",
    title: "Interfaces should tell the truth about waiting",
    updated: "Jun 30, 2026",
    preview: "Ambiguous spinners are product debt.",
    body: [
      "Loading, empty, error, and partial states are where users decide if software respects their time. I don't treat them as polish — they're the contract between what the system is doing and what the user believes is happening.",
      "On dashboards and payment flows the mistake I see often is collapsing every in-flight action into one generic spinner. That trains anxiety. Per-entity status — this transfer is processing, that one failed — lets people act instead of stare.",
      "Empty states are underrated product design. \"No responses yet\" on a published form should suggest the next action: share the link, preview the public page, check analytics. Empty isn't dead air; it's onboarding.",
      "My rule: if the backend knows the state, the UI should name it. If the UI can't name it, we probably don't understand the state machine yet.",
    ],
  },
  {
    id: "split-monorepo",
    title: "Split monorepos need a story for local and prod",
    updated: "Jun 24, 2026",
    preview: "Two runtimes, one product — plan the seams.",
    body: [
      "Next.js plus FastAPI on Vercel is a productive split until the first \"works on my machine\" argument. The monorepo helps versioning; it doesn't automatically align environments, env vars, or cold starts.",
      "I document one golden path: how to run both processes locally, which ports proxy where, and which secrets belong to which deploy target. Without that, every new feature becomes a guessing game about which side owns validation.",
      "Serverless Python introduced surprises — connection pooling with Neon, Redis fallback chains for rate limits — that don't show up in frontend-only work. I budget time for those seams explicitly instead of treating the API as a black box behind fetch.",
      "The payoff when it's disciplined: ship UI and API changes in one PR with shared types at the boundary. The cost when it's not: two teams in one head, arguing in production.",
    ],
  },
  {
    id: "analytics-as-feedback",
    title: "Analytics should change the next build, not just the deck",
    updated: "Jun 19, 2026",
    preview: "Funnel drop-off is a design brief.",
    body: [
      "FormForge analytics exist because publishing a form isn't the finish line — it's when you learn which question makes people quit. Funnel views and per-field stats turn vague feedback into a ranked list of fixes.",
      "I prefer analytics that map to decisions: where to shorten a flow, which field needs clearer copy, whether mobile completion lags desktop. A chart that can't suggest an action is wallpaper.",
      "Instrumentation is a product choice. Over-tracking feels creepy; under-tracking leaves you arguing from anecdotes. I track completion events and abandonment points, not keystrokes.",
      "The loop I want: ship → measure drop-off → adjust one friction point → ship again. Analytics tools are only as good as the team's willingness to kill a question that consistently loses people.",
    ],
  },
  {
    id: "auth-friction",
    title: "Auth is a product decision before it's a security control",
    updated: "Jun 13, 2026",
    preview: "Sign-up walls kill the use case you promised.",
    body: [
      "QuickPad's no-account model wasn't anti-auth — it was pro-use-case. People share a link and edit now. Forcing registration would have traded a viral loop for a funnel nobody asked for.",
      "When auth does belong, I match the threat model to the friction. Read-only links, password-protected notes, JWT session unlock — each is a different answer to \"who should be able to do what, with what proof?\"",
      "HttpOnly cookies and short-lived tokens aren't academic; they're how you keep unlock state off the client's easy-to-steal surfaces. Security that breaks refresh or back button is still bad UX.",
      "I ask teams: are we protecting data, preventing abuse, or identifying users for billing? Those are three different systems. Mixing them creates login screens that satisfy none of the goals.",
    ],
  },
  {
    id: "velocity-with-boring",
    title: "Velocity comes from boring data paths and sharp edges",
    updated: "Jun 8, 2026",
    preview: "I reach for new tools at the boundary, not the core.",
    body: [
      "I'm not allergic to new tech — I'm selective about where it earns interest payments. CRDTs for collaborative text, MCPs for investigation, agents for drafting glue — yes. A novel database for straightforward CRUD — rarely.",
      "The pattern across QuickPad and FormForge: boring Postgres for truth, Redis where broadcast helps, established UI primitives where accessibility and mobile already solved. Novelty budget goes to the problem that actually hurts.",
      "That discipline is how I keep solo full-stack work shippable. Every exotic layer is a layer I'll debug alone at midnight.",
      "When I evaluate something new I ask: does it remove a class of bug I keep hitting, or does it just make the README exciting? Only the first answer ships.",
    ],
  },
];
