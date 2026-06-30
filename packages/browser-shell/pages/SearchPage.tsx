"use client";

import { FolderKanban, Notebook, Search, Blocks } from "lucide-react";
import { useBrowserStore } from "@jaios/kernel/browser-store";
import { projects } from "@jaios/content/projects";
import { skillGroups } from "@jaios/content/skills";
import { notes } from "@jaios/content/notes";

export function SearchPage({ q }: { q: string }) {
  const navigate = useBrowserStore((s) => s.navigate);
  const query = q.trim().toLowerCase();

  const projectHits = projects.filter((p) =>
    `${p.title} ${p.summary} ${p.category} ${p.stack.join(" ")}`.toLowerCase().includes(query),
  );
  const skillHits = skillGroups.filter((g) =>
    `${g.title} ${g.description} ${g.skills.join(" ")}`.toLowerCase().includes(query),
  );
  const noteHits = notes.filter((n) =>
    `${n.title} ${n.preview} ${n.body.join(" ")}`.toLowerCase().includes(query),
  );
  const total = projectHits.length + skillHits.length + noteHits.length;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
        Results for &ldquo;{q}&rdquo;
      </h1>
      <p className="mt-1 text-sm text-muted">{total} result{total === 1 ? "" : "s"} across the portfolio.</p>

      {total === 0 && (
        <div className="mt-10 text-center text-sm text-faint">
          <Search className="mx-auto h-8 w-8" />
          <p className="mt-3">No matches. Try &ldquo;react&rdquo;, &ldquo;payments&rdquo;, or &ldquo;real-time&rdquo;.</p>
        </div>
      )}

      <div className="mt-6 space-y-2">
        {projectHits.map((p) => (
          <Result key={p.id} icon={<FolderKanban className="h-4 w-4" />} title={p.title} sub={p.summary} onClick={() => navigate(`jai://projects/${p.id}`)} />
        ))}
        {noteHits.map((n) => (
          <Result key={n.id} icon={<Notebook className="h-4 w-4" />} title={n.title} sub={n.preview} onClick={() => navigate(`jai://notes/${n.id}`)} />
        ))}
        {skillHits.map((g) => (
          <Result key={g.id} icon={<Blocks className="h-4 w-4" />} title={g.title} sub={g.skills.join(" · ")} onClick={() => navigate("jai://skills")} />
        ))}
      </div>
    </div>
  );
}

function Result({ icon, title, sub, onClick }: { icon: React.ReactNode; title: string; sub: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-left shadow-soft transition-colors hover:bg-ink/[0.04]"
    >
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-surface-2 text-muted">{icon}</span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{title}</span>
        <span className="block truncate text-xs text-muted">{sub}</span>
      </span>
    </button>
  );
}
