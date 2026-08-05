"use client";

import { AppScroll } from "@/components/ui/AppShell";
import { SkillGroupCard } from "@/components/cards/SkillGroupCard";
import { skillGroups } from "@/data/skills";

export function SkillsApp() {
  return (
    <AppScroll>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Skills</h1>
        <p className="mt-1 text-sm text-muted">
          Full-stack craft — frontend, backend, data, and delivery, grouped by how I actually use them.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {skillGroups.map((group) => (
          <SkillGroupCard key={group.id} group={group} />
        ))}
      </div>
    </AppScroll>
  );
}
