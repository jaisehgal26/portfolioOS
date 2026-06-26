export interface Note {
  id: string;
  title: string;
  updated: string;
  preview: string;
  body: string[];
}

export const notes: Note[] = [
  {
    id: "realtime-states",
    title: "Handling real-time UI states",
    updated: "Pinned",
    preview: "Treat the stream as events; render a stable, keyed view model.",
    body: [
      "Real-time UI lives or dies on the edges. I treat an SSE or WebSocket feed as an ordered stream of events and fold them into a stable, keyed view model — never re-parsing the whole payload per message.",
      "Each live node owns a small state machine: pending → streaming → done → error. That keeps the tree stable while many parts update at once, and makes reconnects and out-of-order delivery something the UI can actually express.",
      "I always design the stalled, errored and reconnecting states up front. They're not edge cases — they're the experience during a slow network.",
    ],
  },
  {
    id: "ui-states-matter",
    title: "Why loading, error & empty states matter",
    updated: "2 days ago",
    preview: "The happy path is the easy 20%. The states around it are the craft.",
    body: [
      "Polished final screens are easy. The craft is everything around the happy path: empty, loading, partial, error, retry, offline, permission-denied.",
      "These are the states users actually live in while waiting on a network or a backend. A thoughtful empty state guides the next action; a good error explains and offers a way forward instead of dead-ending.",
      "I'd rather over-invest here than ship a demo that only works when everything goes right.",
    ],
  },
  {
    id: "reusable-components",
    title: "Structuring reusable components",
    updated: "5 days ago",
    preview: "Clear props, tight state boundaries, dumb presentational pieces.",
    body: [
      "I break UI into small components with clear props and tight state boundaries. Presentational pieces stay dumb; only the state that must be shared gets lifted.",
      "Typed contracts (TypeScript) make components safe to reuse and refactor across feature teams. Reuse beats clever — predictable beats surprising.",
      "Data lives in typed files, UI in primitives, feature logic in clearly bounded modules. A teammate should be able to extend it without reading the whole tree.",
    ],
  },
  {
    id: "responsive",
    title: "Approaching responsive UI",
    updated: "1 week ago",
    preview: "Mobile-first, content-driven breakpoints, no squeezed desktops.",
    body: [
      "I design mobile-first and let content — not arbitrary device widths — drive breakpoints. A layout should reflow into something intentional at every size, not a shrunken desktop.",
      "On complex surfaces (dashboards, tables, this OS) mobile gets its own shape: full-screen views, bottom navigation, stacked cards. The goal is a native-feeling experience at each size.",
    ],
  },
  {
    id: "apis-backend",
    title: "Working with APIs & backend teams",
    updated: "1 week ago",
    preview: "Speak contracts and edge cases; normalize by id; reconcile.",
    body: [
      "I collaborate closely on API contracts and the edge cases behind them. On the client I normalize by id, apply optimistic updates, then reconcile against server acks or snapshots.",
      "Clear shared types and honest status modelling mean the UI and the API agree — and the user is never left guessing what state a request is in.",
    ],
  },
  {
    id: "a11y-perf",
    title: "Accessibility & performance",
    updated: "2 weeks ago",
    preview: "Measure first; semantics, focus, keyboard paths; no layout shift.",
    body: [
      "Accessibility is pragmatic: semantic HTML, focus management, keyboard paths, real contrast, reduced-motion support. Buttons are buttons; links are links.",
      "For performance I measure first, then stabilize references, code-split heavy work, virtualize long lists and push work to server components. I watch specifically for layout shift and re-render storms — the things users actually feel.",
    ],
  },
  {
    id: "ai-tools",
    title: "Using AI tools without losing quality",
    updated: "2 weeks ago",
    preview: "AI accelerates; review, types and tests keep the bar.",
    body: [
      "I use Copilot, Cursor and ChatGPT to move faster — scaffolding, refactors, boilerplate. But generated code earns its place: it's reviewed, typed and tested like anything else.",
      "AI is a force multiplier on a strong foundation, not a replacement for understanding the system. The quality bar doesn't move.",
    ],
  },
];
