"use client";

import { FileText, RotateCcw, Trash2 } from "lucide-react";
import { AppScroll } from "@/components/ui/AppShell";
import { useOSStore } from "@/store/os-store";
import { getFile } from "@/data/files";

export function TrashApp() {
  const trash = useOSStore((s) => s.trash);
  const restore = useOSStore((s) => s.restoreFromTrash);
  const empty = useOSStore((s) => s.emptyTrash);
  const openFile = useOSStore((s) => s.openFile);

  return (
    <AppScroll>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Trash</h1>
          <p className="mt-1 text-sm text-muted">Drag desktop files here to remove them.</p>
        </div>
        {trash.length > 0 && (
          <button
            type="button"
            onClick={empty}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-danger transition-colors hover:border-danger/40"
          >
            <Trash2 className="h-3.5 w-3.5" /> Empty Trash
          </button>
        )}
      </div>

      {trash.length === 0 ? (
        <div className="grid place-items-center py-16 text-center">
          <Trash2 className="h-8 w-8 text-faint" aria-hidden />
          <p className="mt-3 text-sm text-faint">Trash is empty.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {trash.map((t) => {
            const file = getFile(t.id);
            if (!file) return null;
            return (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 shadow-soft"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-ink/70 ring-1 ring-line">
                  <FileText className="h-[18px] w-[18px]" />
                </span>
                <button
                  type="button"
                  onClick={() => openFile(t.id)}
                  className="min-w-0 flex-1 text-left text-sm font-medium text-ink hover:underline"
                >
                  {file.title}
                </button>
                <button
                  type="button"
                  onClick={() => restore(t.id)}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Put back
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </AppScroll>
  );
}
