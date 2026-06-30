"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NotebookPen } from "lucide-react";
import { AppTwoPane } from "@/components/ui/AppShell";
import { notes } from "@jaios/content/notes";
import { usePrefersReducedMotion } from "@jaios/kernel/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export function NotesApp() {
  const reduced = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState(notes[0].id);
  const note = notes.find((n) => n.id === activeId) ?? notes[0];

  return (
    <AppTwoPane
      sidebarClassName="md:w-72"
      sidebar={
        <div className="flex gap-1 p-2 md:flex-col">
          {notes.map((n) => {
            const isActive = n.id === activeId;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setActiveId(n.id)}
                className={cn(
                  "w-60 shrink-0 rounded-xl px-3 py-2.5 text-left transition-colors md:w-auto",
                  isActive ? "bg-ink/[0.06]" : "hover:bg-ink/[0.04]",
                )}
              >
                <span className="block truncate text-sm font-medium text-ink">{n.title}</span>
                <span className="mt-0.5 block truncate text-xs text-muted">{n.preview}</span>
                <span className="mt-1 block text-[11px] text-faint">{n.updated}</span>
              </button>
            );
          })}
        </div>
      }
    >
      <div className="h-full overflow-y-auto p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.article
            key={note.id}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-xl"
          >
            <div className="mb-1 flex items-center gap-2 text-mint">
              <NotebookPen className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider text-faint">Frontend note</span>
            </div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">{note.title}</h1>
            <p className="mt-1 text-xs text-faint">{note.updated}</p>
            <div className="mt-5 space-y-4">
              {note.body.map((p, i) => (
                <p key={i} className="leading-relaxed text-muted">{p}</p>
              ))}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </AppTwoPane>
  );
}
