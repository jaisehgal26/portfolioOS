import { APPS, type AppId } from "@/data/apps";

import { ACHIEVEMENTS, type AchievementId } from "@/data/achievements";

import { CHANGELOG } from "@/data/changelog";

import { listFolderEntries, resolveFilePath } from "@/data/files";

import { profile, links, experienceYM } from "@/data/profile";

import { projects } from "@/data/projects";

import { skillGroups } from "@/data/skills";

import { WALLPAPERS } from "@/data/system";

import { formatAchievementsForTerminal } from "@/lib/achievements";

import type { Theme } from "@/store/os-store";



export type TerminalLine = { kind: "in" | "out" | "err" | "sys"; text: string };



export interface TerminalContext {

  openApp: (id: AppId) => void;

  openFile: (id: string) => void;

  openUrlInBrowser: (url: string) => void;

  setTheme: (theme: Theme) => void;

  setWallpaper: (id: string) => void;

  unlockClassified: () => void;

  tryUnlock: (id: AchievementId) => void;

  getClassifiedUnlocked: () => boolean;

  getSysinfo: () => {

    theme: Theme;

    wallpaper: string;

    windowsCount: number;

    achievementsUnlocked: number;

    online: boolean;

  };

  getUnlockedAchievements: () => string[];

}



export interface TerminalResult {

  lines: TerminalLine[];

  clear?: boolean;

}



const HIDDEN_APPS = new Set<AppId>(["text-viewer", "secret"]);



function out(text: string): TerminalLine {

  return { kind: "out", text };

}



function err(text: string): TerminalLine {

  return { kind: "err", text };

}



function sys(text: string): TerminalLine {

  return { kind: "sys", text };

}



function parseFilter(args: string[]): string {

  if (args[0] === "--filter" || args[0] === "-f") return args.slice(1).join(" ").toLowerCase();

  return args.join(" ").toLowerCase();

}



function printHelp(): TerminalLine[] {

  return [

    out("Navigation   help · ls [path] · ls -a · open <app> · clear"),

    out("Files        cat <path> — opens Text Viewer or shortcut"),

    out("Portfolio    whoami · about · projects · skills [--filter <term>] · contact"),

    out("System       theme light|dark · wallpaper <id> · date · echo <text>"),

    out("Fun          neofetch · sysinfo · changelog · achievements · sudo open secret"),

    sys("Some commands are more dangerous than others. 😏"),

  ];

}



function printNeofetch(): TerminalLine[] {

  const exp = experienceYM();

  return [

    out("        ___"),

    out("       /   \\      jai@portfolio"),

    out("      | Jai |     ─────────────"),

    out("       \\___/      OS: JaiOS (browser edition)"),

    out("                  Host: portfolioOS"),

    out(`                  Experience: ${exp} years`),

    out("                  Stack: React · Next.js · TypeScript"),

    out("                  Shell: jai-sh 1.0"),

    out("                  Theme: interactive portfolio"),

  ];

}



function printSysinfo(ctx: TerminalContext): TerminalLine[] {

  const info = ctx.getSysinfo();

  const wp = WALLPAPERS.find((w) => w.id === info.wallpaper);

  const pad = (label: string, value: string) =>

    out(`${label.padEnd(14)} ${value}`);



  return [

    out("JaiOS System Information"),

    sys("─".repeat(32)),

    pad("Hostname:", "portfolioOS"),

    pad("User:", profile.name.split(" ")[0].toLowerCase()),

    pad("Kernel:", "Next.js 15 (browser)"),

    pad("Shell:", "jai-sh 1.0"),

    pad("Theme:", info.theme),

    pad("Wallpaper:", wp?.label ?? info.wallpaper),

    pad("Apps open:", String(info.windowsCount)),

    pad("Achievements:", `${info.achievementsUnlocked}/${ACHIEVEMENTS.length}`),

    pad("Network:", info.online ? "online" : "offline"),

    sys(`Experience: ${experienceYM()} years · ${profile.role}`),

  ];

}



function findApp(query: string) {

  const q = query.toLowerCase();

  return APPS.find(

    (a) => a.id === q || a.shortName.toLowerCase() === q || a.name.toLowerCase() === q,

  );

}



