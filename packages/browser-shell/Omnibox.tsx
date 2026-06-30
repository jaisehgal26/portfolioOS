"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, Lock } from "lucide-react";
import { useBrowserStore, tabUrl } from "@jaios/kernel/browser-store";
import { inputToUrl, isInternalUrl } from "./lib/routes";

export function Omnibox() {
  const tabs = useBrowserStore((s) => s.tabs);
  const activeTabId = useBrowserStore((s) => s.activeTabId);
  const navigate = useBrowserStore((s) => s.navigate);

  const tab = tabs.find((t) => t.id === activeTabId);
  const url = tab ? tabUrl(tab) : "";
  const [value, setValue] = useState(url);
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  // Keep the bar synced to the current page unless the user is editing.
  useEffect(() => {
    if (!editing) setValue(url);
  }, [url, editing]);

  // Cmd/Ctrl+L focuses the omnibox.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "l") {
        e.preventDefault();
        ref.current?.focus();
        ref.current?.select();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    navigate(inputToUrl(value));
    ref.current?.blur();
  }

  const internal = isInternalUrl(url);

  return (
    <form
      onSubmit={submit}
      className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1.5"
    >
      {internal ? (
        <Lock className="h-3.5 w-3.5 shrink-0 text-mint" />
      ) : (
        <Globe className="h-3.5 w-3.5 shrink-0 text-faint" />
      )}
      <input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setEditing(true)}
        onBlur={() => setEditing(false)}
        spellCheck={false}
        aria-label="Address and search bar"
        placeholder="Search, or type jai:// or a URL"
        className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
      />
    </form>
  );
}
