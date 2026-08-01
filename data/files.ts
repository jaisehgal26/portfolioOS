import { notes } from "./notes";
import { profile, links } from "./profile";

export interface FsFile {
  type: "file";
  id: string;
  name: string;
  title: string;
  ext: "md" | "txt";
  updated?: string;
  body: string[];
}

export interface FsFolder {
  type: "folder";
  id: string;
  name: string;
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
      type: "file",
      id: "readme",
      name: "README.md",
      title: "Read me",
      ext: "md",
      body: [
        "Welcome to JaiOS — a full-stack software engineering portfolio built as a tiny operating system.",
        "Browse these files in the explorer and open apps from the dock.",
        "Everything here is real React, TypeScript and Tailwind — no screenshots.",
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
