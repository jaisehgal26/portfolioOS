"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  LayoutGrid,
  List,
} from "lucide-react";
import { AppTwoPane } from "@/components/ui/AppShell";
import { useOSStore } from "@/store/os-store";
import { FILE_DRAG_TYPE, fileTree, findFolder, folderPath, type FsFolder } from "@/data/files";
import { cn } from "@/lib/utils";

function TreeFolder({
  folder,
  depth,
  currentId,
  expanded,
  onSelect,
  onToggle,
}: {
  folder: FsFolder;
  depth: number;
  currentId: string;
  expanded: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const subfolders = folder.children.filter((c): c is FsFolder => c.type === "folder");
  const isOpen = expanded.has(folder.id);
  const isCurrent = currentId === folder.id;

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          onSelect(folder.id);
          if (subfolders.length) onToggle(folder.id);
        }}
        style={{ paddingLeft: depth * 14 + 8 }}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-lg py-1.5 pr-2 text-left text-sm transition-colors",
          isCurrent ? "bg-ink/[0.06] text-ink" : "text-muted hover:bg-ink/[0.04] hover:text-ink",
        )}
      >
        {subfolders.length ? (
          isOpen ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-faint" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-faint" />
          )
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {isOpen ? (
          <FolderOpen className="h-4 w-4 shrink-0 text-accent" />
        ) : (
          <Folder className="h-4 w-4 shrink-0 text-accent" />
        )}
        <span className="truncate">{folder.name}</span>
      </button>
      {isOpen &&
        subfolders.map((sf) => (
          <TreeFolder
            key={sf.id}
            folder={sf}
            depth={depth + 1}
            currentId={currentId}
            expanded={expanded}
            onSelect={onSelect}
            onToggle={onToggle}
          />
        ))}
    </div>
  );
}

export function FinderApp() {
  const openFile = useOSStore((s) => s.openFile);
  const [currentId, setCurrentId] = useState("root");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["root", "notes", "profile"]));
  const [view, setView] = useState<"grid" | "list">("grid");

  const current = findFolder(currentId) ?? fileTree;
  const trail = folderPath(currentId);
  const folders = current.children.filter((c): c is FsFolder => c.type === "folder");
  const files = current.children.filter((c) => c.type === "file");

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function select(id: string) {
    setCurrentId(id);
    setExpanded((prev) => new Set(prev).add(id));
  }
  function onFileDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData(FILE_DRAG_TYPE, id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "copy";
  }

  return (
    <AppTwoPane
      sidebar={
        <div className="p-2">
          <TreeFolder
            folder={fileTree}
            depth={0}
            currentId={currentId}
            expanded={expanded}
            onSelect={select}
            onToggle={toggle}
          />
        </div>
      }
    >
      <div className="flex h-full flex-col">
        {/* Breadcrumb + view toggle */}
        <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
          <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-0.5 text-sm">
            {trail.map((f, i) => (
              <span key={f.id} className="flex items-center gap-0.5">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-faint" />}
                <button
                  type="button"
                  onClick={() => select(f.id)}
                  className={cn(
                    "truncate rounded px-1.5 py-0.5 transition-colors hover:bg-ink/[0.04]",
                    i === trail.length - 1 ? "font-medium text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {f.name}
                </button>
              </span>
            ))}
          </nav>
          <div className="ml-auto flex shrink-0 rounded-full border border-line bg-surface-2 p-0.5">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-label="Grid view"
              className={cn("grid h-7 w-7 place-items-center rounded-full", view === "grid" ? "bg-ink text-bg" : "text-muted")}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="List view"
              className={cn("grid h-7 w-7 place-items-center rounded-full", view === "list" ? "bg-ink text-bg" : "text-muted")}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Contents */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {current.children.length === 0 ? (
            <p className="py-12 text-center text-sm text-faint">This folder is empty.</p>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {folders.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => select(f.id)}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-transparent p-3 text-center transition-colors hover:border-line hover:bg-surface-2/60"
                >
                  <Folder className="h-9 w-9 text-accent" />
                  <span className="line-clamp-1 text-sm font-medium text-ink">{f.name}</span>
                  <span className="text-xs text-muted">{f.children.length} items</span>
                </button>
              ))}
              {files.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  draggable
                  onDragStart={(e) => onFileDragStart(e, file.id)}
                  onClick={() => openFile(file.id)}
                  title="Open · or drag onto the desktop"
                  className="flex cursor-grab flex-col items-center gap-2 rounded-2xl border border-transparent p-3 text-center transition-colors hover:border-line hover:bg-surface-2/60 active:cursor-grabbing"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-b from-surface to-surface-2 text-ink/70 ring-1 ring-line">
                    <FileText className="h-5 w-5" />
                  </span>
                  <span className="line-clamp-1 text-sm font-medium text-ink">{file.title}</span>
                  <span className="text-xs uppercase tracking-wider text-faint">{file.ext}</span>
                </button>
              ))}
            </div>
          ) : (
            <ul className="space-y-1">
              {folders.map((f) => (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => select(f.id)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-surface-2/60"
                  >
                    <Folder className="h-5 w-5 shrink-0 text-accent" />
                    <span className="flex-1 truncate text-sm font-medium text-ink">{f.name}</span>
                    <span className="text-xs text-faint">{f.children.length} items</span>
                    <ChevronRight className="h-4 w-4 text-faint" />
                  </button>
                </li>
              ))}
              {files.map((file) => (
                <li key={file.id}>
                  <button
                    type="button"
                    draggable
                    onDragStart={(e) => onFileDragStart(e, file.id)}
                    onClick={() => openFile(file.id)}
                    title="Open · or drag onto the desktop"
                    className="flex w-full cursor-grab items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-surface-2/60 active:cursor-grabbing"
                  >
                    <FileText className="h-5 w-5 shrink-0 text-ink/70" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">{file.title}</span>
                      <span className="block truncate text-xs text-muted">{file.name}</span>
                    </span>
                    {file.updated && <span className="text-xs text-faint">{file.updated}</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-line px-4 py-1.5 text-[11px] text-faint">
          Tip: drag a file onto the desktop to keep it handy.
        </div>
      </div>
    </AppTwoPane>
  );
}
