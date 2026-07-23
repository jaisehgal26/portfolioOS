export type ProjectPreview = "ai-chat" | "payments" | "chat" | "healthcare" | "inventory" | "portfolio" | "notepad";
export type Accent = "accent" | "blue" | "violet" | "mint" | "amber";

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
  title: string;
  category: string;
  /** Short problem statement shown on the card. */
  summary: string;
  /** My contribution, one line. */
  contribution: string;
  stack: string[];
  /** Key frontend challenge, one line. */
  challenge: string;
  accent: Accent;
  preview: ProjectPreview;
  caseStudy: CaseStudy;
}

export const projects: Project[] = [
  {
    id: "agentic-ai-chat",
    title: "Agentic AI Chat Interface",
    category: "AI Product UI",
    summary:
      "An AI assistant that runs long, multi-step tasks — but users were left staring at a spinner with no sense of progress or trust.",
    contribution:
      "Designed and built the streaming chat experience: live tool calls, reasoning artifacts and message states.",
    stack: ["Next.js", "React", "TypeScript", "Vercel AI SDK", "SSE", "Tailwind CSS"],
    challenge: "Make a long-running, streaming AI task feel transparent, calm and trustworthy.",
    accent: "violet",
    preview: "ai-chat",
    caseStudy: {
      overview:
        "A dynamic chatbot interface that streams live tool calls, LLM actions and reasoning artifacts in real time using the Vercel AI SDK and Server-Sent Events. The interface lets people watch the assistant work instead of waiting in the dark.",
      problem:
        "Agent runs are opaque: a request goes in, then silence, then an answer. That erodes trust and makes failures impossible to read. The UI needed to narrate an unbounded, out-of-order stream of events clearly — without jumping around or stalling.",
      role: [
        "Owned the end-to-end streaming chat UI.",
        "Designed the contract that turns raw stream parts into stable, render-safe UI.",
        "Built first-class loading, streaming, tool-call, error and retry states.",
      ],
      challenges: [
        "Rendering a continuous, out-of-order event stream without layout jumps.",
        "Keeping the message tree stable while many parts update at once.",
        "Communicating progress during slow, multi-step tasks.",
      ],
      uiStates: [
        "Empty / first-run",
        "Thinking & streaming",
        "Tool-call in progress",
        "Reasoning artifact",
        "Error + retry",
        "Final answer",
      ],
      architecture: [
        "Next.js App Router with a component-driven message renderer.",
        "SSE transport feeding an event reducer into a keyed message model.",
        "Each message part owns a small state machine (pending → streaming → done).",
      ],
      screens: [
        "Streaming message bubbles with a soft typing caret.",
        "Tool-call cards with arguments and status.",
        "A reasoning-artifact timeline for multi-step plans.",
      ],
      improved: [
        "Turned a black-box assistant into a transparent, readable experience.",
        "Made failures recoverable without losing the conversation.",
      ],
      next: [
        "Add run replay so a conversation can be reviewed after the fact.",
        "Virtualize very long runs to keep memory flat.",
      ],
    },
  },
  {
    id: "realtime-payments",
    title: "Real-Time Payments Module",
    category: "Fintech UX",
    summary:
      "Payments take time to settle, and uncertainty during that wait was driving anxiety and support tickets.",
    contribution:
      "Led frontend development of the payments module with live, trustworthy status tracking.",
    stack: ["React", "Redux", "TypeScript", "SSE", "REST APIs"],
    challenge: "Turn unavoidable payment latency into calm, legible progress.",
    accent: "accent",
    preview: "payments",
    caseStudy: {
      overview:
        "A payments module with real-time transaction tracking built on React, Redux, TypeScript and Server-Sent Events. It keeps people confident during the most anxious moment in any product — waiting for money to move.",
      problem:
        "Payment latency is unavoidable, but uncertainty is not. Users needed honest, live feedback through pending → processing → succeeded / failed, and a clear path to recover when something broke.",
      role: [
        "Led frontend design and development of the payments module.",
        "Integrated SSE for real-time status transitions.",
        "Designed the waiting-state UX so latency reads as progress, not a hang.",
      ],
      challenges: [
        "Building trust during the wait without misleading the user.",
        "Reconciling streamed events with REST snapshots.",
        "Designing a recovery path that never leaves a transaction ambiguous.",
      ],
      uiStates: ["Pending", "Processing", "Succeeded", "Failed", "Retrying", "Receipt"],
      architecture: [
        "Normalized Redux transaction store reconciled against the SSE stream.",
        "Per-transaction status machine driving the UI.",
        "Error states that surface next steps, not dead ends.",
      ],
      screens: [
        "A payment status timeline with soft transitions.",
        "A transaction detail drawer with full history.",
        "Distinct success, failed and retry treatments.",
      ],
      improved: [
        "Reduced support anxiety by making the wait legible.",
        "Gave finance and support a shared, real-time view of state.",
      ],
      next: [
        "Optimistic settlement hints confirmed by webhooks.",
        "A reconciliation diff when stream and snapshot disagree.",
      ],
    },
  },
  {
    id: "realtime-chat",
    title: "Real-Time Chat Application",
    category: "Real-Time UX",
    summary:
      "A messaging product that needed to feel instant while staying correct across reconnects, devices and flaky networks.",
    contribution:
      "Built the WebSocket chat interface with presence, receipts and resilient reconnect behaviour.",
    stack: ["React", "TypeScript", "WebSockets", "Redux"],
    challenge: "Feel instant on the happy path while staying truthful at the edges.",
    accent: "blue",
    preview: "chat",
    caseStudy: {
      overview:
        "A scalable WebSocket-based chat interface with low-latency updates and smooth cross-device UX. The hard part wasn't the happy path — it was staying correct through reconnects, ordering and offline gaps.",
      problem:
        "Real-time messaging breaks at the edges: dropped sockets, out-of-order delivery, messages composed while offline. The UI had to feel instant while remaining honest about delivery state.",
      role: [
        "Built the WebSocket client and message-state model.",
        "Implemented typing indicators, presence and delivery / read receipts.",
        "Designed reconnect and offline-queue behaviour.",
      ],
      challenges: [
        "Optimistic sends reconciled against server acknowledgements.",
        "Presence and typing on a lightweight side channel.",
        "Never losing a message across a reconnect.",
      ],
      uiStates: [
        "Typing indicator",
        "Online / offline presence",
        "Delivered / read",
        "Reconnecting",
        "Offline queue",
        "Message grouping",
      ],
      architecture: [
        "Single multiplexed socket with heartbeat + backoff reconnect.",
        "Optimistic local append reconciled by message id.",
        "Queued offline messages flushed on reconnect.",
      ],
      screens: [
        "Grouped message threads with presence dots.",
        "Animated typing indicator and receipts.",
        "A reconnecting banner with backoff feedback.",
      ],
      improved: [
        "Kept a low-latency feel without lying about delivery.",
        "Survived flaky networks gracefully.",
      ],
      next: [
        "Cross-device read-cursor sync for large threads.",
        "End-to-end dedupe across multi-device sessions.",
      ],
    },
  },
  {
    id: "icu-ot",
    title: "ICU & OT Management System",
    category: "Healthcare Dashboards",
    summary:
      "Clinical teams needed live, role-aware dashboards where critical changes are impossible to miss — and impossible to misread.",
    contribution:
      "Built live vitals dashboards, complex PAC forms, role-based views and discharge workflows.",
    stack: ["React", "TypeScript", "Charts", "WebSockets", "RBAC"],
    challenge: "High-stakes, multi-role data that must read clearly under pressure.",
    accent: "mint",
    preview: "healthcare",
    caseStudy: {
      overview:
        "Healthcare dashboards with PAC forms, live vitals streaming, predictive visualizations, discharge workflows and role-based access control for doctors, nurses and admins.",
      problem:
        "Clinical UIs are high-stakes and multi-role. The same data must read differently for a doctor, a nurse and an admin, while live vitals and alert thresholds demand instant, unambiguous states.",
      role: [
        "Built the live vitals visualizations and alert states.",
        "Implemented complex PAC forms with clear, recoverable validation.",
        "Built the role-based view switcher and discharge workflow.",
      ],
      challenges: [
        "Designing alert states that can't be missed or misread.",
        "Rendering role-aware UI without leaking unauthorized actions.",
        "Keeping dense data calm and scannable.",
      ],
      uiStates: [
        "Live vitals",
        "Alert threshold",
        "Role: doctor / nurse / admin",
        "Form validation",
        "Discharge summary",
        "Loading & empty",
      ],
      architecture: [
        "Streamed vitals updating charts with explicit thresholds.",
        "Role drives both data scope and the rendered controls.",
        "Accessible form engine with inline validation.",
      ],
      screens: [
        "A live patient-vitals board with alert highlights.",
        "Role-based view switcher.",
        "A reviewable discharge summary.",
      ],
      improved: [
        "Gave each role exactly the view and actions they need.",
        "Made critical thresholds impossible to overlook.",
      ],
      next: [
        "Anomaly prediction overlays on the vitals charts.",
        "Clinician-configurable thresholds per patient.",
      ],
    },
  },
  {
    id: "product-management",
    title: "Product Management System",
    category: "Admin Platform",
    summary:
      "An inventory tool drowning operators in rows, where spotting low stock and acting in bulk took far too long.",
    contribution:
      "Built a responsive CRUD admin with auth, alerts, batch actions and AI-assisted suggestions.",
    stack: ["React", "Redux", "Tailwind CSS", "Firebase Auth", "JWT", "REST APIs"],
    challenge: "Make dense admin data effortless to scan and act on.",
    accent: "amber",
    preview: "inventory",
    caseStudy: {
      overview:
        "A responsive CRUD platform with role-based access, Firebase Auth, JWT sessions, AI-powered suggestions, notifications, inventory controls and stock alerts.",
      problem:
        "Inventory tools drown operators in rows. The UI had to make low-stock and batch operations effortless while keeping auth and sessions robust.",
      role: [
        "Built the inventory table, filters, batch actions and stock alerts.",
        "Wired Firebase Auth with JWT-based sessions.",
        "Integrated AI-powered product suggestions and notifications.",
      ],
      challenges: [
        "Keeping a dense table fast, sortable and selectable.",
        "Surfacing low stock without adding noise.",
        "Safe, fast bulk operations.",
      ],
      uiStates: [
        "Inventory table",
        "Filters",
        "Batch actions",
        "Empty state",
        "Stock alert",
        "Notification",
      ],
      architecture: [
        "Redux store with REST CRUD and derived stock selectors.",
        "Role-scoped routes and controls.",
        "Threshold-driven alerts and notifications.",
      ],
      screens: [
        "A sortable inventory table with selection.",
        "Stock-alert cards for items below threshold.",
        "A product-suggestion panel and batch action bar.",
      ],
      improved: [
        "Cut the time to spot and act on low stock.",
        "Made bulk operations safe and fast.",
      ],
      next: [
        "An audit trail for every inventory change.",
        "Role-scoped batch permissions.",
      ],
    },
  },
];
