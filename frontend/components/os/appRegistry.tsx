import type { ComponentType } from "react";
import type { AppId } from "@/data/apps";
import { AboutApp } from "@/components/apps/AboutApp";
import { ResumeApp } from "@/components/apps/ResumeApp";
import { ProjectsApp } from "@/components/apps/ProjectsApp";
import { CaseStudiesApp } from "@/components/apps/CaseStudiesApp";
import { SkillsApp } from "@/components/apps/SkillsApp";
import { ExperienceApp } from "@/components/apps/ExperienceApp";
import { ContactApp } from "@/components/apps/ContactApp";
import { FinderApp } from "@/components/apps/FinderApp";
import { BrowserApp } from "@/components/apps/BrowserApp";
import { NotesApp } from "@/components/apps/NotesApp";
import { SettingsApp } from "@/components/apps/SettingsApp";
import { SystemMonitorApp } from "@/components/apps/SystemMonitorApp";
import { ChangelogApp } from "@/components/apps/ChangelogApp";
import { KnowledgeApp } from "@/components/apps/KnowledgeApp";
import { MusicApp } from "@/components/apps/MusicApp";
import { TextViewerApp } from "@/components/apps/TextViewerApp";
import { TerminalApp } from "@/components/apps/TerminalApp";
import { SnakeApp } from "@/components/apps/SnakeApp";
import { PianoApp } from "@/components/apps/PianoApp";
import { SecretApp } from "@/components/apps/SecretApp";
import { LaunchpadApp } from "@/components/apps/LaunchpadApp";
import { CalculatorApp } from "@/components/apps/CalculatorApp";
import { TodoApp } from "@/components/apps/TodoApp";
import { NotepadApp } from "@/components/apps/NotepadApp";
import { ClockApp } from "@/components/apps/ClockApp";
import { UnitConverterApp } from "@/components/apps/UnitConverterApp";
import { GuestbookApp } from "@/components/apps/GuestbookApp";

export const APP_COMPONENTS: Record<AppId, ComponentType> = {
  about: AboutApp,
  resume: ResumeApp,
  projects: ProjectsApp,
  "case-studies": CaseStudiesApp,
  skills: SkillsApp,
  experience: ExperienceApp,
  contact: ContactApp,
  finder: FinderApp,
  browser: BrowserApp,
  notes: NotesApp,
  settings: SettingsApp,
  "system-monitor": SystemMonitorApp,
  changelog: ChangelogApp,
  knowledge: KnowledgeApp,
  music: MusicApp,
  "text-viewer": TextViewerApp,
  terminal: TerminalApp,
  snake: SnakeApp,
  piano: PianoApp,
  secret: SecretApp,
  launchpad: LaunchpadApp,
  calculator: CalculatorApp,
  todo: TodoApp,
  notepad: NotepadApp,
  clock: ClockApp,
  "unit-converter": UnitConverterApp,
  guestbook: GuestbookApp,
};
