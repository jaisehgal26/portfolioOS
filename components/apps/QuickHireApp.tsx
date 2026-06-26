"use client";

import {
  ArrowUpRight,
  Briefcase,
  Check,
  Download,
  FolderKanban,
  Linkedin,
  Mail,
  Sparkles,
} from "lucide-react";
import { AppScroll } from "@/components/ui/AppShell";
import { CopyButton } from "@/components/ui/CopyButton";
import { useOSStore } from "@/store/os-store";
import { links } from "@/data/profile";

const snapshot = [
  { k: "Experience", v: "4.5+ years" },
  { k: "Role", v: "Frontend Developer" },
  { k: "Current", v: "Velotio Technologies" },
  { k: "Previous", v: "Gigmo · Wipro" },
  { k: "Core", v: "Next.js · React · TypeScript" },
  { k: "Focus", v: "Real-time UI · dashboards · AI" },
];

const roles = ["Frontend Developer", "React Developer", "Next.js Developer", "UI Engineer", "Frontend Product Engineer"];

const strengths = [
  "Building polished, responsive product UIs",
  "Real-time UX with SSE and WebSockets",
  "Complex forms and data-dense dashboards",
  "Scalable, reusable component systems",
  "AI-driven frontend interfaces",
  "API integration and state management",
];

const topProjects = [
  { title: "Agentic AI Chat Interface", note: "Streaming AI UI · Vercel AI SDK + SSE" },
  { title: "Real-Time Payments Module", note: "Live transaction tracking · React + SSE" },
  { title: "ICU & OT Management System", note: "Healthcare dashboards · vitals + RBAC" },
];

const why = [
  "I build more than pages — I build product interfaces.",
  "I design loading, error, empty, retry, offline and real-time states.",
  "I collaborate across design, backend and product teams.",
  "I care about clean code, performance, accessibility and maintainability.",
];

export function QuickHireApp() {
  const openApp = useOSStore((s) => s.openApp);

  return (
    <AppScroll>
      {/* Hero */}
      <div className="rounded-3xl border border-accent/25 bg-accent/[0.06] p-6 sm:p-7">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">
          <Sparkles className="h-3.5 w-3.5" /> Quick Hire
        </span>
        <h1 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl">
          Frontend Developer for polished, real-time product interfaces.
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          I&apos;m Jai Sehgal, a Frontend Developer with 4.5+ years building Next.js, React and
          TypeScript apps — real-time dashboards, chat systems, payment flows, AI-driven interfaces
          and scalable product UIs.
        </p>
        {/* Quick actions */}
        <div className="mt-5 flex flex-wrap gap-2.5">
          <a
            href={links.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" /> Download Resume
          </a>
          <a
            href={`mailto:${links.email}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink shadow-soft transition-transform hover:-translate-y-0.5"
          >
            <Mail className="h-4 w-4" /> Email
          </a>
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink shadow-soft transition-transform hover:-translate-y-0.5"
          >
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
          <CopyButton value={links.email} label="Copy email" toast="Email copied" />
        </div>
      </div>

      {/* Snapshot */}
      <Section title="Snapshot">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {snapshot.map((s) => (
            <div key={s.k} className="rounded-2xl border border-line bg-surface p-3.5 shadow-soft">
              <dt className="text-xs font-medium uppercase tracking-wider text-faint">{s.k}</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{s.v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Best fit roles */}
        <Section title="Best-fit roles">
          <div className="flex flex-wrap gap-2">
            {roles.map((r) => (
              <span key={r} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-sm font-medium text-ink">
                <Briefcase className="h-3.5 w-3.5 text-accent" /> {r}
              </span>
            ))}
          </div>
        </Section>

        {/* Strongest areas */}
        <Section title="Strongest areas">
          <ul className="space-y-2">
            {strengths.map((s) => (
              <li key={s} className="flex items-start gap-2.5 text-sm text-ink">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint/12 text-mint">
                  <Check className="h-3 w-3" />
                </span>
                {s}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Top projects */}
      <Section title="Top projects">
        <div className="grid gap-3 sm:grid-cols-3">
          {topProjects.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => openApp("projects")}
              className="group rounded-2xl border border-line bg-surface p-4 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <FolderKanban className="h-4 w-4 text-accent" />
                <ArrowUpRight className="h-4 w-4 text-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="mt-2 text-sm font-semibold text-ink">{p.title}</p>
              <p className="mt-0.5 text-xs text-muted">{p.note}</p>
            </button>
          ))}
        </div>
      </Section>

      {/* Why hire me */}
      <Section title="Why hire me">
        <div className="grid gap-3 sm:grid-cols-2">
          {why.map((w) => (
            <div key={w} className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2/50 p-4">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/12 text-accent">
                <Check className="h-3.5 w-3.5" />
              </span>
              <p className="text-sm leading-relaxed text-ink">{w}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => openApp("projects")}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink shadow-soft transition-transform hover:-translate-y-0.5"
        >
          <FolderKanban className="h-4 w-4" /> Open Projects
        </button>
        <button
          type="button"
          onClick={() => openApp("contact")}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink shadow-soft transition-transform hover:-translate-y-0.5"
        >
          <Mail className="h-4 w-4" /> Open Contact
        </button>
      </div>
    </AppScroll>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-faint">{title}</h2>
      {children}
    </div>
  );
}
