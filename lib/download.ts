import { links } from "@/data/profile";

/** Trigger a browser download for a same-origin file (served from /public). */
export function downloadFile(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Download the résumé and cover letter PDFs together. The second download is
 * staggered slightly so browsers don't block it as a duplicate action.
 */
export function downloadResume() {
  downloadFile(links.resume, "Jai_Sehgal_Resume.pdf");
  setTimeout(() => downloadFile(links.coverLetter, "Jai_Sehgal_CoverLetter.pdf"), 400);
}
