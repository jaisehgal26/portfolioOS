"use client";

import { Loader } from "lucide-react";

/** Temporary page for internal routes that are wired up but built in a later phase. */
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="grid h-full place-items-center px-6 py-16 text-center">
      <div>
        <Loader className="mx-auto h-10 w-10 text-accent" />
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        <p className="mt-1 text-sm text-muted">This page is coming online.</p>
      </div>
    </div>
  );
}
