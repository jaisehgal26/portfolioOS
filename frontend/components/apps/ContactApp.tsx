"use client";

import { ArrowUpRight, Github, Linkedin, Mail, MessageSquare, Phone } from "lucide-react";
import { CalendlyBookButton } from "@/components/contact/CalendlyBookButton";
import { ContactForm } from "@/components/contact/ContactForm";
import { AppScroll } from "@/components/ui/AppShell";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { links } from "@/data/profile";
import { useOSStore } from "@/store/os-store";

const channels = [
  { label: "Email", value: links.email, icon: Mail, href: `mailto:${links.email}`, copy: links.email },
  { label: "Phone", value: links.phone, icon: Phone, href: links.phoneHref, copy: links.phone },
  { label: "LinkedIn", value: links.linkedinLabel, icon: Linkedin, href: links.linkedin, external: true },
  { label: "GitHub", value: links.githubLabel, icon: Github, href: links.github, external: true },
];

export function ContactApp() {
  const openApp = useOSStore((s) => s.openApp);

  return (
    <AppScroll>
      <h1 className="type-title sm:text-3xl">
        Let&apos;s build full-stack products.
      </h1>
      <p className="mt-2 max-w-xl leading-relaxed text-muted">
        Have a SaaS app, API, dashboard, real-time system, or end-to-end product slice to ship? Let&apos;s connect.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <CalendlyBookButton />
        <Button type="button" variant="secondary" size="sm" onClick={() => openApp("guestbook")}>
          <MessageSquare className="h-4 w-4" aria-hidden />
          Guestbook
        </Button>
        <span className="text-sm text-muted">or send a message below</span>
      </div>

      <button
        type="button"
        onClick={() => openApp("guestbook")}
        className="mt-4 flex w-full items-center gap-4 rounded-2xl border border-amber-500/25 bg-amber-500/8 px-4 py-3.5 text-left shadow-soft transition-colors hover:border-amber-500/40 hover:bg-amber-500/12"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400">
          <MessageSquare className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Leave a note on the guest wall</p>
          <p className="mt-0.5 text-sm text-muted">
            Short public messages — anonymous or with your name. Appears after moderation.
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-faint" aria-hidden />
      </button>

      <ContactForm />

      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {channels.map((ch) => {
          const Icon = ch.icon;
          return (
            <li key={ch.label} className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-soft">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-2 text-muted">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-faint">{ch.label}</p>
                <p className="truncate text-sm text-ink">{ch.value}</p>
              </div>
              {ch.copy ? (
                <CopyButton value={ch.copy} label={`Copy ${ch.label.toLowerCase()}`} toast={`${ch.label} copied`} />
              ) : (
                <a
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${ch.label}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-ink"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </AppScroll>
  );
}
