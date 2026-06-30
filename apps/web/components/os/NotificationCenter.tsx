"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, FileText, FolderKanban, Search, Sparkles, X, type LucideIcon } from "lucide-react";
import { useOSStore } from "@/store/os-store";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  search: Search,
  fileText: FileText,
  folderKanban: FolderKanban,
  bell: Bell,
};

export function NotificationCenter() {
  const open = useOSStore((s) => s.notificationCenterOpen);
  const close = useOSStore((s) => s.closeNotificationCenter);
  const notifications = useOSStore((s) => s.notifications);
  const markRead = useOSStore((s) => s.markNotificationsRead);
  const remove = useOSStore((s) => s.removeNotification);
  const clearAll = useOSStore((s) => s.clearNotifications);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (open) {
      const t = setTimeout(markRead, 600);
      return () => clearTimeout(t);
    }
  }, [open, markRead]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <button
            aria-label="Close notifications"
            tabIndex={-1}
            onClick={close}
            className="fixed inset-0 z-[60] cursor-default"
          />
          <motion.aside
            aria-label="Notification center"
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: 24 }}
            transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong fixed right-2.5 top-12 z-[70] flex max-h-[80vh] w-[min(22rem,calc(100vw-1.25rem))] flex-col overflow-hidden rounded-3xl shadow-window"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <h2 className="font-display text-lg font-semibold tracking-tight text-ink">Notifications</h2>
              <div className="flex items-center gap-1">
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-full px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:bg-ink/5 hover:text-ink"
                  >
                    Clear all
                  </button>
                )}
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="grid h-8 w-8 place-items-center rounded-full text-muted hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3">
              {notifications.length === 0 && (
                <p className="px-2 py-10 text-center text-sm text-faint">You&apos;re all caught up.</p>
              )}
              {notifications.map((n) => {
                const Icon = ICONS[n.icon ?? "bell"] ?? Bell;
                return (
                  <div
                    key={n.id}
                    className="group relative rounded-2xl border border-line bg-surface p-3.5 shadow-soft"
                  >
                    <div className="flex gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-ink">{n.title}</p>
                          {n.time && <span className="shrink-0 text-[11px] text-faint">{n.time}</span>}
                        </div>
                        {n.body && <p className="mt-0.5 text-xs leading-relaxed text-muted">{n.body}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(n.id)}
                        aria-label="Dismiss notification"
                        className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full text-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
