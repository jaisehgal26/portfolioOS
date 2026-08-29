"use client";

import { useMemo, useState } from "react";
import { ChevronRight, File, Folder } from "lucide-react";
import type { AppId } from "@/data/apps";
import { fileTree, folderPath, type FsFolder, type FsNode } from "@/data/files";
import { useOSStore } from "@/store/os-store";
import { cn } from "@/lib/utils";

function visibleChildren(folder: FsFolder, showHidden: boolean): FsNode[] {
  return folder.children.filter((c) => {
    if (c.type === "folder" && c.hidden) return showHidden;
    if (c.type === "file" && c.hidden) return showHidden;
    return true;
  });
}

function handleNode(
  node: FsNode,
  actions: {
    openFile: (id: string) => void;
    openApp: (id: AppId) => void;
    openUrlInBrowser: (url: string) => void;
    tryUnlock: (id: "archive-diver" | "classified-access") => void;
  },
) {
  if (node.type === "file") {
    if (node.action?.kind === "app") {
      actions.openApp(node.action.appId);
      return;
    }
    if (node.action?.kind === "url") {
      actions.openUrlInBrowser(node.action.url);
      return;
    }
    actions.openFile(node.id);
    return;
  }

  if (node.id === "archive") actions.tryUnlock("archive-diver");
  if (node.id === "classified") actions.tryUnlock("classified-access");
}

export function FilesApp() {
  const openFile = useOSStore((s) => s.openFile);
  const openApp = useOSStore((s) => s.openApp);
  const openUrlInBrowser = useOSStore((s) => s.openUrlInBrowser);
  const tryUnlock = useOSStore((s) => s.tryUnlock);
  const classifiedUnlocked = useOSStore((s) => s.classifiedUnlocked);

  const [folderId, setFolderId] = useState("root");
  const folder = useMemo(() => folderPath(folderId).at(-1) ?? fileTree, [folderId]);
  const trail = useMemo(() => folderPath(folderId), [folderId]);
  const entries = useMemo(() => visibleChildren(folder, classifiedUnlocked), [folder, classifiedUnlocked]);

  const actions = { openFile, openApp, openUrlInBrowser, tryUnlock };

  return (
    <div className="flex h-full min-h-0">
      <aside className="hidden w-40 shrink-0 overflow-y-auto border-r border-line bg-surface-2/50 p-2 sm:block">
        <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-faint">Folders</p>
        {trail.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFolderId(f.id)}
            className={cn(
              "flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-xs",
              f.id === folderId ? "bg-ink/5 font-semibold text-ink" : "text-muted hover:bg-ink/5 hover:text-ink",
            )}
          >
            <Folder className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{f.name}</span>
          </button>
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1 border-b border-line px-3 py-2 text-xs text-muted">
          {trail.map((f, i) => (
            <span key={f.id} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3 text-faint" />}
              <button
                type="button"
                onClick={() => setFolderId(f.id)}
                className={cn("hover:text-ink", f.id === folderId && "font-semibold text-ink")}
              >
                {f.name}
              </button>
            </span>
          ))}
        </div>

        <ul className="flex-1 overflow-y-auto p-2">
          {entries.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-faint">Empty folder</li>
          ) : (
            entries.map((node) => (
              <li key={node.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (node.type === "folder") setFolderId(node.id);
                    else handleNode(node, actions);
                  }}
                  onDoubleClick={() => {
                    if (node.type === "folder") setFolderId(node.id);
                    else handleNode(node, actions);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-ink/5"
                >
                  {node.type === "folder" ? (
                    <Folder className="h-4 w-4 shrink-0 text-accent" />
                  ) : (
                    <File className="h-4 w-4 shrink-0 text-muted" />
                  )}
                  <span className="truncate text-ink">{node.name}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
