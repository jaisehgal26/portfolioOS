"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search, Sparkles } from "lucide-react";
import { AppTwoPane } from "@/components/ui/AppShell";
import { ReactionButton } from "@/components/reactions/ReactionButton";
import {
  KNOWLEDGE_SECTIONS,
  searchKnowledge,
  type KnowledgeItem,
  type KnowledgeSection,
} from "@/data/knowledge";
import { cn } from "@/lib/utils";

function RecommendationCard({ item }: { item: KnowledgeItem }) {
  return (
    <article className="rounded-2xl border border-line bg-surface p-4 shadow-soft sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-lg font-semibold tracking-tight text-ink">{item.title}</h2>
          <ReactionButton targetType="knowledge" targetId={item.id} className="shrink-0" />
        </div>
        {item.href && (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:text-ink"
          >
            {item.hrefLabel ?? "Open"}
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted">{item.summary}</p>

      <div className="mt-3 rounded-xl border border-accent/20 bg-accent/5 px-3 py-2.5">
        <p className="flex items-start gap-2 text-sm text-ink/90">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
          <span>
            <span className="font-medium text-accent">Why I recommend it — </span>
            {item.recommendation}
          </span>
        </p>
      </div>

      {item.details && item.details.length > 0 && (
        <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
          {item.details.map((line) => (
            <li key={line} className="flex gap-2 text-sm text-ink/90">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              {line}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function KnowledgeApp() {
  const [section, setSection] = useState<KnowledgeSection | "all">("all");
  const [query, setQuery] = useState("");

  const items = useMemo(() => searchKnowledge(query, section), [query, section]);
  const activeSection = KNOWLEDGE_SECTIONS.find((s) => s.id === section);

  return (
    <AppTwoPane
      sidebarClassName="md:w-56"
      sidebar={
        <div className="flex gap-1 p-2 md:flex-col">
          <button
            type="button"
            onClick={() => setSection("all")}
            className={cn(
              "w-44 shrink-0 rounded-xl px-3 py-2.5 text-left text-sm transition-colors md:w-auto",
              section === "all" ? "bg-ink/[0.06] font-medium text-ink" : "text-muted hover:bg-ink/[0.04]",
            )}
          >
            All topics
          </button>
          {KNOWLEDGE_SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={cn(
                "w-44 shrink-0 rounded-xl px-3 py-2.5 text-left text-sm transition-colors md:w-auto",
                section === s.id ? "bg-ink/[0.06] font-medium text-ink" : "text-muted hover:bg-ink/[0.04]",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="h-full overflow-y-auto p-5 sm:p-7">
        <header className="mb-5">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Knowledge</h1>
          <p className="mt-1 text-sm text-muted">
            {section === "all"
              ? "Tools, libraries, and workflows I actually use — CSS, frameworks, AI dev tools, Chrome extensions, and more."
              : activeSection?.description}
          </p>
        </header>

        <div className="mb-6 flex max-w-md items-center gap-2 rounded-full border border-line bg-surface-2 px-3.5 py-2">
          <Search className="h-4 w-4 shrink-0 text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, tags, recommendations…"
            aria-label="Search knowledge base"
            className="w-full bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
          />
        </div>

        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-faint">No recommendations match your search.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <RecommendationCard key={item.id} item={item} />
            ))}
          </div>
        )}

      </div>
    </AppTwoPane>
  );
}
