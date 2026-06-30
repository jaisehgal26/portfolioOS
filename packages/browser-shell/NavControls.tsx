"use client";

import { ArrowLeft, ArrowRight, Home, RotateCw } from "lucide-react";
import { useBrowserStore, HOME_URL } from "@jaios/kernel/browser-store";
import { cn } from "@jaios/ui/utils";

function IconButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-full transition-colors",
        disabled ? "opacity-40" : "hover:bg-ink/5 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

export function NavControls() {
  const tabs = useBrowserStore((s) => s.tabs);
  const activeTabId = useBrowserStore((s) => s.activeTabId);
  const goBack = useBrowserStore((s) => s.goBack);
  const goForward = useBrowserStore((s) => s.goForward);
  const reload = useBrowserStore((s) => s.reload);
  const navigate = useBrowserStore((s) => s.navigate);

  const tab = tabs.find((t) => t.id === activeTabId);
  const canBack = !!tab && tab.historyIndex > 0;
  const canForward = !!tab && tab.historyIndex < tab.history.length - 1;

  return (
    <div className="flex items-center text-faint">
      <IconButton onClick={goBack} disabled={!canBack} label="Back">
        <ArrowLeft className="h-4 w-4" />
      </IconButton>
      <IconButton onClick={goForward} disabled={!canForward} label="Forward">
        <ArrowRight className="h-4 w-4" />
      </IconButton>
      <IconButton onClick={reload} label="Reload">
        <RotateCw className="h-3.5 w-3.5" />
      </IconButton>
      <IconButton onClick={() => navigate(HOME_URL)} label="Home">
        <Home className="h-4 w-4" />
      </IconButton>
    </div>
  );
}
