import type { AppId } from "./apps";
import { notes } from "./notes";
import { profile, links } from "./profile";

export type FsAction =
  | { kind: "app"; appId: AppId }
  | { kind: "url"; url: string };

export interface FsFile {
  type: "file";
  id: string;
  name: string;
  title: string;
  ext: "md" | "txt" | "url";
  updated?: string;
  body: string[];
  hidden?: boolean;
  action?: FsAction;
}

export interface FsFolder {
  type: "folder";
  id: string;
  name: string;
  hidden?: boolean;
  children: FsNode[];
}

export type FsNode = FsFolder | FsFile;

const noteFiles: FsFile[] = notes.map((n) => ({
  type: "file",
  id: `note-${n.id}`,
  name: `${n.id}.md`,
  title: n.title,
  ext: "md",
  updated: n.updated,
  body: n.body,
}));

export const fileTree: FsFolder = {
  type: "folder",
  id: "root",
  name: "Portfolio",
  children: [
    { type: "folder", id: "notes", name: "Notes", children: noteFiles },
    {
      type: "folder",
      id: "profile",
      name: "Profile",
      children: [
        {
          type: "file",
          id: "about",
          name: "about.md",
          title: "About Jai",
          ext: "md",
          body: [profile.aboutIntro, ...profile.highlights.map((h) => `• ${h}`)],
        },
        {
          type: "file",
          id: "stack",
          name: "stack.txt",
          title: "Core stack",
          ext: "txt",
          body: [profile.coreStack.join("  ·  ")],
        },
        {
          type: "file",
          id: "contact",
          name: "contact.txt",
          title: "Contact",
          ext: "txt",
          body: [
            `Email     ${links.email}`,
            `Phone     ${links.phone}`,
            `LinkedIn  ${links.linkedinLabel}`,
            `GitHub    ${links.githubLabel}`,
          ],
        },
      ],
    },
    {
      type: "folder",
      id: "archive",
      name: "Archive",
      children: [
        {
          type: "file",
          id: "old-portfolio",
          name: "old-portfolio.url",
          title: "Previous portfolio",
          ext: "url",
          body: [`Opens ${links.oldPortfolio} in Browser.`],
          action: { kind: "url", url: links.oldPortfolio },
        },
        {
          type: "file",
          id: "legacy-readme",
          name: "README.txt",
          title: "Archive notes",
          ext: "txt",
          body: [
            "Snapshots from earlier portfolio iterations.",
            "The .url shortcut opens the last static site before JaiOS.",
          ],
        },
      ],
    },
    {
      type: "folder",
      id: "case-studies-fs",
      name: "Case Studies",
      children: [
        {
          type: "file",
          id: "cs-hub",
          name: "index.shortcut",
          title: "Case Studies app",
          ext: "txt",
          body: ["Shortcut — opens the Case Studies app."],
          action: { kind: "app", appId: "case-studies" },
        },
        {
          type: "file",
          id: "cs-projects",
          name: "projects.shortcut",
          title: "Projects app",
          ext: "txt",
          body: ["Shortcut — opens the Projects gallery."],
          action: { kind: "app", appId: "projects" },
        },
      ],
    },
    {
      type: "folder",
      id: "classified",
      name: ".classified",
      hidden: true,
      children: [
        {
          type: "file",
          id: "classified-readme",
          name: "README.txt",
          title: "Classified",
          ext: "txt",
          body: [
            "You weren't supposed to find this folder.",
            "Try `sudo open secret` in Terminal — or keep exploring the dossier.",
          ],
        },
        {
          type: "file",
          id: "secret-shortcut",
          name: "secret.shortcut",
          title: "Secret app",
          ext: "txt",
          body: ["Opens the Secret app."],
          action: { kind: "app", appId: "secret" },
        },
      ],
    },
    {
      type: "file",
      id: "readme",
      name: "README.md",
      title: "Read me",
      ext: "md",
      body: [
        "Welcome to JaiOS — a full-stack software engineering portfolio built as a tiny operating system.",
        "Browse these files in the explorer and open apps from the dock.",
        "Everything here is real React, TypeScript and Tailwind — no screenshots.",
        "Hint: try `ls -a` in Terminal for hidden folders.",
      ],
    },
  ],
};

/** Flat list of every file in the tree. */
export const allFiles: FsFile[] = (function collect(node: FsNode): FsFile[] {
  return node.type === "file" ? [node] : node.children.flatMap(collect);
})(fileTree);

export function getFile(id: string): FsFile | undefined {
  return allFiles.find((f) => f.id === id);
}

export function findFolder(id: string): FsFolder | undefined {
  function walk(node: FsNode): FsFolder | undefined {
    if (node.type !== "folder") return undefined;
    if (node.id === id) return node;
    for (const child of node.children) {
      const found = walk(child);
      if (found) return found;
    }
    return undefined;
  }
  return walk(fileTree);
}

/** Trail of folders from root down to (and including) the folder `id`. */
export function folderPath(id: string): FsFolder[] {
  let result: FsFolder[] = [];
  function walk(folder: FsFolder, trail: FsFolder[]): boolean {
    const next = [...trail, folder];
    if (folder.id === id) {
      result = next;
      return true;
    }
    for (const child of folder.children) {
      if (child.type === "folder" && walk(child, next)) return true;
    }
    return false;
  }
  walk(fileTree, []);
  return result;
}

/** List child names for a folder path (e.g. "" or "notes"). */
export function listFolderEntries(pathArg: string, showHidden: boolean): string[] {
  const parts = pathArg.split("/").filter(Boolean);
  let folder: FsFolder = fileTree;
  for (const part of parts) {
    const child = folder.children.find(
      (c) => c.type === "folder" && (c.name === part || c.id === part),
    );
    if (!child || child.type !== "folder") return [];
    folder = child;
  }
  return folder.children
    .filter((c) => {
      if (!showHidden && c.hidden) return false;
      return true;
    })
    .map((c) => (c.type === "folder" ? `${c.name}/` : c.name));
}

/** Resolve a file by path like `notes/problem-first.md` or id. */
export function resolveFilePath(pathArg: string): FsFile | undefined {
  const trimmed = pathArg.trim();
  if (!trimmed) return undefined;
  const byId = getFile(trimmed);
  if (byId) return byId;

  const parts = trimmed.split("/").filter(Boolean);
  const fileName = parts.pop();
  if (!fileName) return undefined;

  let folder: FsFolder = fileTree;
  for (const part of parts) {
    const child = folder.children.find(
      (c) => c.type === "folder" && (c.name === part || c.id === part || c.name === `.${part}`),
    );
    if (!child || child.type !== "folder") return undefined;
    folder = child;
  }

  const file = folder.children.find((c) => c.type === "file" && c.name === fileName);
  return file?.type === "file" ? file : undefined;
}
