import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

interface AdminShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AdminShell({ title, description, children }: AdminShellProps) {
  return (
    <div className="wallpaper-aurora relative min-h-screen">
      <div className="noise pointer-events-none fixed inset-0 opacity-[0.35]" aria-hidden />
      <div className="vignette pointer-events-none fixed inset-0" aria-hidden />

      <div className="relative flex min-h-screen flex-col md:flex-row md:items-stretch">
        <AdminSidebar />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col p-4 sm:p-6">
          <div className="card flex min-h-[calc(100vh-2rem)] flex-col overflow-hidden shadow-window sm:min-h-[calc(100vh-3rem)]">
            <header className="border-b border-line px-6 py-5 sm:px-8">
              <p className="eyebrow mb-2">Admin</p>
              <h1 className="type-title sm:text-display-lg">
                {title}
              </h1>
              {description ? (
                <p className="mt-1.5 max-w-2xl text-sm leading-prose text-muted">{description}</p>
              ) : null}
            </header>
            <main className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
