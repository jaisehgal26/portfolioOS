"use client";

import { useState } from "react";
import { ChevronRight, FileCode } from "lucide-react";
import { fileTree, type FsFile, type FsNode } from "@jaios/content/files";
import { cn } from "@jaios/ui/utils";

function TreeItem({ node, onOpen, active, depth }: { node: FsNode; onOpen: (f: FsFile) => void; active: FsFile | null; depth: number }) {
  const [open, setOpen] = useState(depth < 1);
  if (node.type === "file") {
    return (
      <button
        type="button"
        onClick={() => onOpen(node)}
        style={{ paddingLeft: depth * 12 + 8 }}
        className={cn("flex w-full items-center gap-1.5 rounded py-0.5 pr-2 text-left hover:bg-ink/[0.04]", active?.id === node.id && "bg-accent/10 text-ink")}
      >
        <FileCode className="h-3.5 w-3.5 shrink-0 text-faint" />
        <span className="truncate">{node.name}</span>
      </button>
    );
  }
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{ paddingLeft: depth * 12 + 4 }}
        className="flex w-full items-center gap-1 rounded py-0.5 pr-2 text-left text-muted hover:bg-ink/[0.04]"
      >
        <ChevronRight className={cn("h-3 w-3 shrink-0 transition-transform", open && "rotate-90")} />
        <span className="truncate font-medium">{node.name}</span>
      </button>
      {open && node.children.map((c) => <TreeItem key={c.id} node={c} onOpen={onOpen} active={active} depth={depth + 1} />)}
    </div>
  );
}

function CodeView({ file }: { file: FsFile }) {
  const lines = file.body.join("\n\n").split("\n");
  return (
    <div className="h-full overflow-auto">
      <div className="sticky top-0 border-b border-line bg-surface px-3 py-1 text-faint">{file.name}</div>
      <table className="w-full border-collapse font-mono text-[11px] leading-relaxed">
        <tbody>
          {lines.map((ln, i) => (
            <tr key={i}>
              <td className="w-10 select-none border-r border-line/60 px-2 text-right text-faint">{i + 1}</td>
              <td className="whitespace-pre-wrap break-words px-3 text-ink/90">{ln || " "}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SourcesPanel() {
  const [file, setFile] = useState<FsFile | null>(null);
  return (
    <div className="flex h-full text-xs">
      <div className="w-56 shrink-0 overflow-auto border-r border-line p-1.5 font-mono">
        <TreeItem node={fileTree} onOpen={setFile} active={file} depth={0} />
      </div>
      <div className="min-h-0 flex-1">
        {file ? <CodeView file={file} /> : <div className="grid h-full place-items-center text-faint">Select a file to view its source</div>}
      </div>
    </div>
  );
}
