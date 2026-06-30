"use client";

import { JaiLogo } from "@jaios/ui/JaiLogo";
import { useBrowserStore } from "@jaios/kernel/browser-store";
import { favicon } from "@jaios/kernel/lib/url";
import { isInternalUrl } from "./lib/routes";

export function BookmarksBar() {
  const bookmarks = useBrowserStore((s) => s.bookmarks);
  const visible = useBrowserStore((s) => s.bookmarksBarVisible);
  const navigate = useBrowserStore((s) => s.navigate);

  if (!visible || bookmarks.length === 0) return null;

  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-line bg-surface px-2.5 py-1">
      {bookmarks.map((b) => (
        <button
          key={b.id}
          type="button"
          onClick={() => navigate(b.url)}
          title={b.url}
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted transition-colors hover:bg-ink/5 hover:text-ink"
        >
          {isInternalUrl(b.url) ? (
            <JaiLogo className="h-3.5 w-3.5 text-ink" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={favicon(b.url)} alt="" width={14} height={14} className="h-3.5 w-3.5 rounded-sm" />
          )}
          <span className="max-w-[120px] truncate">{b.label}</span>
        </button>
      ))}
    </div>
  );
}
