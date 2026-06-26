"use client";

import { AppScroll } from "@/components/ui/AppShell";
import { StateCard } from "@/components/cards/StateCard";
import { uiStates } from "@/data/ui-states";

export function UIStateGalleryApp() {
  return (
    <AppScroll>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">UI Gallery</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          The states most portfolios skip. Polished screens are easy — the craft is everything around
          the happy path: empty, loading, error, offline, permission, reconnecting.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {uiStates.map((item) => (
          <StateCard key={item.kind} item={item} />
        ))}
      </div>
    </AppScroll>
  );
}
