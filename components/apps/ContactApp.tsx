"use client";

import { useState } from "react";
import { ArrowUpRight, Github, Globe, Linkedin, Mail, Phone, Send } from "lucide-react";
import { AppScroll } from "@/components/ui/AppShell";
import { CopyButton } from "@/components/ui/CopyButton";
import { useOSStore } from "@/store/os-store";
import { links } from "@/data/profile";

const channels = [
  { label: "Email", value: links.email, icon: Mail, href: `mailto:${links.email}`, copy: links.email },
  { label: "Phone", value: links.phone, icon: Phone, href: links.phoneHref, copy: links.phone },
  { label: "LinkedIn", value: links.linkedinLabel, icon: Linkedin, href: links.linkedin, external: true },
  { label: "GitHub", value: links.githubLabel, icon: Github, href: links.github, external: true },
  { label: "Portfolio", value: links.portfolioLabel, icon: Globe, href: links.portfolio, external: true },
];

export function ContactApp() {
  const pushToast = useOSStore((s) => s.pushToast);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Hello from ${form.name || "your portfolio"}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}${form.email ? ` (${form.email})` : ""}`);
    pushToast("Opening your email app…");
    window.location.href = `mailto:${links.email}?subject=${subject}&body=${body}`;
  }

  return (
    <AppScroll>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        Let&apos;s build polished frontend products.
      </h1>
      <p className="mt-2 max-w-xl leading-relaxed text-muted">
        Have a frontend-heavy SaaS app, dashboard, real-time interface, or product UI to build? Let&apos;s connect.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Channels */}
        <ul className="space-y-2.5">
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

        {/* Form */}
        <form onSubmit={onSubmit} className="rounded-3xl border border-line bg-surface-2/50 p-5">
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wider text-faint">Name</span>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wider text-faint">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent"
                placeholder="you@company.com"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wider text-faint">Message</span>
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                required
                rows={4}
                className="mt-1 w-full resize-none rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent"
                placeholder="Tell me about the product…"
              />
            </label>
          </div>
          <button
            type="submit"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
          >
            <Send className="h-4 w-4" />
            Send message
          </button>
          <p className="mt-2 text-center text-xs text-faint">Opens your email app — no data is stored.</p>
        </form>
      </div>
    </AppScroll>
  );
}
