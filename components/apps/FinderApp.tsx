"use client";

import {
  Blocks,
  Briefcase,
  ChevronRight,
  FileText,
  FolderKanban,
  Globe,
  Hammer,
  Mail,
  Notebook,
  User,
  type LucideIcon,
} from "lucide-react";
import { useOSStore } from "@/store/os-store";
import { FINDER_SECTIONS } from "@/data/sections";
import { AboutApp } from "./AboutApp";
import { SkillsApp } from "./SkillsApp";
import { ResumeDocument } from "./ResumeApp";
import { ContactApp } from "./ContactApp";
import {
  WorkSection,
  ProjectsSection,
  ExperienceSection,
  NotesSection,
  BuildingJaiOSSection,
} from "./finderSections";
import { cn } from "@/lib/utils";

const ROOT = "Finder";

const ICONS: Record<string, LucideIcon> = {
  about: User,
  work: FolderKanban,
  projects: Globe,
  "building-jaios": Hammer,
  experience: Briefcase,
  skills: Blocks,
  notes: Notebook,
  resume: FileText,
  contact: Mail,
};

const SECTIONS = FINDER_SECTIONS.map((s) => ({ ...s, icon: ICONS[s.id] ?? User }));

function Content({ id }: { id: string }) {
  switch (id) {
    case "work":
      return <WorkSection />;
    case "projects":
      return <ProjectsSection />;
    case "building-jaios":
      return <BuildingJaiOSSection />;
    case "experience":
      return <ExperienceSection />;
    case "skills":
      return <SkillsApp />;
    case "notes":
      return <NotesSection />;
    case "resume":
      return <ResumeDocument />;
    case "contact":
      return <ContactApp />;
    default:
      return <AboutApp />;
  }
}

export function FinderApp() {
  const finderSection = useOSStore((s) => s.finderSection);
  const setFinderSection = useOSStore((s) => s.setFinderSection);
  const selected = finderSection ?? "about";
  const current = SECTIONS.find((s) => s.id === selected) ?? SECTIONS[0];

  return (
    <div className="flex h-full flex-col md:flex-row">
      <aside className="max-h-44 shrink-0 overflow-y-auto border-b border-line bg-surface-2/40 p-2 md:max-h-none md:w-56 md:border-b-0 md:border-r">
        <div className="flex gap-1 md:flex-col">
          {SECTIONS.map((s) => {
            const isCurrent = selected === s.id;
            return (
              <button
                key={s.id}
                type="button"
                data-tour={s.id === "work" ? "finder-work" : s.id === "contact" ? "finder-contact" : undefined}
                onClick={() => setFinderSection(s.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                  isCurrent ? "bg-ink/[0.06] text-ink" : "text-muted hover:bg-ink/[0.04] hover:text-ink",
                )}
              >
                <s.icon className={cn("h-4 w-4 shrink-0", isCurrent ? "text-accent" : "text-ink/70")} />
                <span className="truncate">{s.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-hidden">
          <Content id={selected} />
        </div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 border-t border-line px-4 py-1.5 text-[11px]">
          <span className="text-muted">{ROOT}</span>
          <ChevronRight className="h-3 w-3 text-faint" />
          <span className="font-medium text-ink">{current.label}</span>
        </nav>
      </div>
    </div>
  );
}
