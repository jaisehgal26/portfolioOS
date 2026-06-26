import type { ComponentType } from "react";
import type { AppId } from "@/data/apps";
import { QuickHireApp } from "@/components/apps/QuickHireApp";
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
import { UIStateGalleryApp } from "@/components/apps/UIStateGalleryApp";
import { SystemMonitorApp } from "@/components/apps/SystemMonitorApp";
import { ExperimentsApp } from "@/components/apps/ExperimentsApp";

export const APP_COMPONENTS: Record<AppId, ComponentType> = {
  "quick-hire": QuickHireApp,
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
  "ui-gallery": UIStateGalleryApp,
  "system-monitor": SystemMonitorApp,
  experiments: ExperimentsApp,
};
