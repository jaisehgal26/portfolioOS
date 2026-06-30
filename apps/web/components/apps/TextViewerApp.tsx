"use client";

import { FileText } from "lucide-react";
import { AppScroll } from "@/components/ui/AppShell";
import { useOSStore } from "@jaios/kernel/store";
import { getFile } from "@jaios/content/files";
import { cn } from "@/lib/utils";

export function TextViewerApp() {
  const openFileId = useOSStore((s) => s.openFileId);
  const file = openFileId ? getFile(openFileId) : undefined;

  if (!file) {
    return (
      <AppScroll>
        <div className="grid h-full place-items-center py-16 text-center">
          <div>
            <FileText className="mx-auto h-8 w-8 text-faint" aria-hidden />
            <p className="mt-3 text-sm text-muted">No file open. Open one from Portfolio Files.</p>
          </div>
        </div>
      </AppScroll>
    );
  }

  const mono = file.ext === "txt";

  return (
    <AppScroll>
      <article className="mx-auto max-w-2xl">
        <header className="mb-5 flex items-center gap-2.5 border-b border-line pb-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
            <FileText className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-semibold tracking-tight text-ink">{file.title}</h1>
            <p className="truncate text-xs text-faint">
              {file.name}
              {file.updated ? ` · ${file.updated}` : ""}
            </p>
          </div>
        </header>

        <div className={cn("space-y-3.5", mono && "font-mono text-[13px]")}>
          {file.body.map((para, i) =>
            para.startsWith("• ") ? (
              <p key={i} className="flex gap-2 text-sm leading-relaxed text-ink">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                <span>{para.slice(2)}</span>
              </p>
            ) : (
              <p
                key={i}
                className={cn(
                  "leading-relaxed",
                  mono ? "whitespace-pre-wrap text-ink" : "text-[15px] text-muted",
                )}
              >
                {para}
              </p>
            ),
          )}
        </div>
      </article>
    </AppScroll>
  );
}
