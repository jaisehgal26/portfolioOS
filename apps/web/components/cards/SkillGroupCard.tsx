import {
  Code2,
  Database,
  FlaskConical,
  Palette,
  Plug,
  Radio,
  Rocket,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { SkillGroup } from "@jaios/content/skills";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ACCENT } from "@/lib/accent";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  code: Code2,
  palette: Palette,
  database: Database,
  radio: Radio,
  plug: Plug,
  sparkles: Sparkles,
  flask: FlaskConical,
  rocket: Rocket,
  wrench: Wrench,
};

export function SkillGroupCard({ group }: { group: SkillGroup }) {
  const Icon = ICONS[group.icon] ?? Code2;
  const accent = ACCENT[group.accent];

  return (
    <Card interactive className="flex h-full flex-col p-6">
      <div className="flex items-center gap-3">
        <span className={cn("grid h-11 w-11 place-items-center rounded-2xl", accent.tile)}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{group.title}</h3>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">{group.description}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {group.skills.map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </div>

      <p className="mt-5 border-t border-line pt-4 text-sm text-muted">
        <span className={cn("font-semibold", accent.text)}>Used in · </span>
        {group.usedIn}
      </p>
    </Card>
  );
}
