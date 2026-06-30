import type { ComponentType } from "react";
import type { AppId } from "@jaios/kernel/data/apps";
import { AboutApp } from "@jaios/apps/AboutApp";
import { ResumeApp } from "@jaios/apps/ResumeApp";
import { ProjectsApp } from "@jaios/apps/ProjectsApp";
import { CaseStudiesApp } from "@jaios/apps/CaseStudiesApp";
import { SkillsApp } from "@jaios/apps/SkillsApp";
import { ExperienceApp } from "@jaios/apps/ExperienceApp";
import { ContactApp } from "@jaios/apps/ContactApp";
import { FinderApp } from "@jaios/apps/FinderApp";
import { BrowserApp } from "@jaios/apps/BrowserApp";
import { NotesApp } from "@jaios/apps/NotesApp";
import { SettingsApp } from "@jaios/apps/SettingsApp";
import { SystemMonitorApp } from "@jaios/apps/SystemMonitorApp";
import { ExperimentsApp } from "@jaios/apps/ExperimentsApp";
import { TextViewerApp } from "@jaios/apps/TextViewerApp";
import { TerminalApp } from "@jaios/apps/TerminalApp";
import { SnakeApp } from "@jaios/apps/SnakeApp";
import { SecretApp } from "@jaios/apps/SecretApp";
import { LaunchpadApp } from "@jaios/apps/LaunchpadApp";
import { CalculatorApp } from "@jaios/apps/CalculatorApp";
import { TodoApp } from "@jaios/apps/TodoApp";
import { NotepadApp } from "@jaios/apps/NotepadApp";
import { ClockApp } from "@jaios/apps/ClockApp";
import { UnitConverterApp } from "@jaios/apps/UnitConverterApp";

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
  experiments: ExperimentsApp,
  "text-viewer": TextViewerApp,
  terminal: TerminalApp,
  snake: SnakeApp,
  secret: SecretApp,
  launchpad: LaunchpadApp,
  calculator: CalculatorApp,
  todo: TodoApp,
  notepad: NotepadApp,
  clock: ClockApp,
  "unit-converter": UnitConverterApp,
};
