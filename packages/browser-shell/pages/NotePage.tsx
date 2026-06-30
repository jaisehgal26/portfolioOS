"use client";

import { ArrowLeft } from "lucide-react";
import { useBrowserStore } from "@jaios/kernel/browser-store";
import { notes } from "@jaios/content/notes";
import { NotFoundPage } from "./NotFoundPage";

export function NotePage({ id }: { id: string }) {
  const navigate = useBrowserStore((s) => s.navigate);
  const note = notes.find((n) => n.id === id);
  if (!note) return <NotFoundPage url={`jai://notes/${id}`} />;

  return (
    <article className="mx-auto max-w-2xl px-6 py-10">
      <button
        type="button"
        onClick={() => navigate("jai://notes")}
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> All notes
      </button>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">{note.updated}</p>
      <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">{note.title}</h1>
      <div className="mt-5 space-y-4">
        {note.body.map((p, i) => (
          <p key={i} className="leading-relaxed text-muted">{p}</p>
        ))}
      </div>
    </article>
  );
}
