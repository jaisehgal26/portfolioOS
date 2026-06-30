"use client";

import { Trash2, ExternalLink } from "lucide-react";
import { JaiLogo } from "@jaios/ui/JaiLogo";
import { useBrowserStore } from "@jaios/kernel/browser-store";
import { favicon } from "@jaios/kernel/lib/url";
import { isInternalUrl } from "../lib/routes";

export function BookmarksPage() {
  const bookmarks = useBrowserStore((s) => s.bookmarks);
  const navigate = useBrowserStore((s) => s.navigate);
  const removeBookmark = useBrowserStore((s) => s.removeBookmark);
  const renameBookmark = useBrowserStore((s) => s.renameBookmark);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Bookmarks</h1>
      <p className="mt-1 text-sm text-muted">Edit, rename, or remove. Add the current page with the star in the address bar.</p>

      <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
        {bookmarks.length === 0 && <li className="px-4 py-6 text-center text-sm text-faint">No bookmarks yet.</li>}
        {bookmarks.map((b) => (
          <li key={b.id} className="flex items-center gap-3 px-4 py-2.5">
            {isInternalUrl(b.url) ? (
              <JaiLogo className="h-4 w-4 shrink-0 text-ink" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={favicon(b.url)} alt="" width={16} height={16} className="h-4 w-4 shrink-0 rounded-sm" />
            )}
            <input
              value={b.label}
              onChange={(e) => renameBookmark(b.id, e.target.value)}
              aria-label="Bookmark label"
              className="min-w-0 flex-1 rounded-md bg-transparent px-1 py-0.5 text-sm font-medium text-ink hover:bg-ink/5 focus:bg-ink/5 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => navigate(b.url)}
              aria-label={`Open ${b.label}`}
              className="grid h-7 w-7 place-items-center rounded-full text-faint transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => removeBookmark(b.id)}
              aria-label={`Remove ${b.label}`}
              className="grid h-7 w-7 place-items-center rounded-full text-faint transition-colors hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
