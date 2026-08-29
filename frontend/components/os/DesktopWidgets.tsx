"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Quote as QuoteIcon, RefreshCw, Wifi } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useCurrentTime } from "@/hooks/use-current-time";
import { getHealthStatusWithFallback, type HealthServiceStatus } from "@/lib/api";
import { links } from "@/data/profile";
import { WatchDial } from "./WatchDial";
import { cn } from "@/lib/utils";

const POLL_MS = 60_000;
const GITHUB_USER = "jaisehgal26";

function Widget({ className, children, delay = 0 }: { className?: string; children: React.ReactNode; delay?: number }) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("glass rounded-2xl p-4 shadow-soft", className)}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-faint">{children}</p>;
}

interface GitHubProfile {
  public_repos: number;
  followers: number;
  avatar_url: string;
}

export function ClockWidget({ delay = 0 }: { delay?: number }) {
  const now = useCurrentTime();
  const weekday = now ? now.toLocaleDateString([], { weekday: "long" }) : "";
  const month = now ? now.toLocaleDateString([], { month: "long" }) : "";

  return (
    <Widget delay={delay}>
      <div className="flex flex-col items-center gap-3 py-1" suppressHydrationWarning>
        <WatchDial brand className="h-28 w-28 drop-shadow-[0_6px_16px_rgb(var(--shadow-color)/0.18)]" />
        <div className="text-center">
          <Eyebrow>{weekday}</Eyebrow>
          <p className="mt-1 font-display text-base font-semibold tracking-tight text-ink">
            {month} {now ? now.getDate() : ""}
          </p>
        </div>
      </div>
    </Widget>
  );
}

export function GitHubWidget({ delay = 0 }: { delay?: number }) {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as GitHubProfile;
        if (!cancelled) setProfile(data);
      } catch {
        /* offline */
      }
    }
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <Widget delay={delay}>
      <div className="flex items-center gap-3">
        {profile ? (
          <img src={profile.avatar_url} alt="" className="h-10 w-10 rounded-full ring-1 ring-line" />
        ) : (
          <div className="h-10 w-10 animate-pulse rounded-full bg-ink/10" />
        )}
        <div className="min-w-0 flex-1">
          <Eyebrow>GitHub</Eyebrow>
          <p className="truncate text-sm font-semibold text-ink">@{GITHUB_USER}</p>
          {profile ? (
            <p className="text-xs text-muted">
              {profile.public_repos} repos · {profile.followers} followers
            </p>
          ) : (
            <p className="text-xs text-faint">Loading…</p>
          )}
        </div>
        <Github className="h-4 w-4 shrink-0 text-muted" />
      </div>
      <a
        href={links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block text-center text-xs font-medium text-accent hover:underline"
      >
        View profile
      </a>
    </Widget>
  );
}

function serviceLabel(key: string): string {
  if (key.includes("jaios") || key.includes("portfolio")) return "JaiOS";
  if (key.includes("quickpad")) return "QuickPad";
  if (key.includes("formforge")) return "FormForge";
  return key;
}

export function UptimeWidget({ delay = 0 }: { delay?: number }) {
  const [services, setServices] = useState<HealthServiceStatus[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getHealthStatusWithFallback();
        if (!cancelled) {
          setServices(data.services);
          setFailed(false);
        }
      } catch {
        if (!cancelled) {
          setServices([]);
          setFailed(true);
        }
      }
    }
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const offline = typeof navigator !== "undefined" && !navigator.onLine;

  return (
    <Widget delay={delay}>
      <div className="flex items-center gap-1.5">
        <Wifi className="h-3.5 w-3.5 text-muted" />
        <Eyebrow>Uptime</Eyebrow>
      </div>
      <ul className="mt-2 space-y-1.5">
        {services === null ? (
          <li className="text-xs text-faint">Checking…</li>
        ) : failed || services.length === 0 ? (
          <li className="text-xs text-faint">
            {offline ? "Offline — connect to check services" : "Could not reach services"}
          </li>
        ) : (
          services.map((s) => {
            const up = s.status === "up";
            return (
              <li key={s.target_key} className="flex items-center justify-between gap-2 text-xs">
                <span className="truncate text-ink">{serviceLabel(s.target_key)}</span>
                <span className={cn("shrink-0 tabular-nums", up ? "text-emerald-600 dark:text-emerald-400" : "text-red-500")}>
                  {up ? `${s.latency_ms ?? "—"} ms` : "down"}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </Widget>
  );
}

interface Quote {
  content: string;
  author: string;
}

const QUOTES: Quote[] = [
  { content: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { content: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { content: "The details are not the details. They make the design.", author: "Charles Eames" },
  { content: "Programs must be written for people to read.", author: "Harold Abelson" },
  { content: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke" },
  { content: "Curiosity is an engineering superpower.", author: "Jai Sehgal" },
];

function pickQuote(exclude?: Quote): Quote {
  const pool = exclude ? QUOTES.filter((q) => q.content !== exclude.content) : QUOTES;
  return pool[Math.floor(Math.random() * pool.length)] ?? QUOTES[0];
}

export function QuoteWidget({ delay = 0 }: { delay?: number }) {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    setQuote(pickQuote());
  }, []);

  function refresh() {
    setQuote((prev) => pickQuote(prev ?? undefined));
  }

  return (
    <Widget delay={delay}>
      <div className="flex items-center justify-between">
        <Eyebrow>Thought of the day</Eyebrow>
        <button
          type="button"
          onClick={refresh}
          aria-label="New quote"
          className="grid h-6 w-6 place-items-center rounded-md text-faint transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>
      <QuoteIcon className="mt-2 h-4 w-4 text-accent/70" aria-hidden />
      {quote ? (
        <figure className="mt-1.5">
          <blockquote className="text-sm leading-relaxed text-ink">{quote.content}</blockquote>
          <figcaption className="mt-2 text-xs font-medium text-muted">— {quote.author}</figcaption>
        </figure>
      ) : null}
    </Widget>
  );
}

export function DesktopWidgets() {
  return (
    <div className="flex w-64 flex-col gap-3">
      <ClockWidget delay={0.04} />
      <GitHubWidget delay={0.07} />
      <UptimeWidget delay={0.1} />
      <QuoteWidget delay={0.13} />
    </div>
  );
}
