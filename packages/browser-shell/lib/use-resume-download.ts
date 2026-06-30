"use client";

import { useCallback } from "react";
import { downloadResume } from "@jaios/kernel/lib/download";
import { useBrowserStore } from "@jaios/kernel/browser-store";

/** Triggers the real résumé + cover letter download and logs them in the downloads tray. */
export function useResumeDownload() {
  const pushDownload = useBrowserStore((s) => s.pushDownload);
  const completeDownload = useBrowserStore((s) => s.completeDownload);
  return useCallback(() => {
    downloadResume();
    const ids = [pushDownload("Jai_Sehgal_Resume.pdf"), pushDownload("Jai_Sehgal_CoverLetter.pdf")];
    setTimeout(() => ids.forEach(completeDownload), 1200);
  }, [pushDownload, completeDownload]);
}
