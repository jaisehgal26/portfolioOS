"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { links } from "@jaios/content/profile";
import { downloadFile, downloadResume } from "@jaios/kernel/lib/download";
import { cn } from "@/lib/utils";

const DOCS = {
  resume: { label: "Resume", url: links.resume, file: "Jai_Sehgal_Resume.pdf" },
  cover: { label: "Cover Letter", url: links.coverLetter, file: "Jai_Sehgal_CoverLetter.pdf" },
} as const;

type DocId = keyof typeof DOCS;

export function ResumeApp() {
  const [active, setActive] = useState<DocId>("resume");
  const doc = DOCS[active];

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2.5 sm:px-4">
        <div className="flex items-center gap-1">
          {(Object.keys(DOCS) as DocId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                active === id ? "bg-ink/[0.06] text-ink" : "text-muted hover:bg-ink/[0.04] hover:text-ink",
              )}
            >
              {DOCS[id].label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => downloadFile(doc.url, doc.file)}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-ink/5"
          >
            <Download className="h-3.5 w-3.5" /> Download {doc.label.toLowerCase()}
          </button>
          <button
            type="button"
            onClick={downloadResume}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-bg transition-transform hover:-translate-y-0.5"
          >
            <Download className="h-3.5 w-3.5" /> Download both
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 bg-surface-2">
        <object key={active} data={`${doc.url}#view=FitH`} type="application/pdf" className="h-full w-full">
          <div className="grid h-full place-items-center p-8 text-center">
            <div>
              <p className="text-sm text-muted">Your browser can&apos;t preview PDFs inline.</p>
              <button
                type="button"
                onClick={() => downloadFile(doc.url, doc.file)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
              >
                <Download className="h-4 w-4" /> Download {doc.label.toLowerCase()}
              </button>
            </div>
          </div>
        </object>
      </div>
    </div>
  );
}

/** Same viewer, reused by the Finder hub's Resume section. */
export const ResumeDocument = ResumeApp;
