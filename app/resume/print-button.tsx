"use client";

import { Printer } from "lucide-react";

/** Opens the browser print dialog (Save as PDF) for the resume page. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
    >
      <Printer className="h-4 w-4" />
      Print / Save as PDF
    </button>
  );
}
