"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CornerDownLeft,
  Download,
  Github,
  Linkedin,
  Mail,
  MoonStar,
  Phone,
  Search,
} from "lucide-react";
import { useOSStore } from "@/store/os-store";
import { APPS } from "@/data/apps";
import { links } from "@/data/profile";
import { downloadResume } from "@/lib/download";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { AppIcon } from "./AppIcon";
import { cn } from "@/lib/utils";

type Group = "Sections" | "Apps" | "Actions" | "Links" | "View";
const GROUP_ORDER: Group[] = ["Sections", "Apps", "Actions", "Links", "View"];

/** Apps now folded into the Finder hub (not launchable on their own). */
const FOLDED = new Set([
  "about", "projects", "case-studies", "skills", "experience", "resume",
  "contact", "notes", "text-viewer", "secret",
]);

const SECTIONS: { id: string; label: string; keywords: string }[] = [
  { id: "about", label: "About", keywords: "bio who" },
  { id: "work", label: "Work", keywords: "projects case studies portfolio" },
  { id: "experience", label: "Experience", keywords: "career roles jobs" },
  { id: "skills", label: "Skills", keywords: "tech stack tools" },
  { id: "notes", label: "Notes", keywords: "writing frontend" },
  { id: "resume", label: "Resume", keywords: "cv pdf" },
  { id: "contact", label: "Contact", keywords: "email reach" },
];

interface Command {
  id: string;
  label: string;
  hint?: string;
  group: Group;
  keywords?: string;
  icon: React.ReactNode;
  run: () => void;
}

const iconCls = "h-4 w-4";

export function Spotlight() {
  const open = useOSStore((s) => s.spotlightOpen);
  const close = useOSStore((s) => s.closeSpotlight);
  const openApp = useOSStore((s) => s.openApp);
  const openFinderAt = useOSStore((s) => s.openFinderAt);
  const toggleTheme = useOSStore((s) => s.toggleTheme);
  const pushToast = useOSStore((s) => s.pushToast);
  const reduced = usePrefersReducedMotion();
  const { copy } = useCopyToClipboard();

  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const doCopy = useCallback(
    async (value: string, label: string) => {
      const ok = await copy(value);
      if (ok !== false) pushToast(`${label} copied`);
    },
    [copy, pushToast],
  );

  const commands = useMemo<Command[]>(() => {
    const sectionCmds: Command[] = SECTIONS.map((s) => ({
      id: `section-${s.id}`,
      label: s.label,
      group: "Sections",
      keywords: s.keywords,
      icon: <BookOpen className={iconCls} />,
      run: () => openFinderAt(s.id),
    }));

    const appCmds: Command[] = APPS.filter((app) => !FOLDED.has(app.id)).map((app) => ({
      id: `app-${app.id}`,
      label: `Open ${app.name}`,
      hint: app.description,
      group: "Apps",
      keywords: `${app.shortName} ${app.category}`,
      icon: <AppIcon app={app} size="xs" />,
      run: () => openApp(app.id),
    }));

    return [
      ...sectionCmds,
      ...appCmds,
      {
        id: "download-resume",
        label: "Download Resume",
        group: "Actions",
        keywords: "cv pdf cover letter",
        icon: <Download className={iconCls} />,
        run: () => downloadResume(),
      },
      {
        id: "copy-email",
        label: "Copy Email",
        hint: links.email,
        group: "Actions",
        icon: <Mail className={iconCls} />,
        run: () => void doCopy(links.email, "Email"),
      },
      {
        id: "copy-phone",
        label: "Copy Phone",
        hint: links.phone,
        group: "Actions",
        icon: <Phone className={iconCls} />,
        run: () => void doCopy(links.phone, "Phone"),
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        group: "Links",
        icon: <Linkedin className={iconCls} />,
        run: () => window.open(links.linkedin, "_blank", "noopener,noreferrer"),
      },
      {
        id: "github",
        label: "Open GitHub",
        group: "Links",
        icon: <Github className={iconCls} />,
        run: () => window.open(links.github, "_blank", "noopener,noreferrer"),
      },
      {
        id: "theme",
        label: "Toggle Theme",
        group: "View",
        icon: <MoonStar className={iconCls} />,
        run: toggleTheme,
      },
    ];
  }, [openApp, openFinderAt, toggleTheme, doCopy]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.group} ${c.hint ?? ""} ${c.keywords ?? ""}`.toLowerCase().includes(q));
  }, [commands, query]);

  const grouped = useMemo(() => {
    const map = new Map<Group, Command[]>();
    for (const c of filtered) {
      const arr = map.get(c.group) ?? [];
      arr.push(c);
      map.set(c.group, arr);
    }
    return GROUP_ORDER.filter((g) => map.has(g)).map((g) => ({ group: g, items: map.get(g)! }));
  }, [filtered]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = prev;
      };
    }
    setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-i="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[active];
      if (cmd) {
        cmd.run();
        close();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  let flat = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.15 }}
        >
          <button aria-label="Close search" tabIndex={-1} onClick={close} className="absolute inset-0 cursor-default bg-ink/25 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Spotlight search"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: reduced ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong relative w-full max-w-xl overflow-hidden rounded-3xl shadow-window"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="h-4 w-4 text-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search apps and actions…"
                aria-label="Search"
                className="h-14 flex-1 bg-transparent text-base text-ink placeholder:text-faint focus:outline-none"
              />
              <kbd className="hidden rounded-md border border-line bg-surface-2 px-1.5 py-0.5 text-xs text-faint sm:block">Esc</kbd>
            </div>

            <div ref={listRef} className="max-h-[min(56vh,26rem)] overflow-y-auto p-2">
              {grouped.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-faint">No results for “{query}”.</p>
              )}
              {grouped.map(({ group, items }) => (
                <div key={group} className="mb-1.5 last:mb-0">
                  <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-faint">{group}</p>
                  {items.map((cmd) => {
                    flat += 1;
                    const i = flat;
                    const isActive = i === active;
                    return (
                      <button
                        key={cmd.id}
                        data-i={i}
                        type="button"
                        onMouseMove={() => setActive(i)}
                        onClick={() => {
                          cmd.run();
                          close();
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors",
                          isActive ? "bg-ink/[0.06]" : "",
                        )}
                      >
                        <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-lg", typeof cmd.icon === "object" ? "" : "border border-line bg-surface-2 text-muted")}>
                          {cmd.icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-ink">{cmd.label}</span>
                          {cmd.hint && <span className="block truncate text-xs text-muted">{cmd.hint}</span>}
                        </span>
                        {isActive && <ArrowRight className="h-3.5 w-3.5 text-faint" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-xs text-faint">
              <span className="flex items-center gap-1.5">
                <CornerDownLeft className="h-3 w-3" /> to open
              </span>
              <span>JaiOS Spotlight</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