export function runTerminalCommand(raw: string, ctx: TerminalContext): TerminalResult {

  const cmd = raw.trim();

  if (!cmd) return { lines: [] };



  const [name, ...args] = cmd.split(/\s+/);

  const arg = args.join(" ");

  const verb = name.toLowerCase();



  switch (verb) {

    case "help":

      return { lines: printHelp() };



    case "whoami":

      return { lines: [out(`${profile.name} — ${profile.role} · ${profile.location} · ${profile.experience}`)] };



    case "about":

      return { lines: [out(profile.aboutIntro)] };



    case "ls": {

      const showHidden = args.includes("-a") || args.includes("--all");

      if (showHidden && !ctx.getClassifiedUnlocked()) {

        ctx.unlockClassified();

      }

      const pathParts = args.filter((a) => !a.startsWith("-"));

      const pathArg = pathParts.join("/");

      const entries = listFolderEntries(pathArg, showHidden || ctx.getClassifiedUnlocked());

      if (entries.length === 0) {

        return { lines: [err(`ls: cannot access '${pathArg || "."}': No such directory`)] };

      }

      return { lines: [out(entries.join("  "))] };

    }



    case "open": {

      const app = findApp(arg);

      if (!app) return { lines: [err(`open: app not found: ${arg || "(none)"}`)] };

      ctx.openApp(app.id);

      return { lines: [out(`Opening ${app.name}…`)] };

    }



    case "cat": {

      const file = resolveFilePath(arg);

      if (!file) {

        if (/contact/i.test(arg)) return { lines: [out(`${links.email}  ·  ${links.phone}`)] };

        if (/resume/i.test(arg)) {

          ctx.openApp("resume");

          return { lines: [out("Opening resume…")] };

        }

        return { lines: [err(`cat: ${arg || "(missing operand)"}: No such file`)] };

      }

      if (file.action?.kind === "app") {

        ctx.openApp(file.action.appId);

        return { lines: [out(`Opening ${file.title}…`)] };

      }

      if (file.action?.kind === "url") {

        ctx.openUrlInBrowser(file.action.url);

        return { lines: [out(`Opening ${file.action.url} in Browser…`)] };

      }

      ctx.openFile(file.id);

      return { lines: [out(`Opening ${file.name} in Text Viewer…`)] };

    }



    case "projects":

      return {

        lines: projects.map((p, i) => out(`${String(i + 1).padStart(2, " ")}  ${p.title}  —  ${p.category}`)),

      };



    case "skills": {

      const filter = parseFilter(args);

      const groups = skillGroups

        .map((g) => ({

          ...g,

          skills: filter

            ? g.skills.filter((s) => s.toLowerCase().includes(filter))

            : g.skills,

        }))

        .filter((g) => g.skills.length > 0);



      if (groups.length === 0) return { lines: [err(`skills: no match for "${filter}"`)] };



      const lines: TerminalLine[] = [];

      for (const g of groups) {

        lines.push(out(`${g.title}: ${g.skills.join(", ")}`));

      }

      return { lines };

    }



    case "contact":

      return {

        lines: [

          out(links.email),

          out(links.phone),

          out(links.linkedin),

          out(links.github),

        ],

      };



    case "theme": {

      const mode = args[0]?.toLowerCase();

      if (mode !== "light" && mode !== "dark") {

        return { lines: [err("theme: usage: theme light|dark")] };

      }

      ctx.setTheme(mode);

      return { lines: [out(`Theme set to ${mode}.`)] };

    }



    case "wallpaper": {

      const id = args[0]?.toLowerCase();

      const wp = WALLPAPERS.find((w) => w.id === id);

      if (!wp) {

        return {

          lines: [

            err(`wallpaper: unknown id "${id ?? ""}"`),

            out(`Available: ${WALLPAPERS.map((w) => w.id).join(", ")}`),

          ],

        };

      }

      ctx.setWallpaper(wp.id);

      return { lines: [out(`Wallpaper set to ${wp.label}.`)] };

    }



    case "neofetch":

      return { lines: printNeofetch() };



    case "sysinfo":

      return { lines: printSysinfo(ctx) };



    case "changelog": {

      const recent = CHANGELOG.slice(0, 3);

      return {

        lines: recent.flatMap((e) => [

          out(`${e.date}  v${e.version}  ${e.title}`),

          sys(`  ${e.summary}`),

        ]),

      };

    }



    case "achievements": {

      const lines = formatAchievementsForTerminal(ctx.getUnlockedAchievements());

      return { lines: lines.map((l) => ({ kind: l.kind, text: l.text })) };

    }



    case "date":

      return { lines: [out(new Date().toString())] };



    case "echo":

      return { lines: [out(arg)] };



    case "clear":

      return { lines: [], clear: true };



    case "sudo": {

      const sub = args.join(" ").toLowerCase();

      if (sub === "open secret") {

        ctx.unlockClassified();

        ctx.openApp("secret");

        ctx.tryUnlock("secret-finder");

        return { lines: [sys("Elevated clearance granted. Opening Secret…")] };

      }

      return { lines: [out("Nice try — you're not root here. 🙂")] };

    }



    default:

      return { lines: [err(`command not found: ${name}`)] };

  }

}

