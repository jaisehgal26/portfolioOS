import { cn } from "../lib/utils";

/**
 * Layout helpers shared by every JaiOS app. The Window already provides the
 * title bar and a sized, full-height content box — apps fill it with these.
 */

/** Scrollable content region with consistent padding. */
export function AppScroll({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("h-full overflow-y-auto p-5 sm:p-7", className)}>{children}</div>;
}

/** Optional in-app toolbar / header (icon + title + subtitle + actions). */
export function AppHeader({
  title,
  subtitle,
  icon,
  actions,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-line px-5 py-3 sm:px-6">
      {icon}
      <div className="min-w-0">
        <h2 className="truncate font-display text-lg font-semibold tracking-tight text-ink">{title}</h2>
        {subtitle && <p className="truncate text-xs text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

/**
 * Two-pane (sidebar + main) layout. On desktop the sidebar is a fixed-width
 * column; on mobile it stacks above the main pane as a horizontally scrollable
 * strip. Make sidebar items `flex md:flex-col` so they flow correctly.
 */
export function AppTwoPane({
  sidebar,
  children,
  sidebarClassName,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  sidebarClassName?: string;
}) {
  return (
    <div className="flex h-full flex-col md:flex-row">
      <aside
        className={cn(
          "shrink-0 overflow-x-auto border-b border-line bg-surface-2/40 md:w-60 md:overflow-y-auto md:border-b-0 md:border-r",
          sidebarClassName,
        )}
      >
        {sidebar}
      </aside>
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
