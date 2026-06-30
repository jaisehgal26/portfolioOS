"use client";

import { ArrowUpRight, Github, Linkedin, Mail, Phone } from "lucide-react";
import { CopyButton } from "@jaios/ui/CopyButton";
import { links } from "@jaios/content/profile";

const channels = [
  { label: "Email", value: links.email, icon: Mail, href: `mailto:${links.email}`, copy: links.email },
  { label: "Phone", value: links.phone, icon: Phone, href: links.phoneHref, copy: links.phone },
  { label: "LinkedIn", value: links.linkedinLabel, icon: Linkedin, href: links.linkedin, external: true },
  { label: "GitHub", value: links.githubLabel, icon: Github, href: links.github, external: true },
];

export function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Let&apos;s build something</h1>
      <p className="mt-1 text-sm text-muted">Frontend-heavy SaaS, dashboards, real-time or AI product UI — let&apos;s connect.</p>

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
                  className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-ink"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
