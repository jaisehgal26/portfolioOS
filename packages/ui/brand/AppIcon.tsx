import {
  Activity,
  Blocks,
  BookOpen,
  Briefcase,
  Calculator,
  Clock,
  FileText,
  FlaskConical,
  Folder,
  FolderKanban,
  Gamepad2,
  Globe,
  LayoutGrid,
  ListChecks,
  Mail,
  Notebook,
  NotepadText,
  Palette,
  Ruler,
  Settings,
  Sparkles,
  SquareTerminal,
  User,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { AppMeta } from "@jaios/kernel/data/apps";
import { cn } from "../lib/utils";

/** One cohesive icon family: a line glyph on a warm "ceramic" tile. */
const GLYPHS: Record<string, LucideIcon> = {
  zap: Zap,
  user: User,
  fileText: FileText,
  folderKanban: FolderKanban,
  bookOpen: BookOpen,
  blocks: Blocks,
  briefcase: Briefcase,
  palette: Palette,
  mail: Mail,
  folder: Folder,
  globe: Globe,
  notebook: Notebook,
  flask: FlaskConical,
  activity: Activity,
  settings: Settings,
  gamepad2: Gamepad2,
  terminal: SquareTerminal,
  sparkles: Sparkles,
  grid: LayoutGrid,
  calculator: Calculator,
  listChecks: ListChecks,
  notepadText: NotepadText,
  clock: Clock,
  ruler: Ruler,
};

const SIZES = {
  xs: { tile: "h-6 w-6 rounded-lg", glyph: "h-3.5 w-3.5" },
  sm: { tile: "h-8 w-8 rounded-[10px]", glyph: "h-[18px] w-[18px]" },
  md: { tile: "h-11 w-11 rounded-[14px]", glyph: "h-[22px] w-[22px]" },
  lg: { tile: "h-14 w-14 rounded-[18px]", glyph: "h-7 w-7" },
};

interface AppIconProps {
  app: AppMeta;
  size?: keyof typeof SIZES;
  className?: string;
  /** Tint the glyph with the accent (e.g. running/active app). */
  active?: boolean;
}

export function AppIcon({ app, size = "md", className, active = false }: AppIconProps) {
  const Glyph = GLYPHS[app.icon] ?? LayoutGrid;
  const s = SIZES[size];

  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center bg-gradient-to-b from-surface to-surface-2 ring-1 shadow-soft",
        "before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-white/55 before:to-transparent before:opacity-70 dark:before:from-white/10 dark:before:opacity-100",
        active ? "ring-accent/35" : "ring-line",
        s.tile,
        className,
      )}
    >
      <Glyph
        className={cn("relative", s.glyph, active ? "text-accent" : "text-ink/80")}
        strokeWidth={1.75}
        aria-hidden
      />
    </span>
  );
}
