"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Inbox, LogOut } from "lucide-react";
import { JaiLogo } from "@/components/os/JaiLogo";
import { adminLogout } from "@/lib/admin-api";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/guestbook", label: "Guestbook", icon: BookOpen },
  { href: "/admin/contact", label: "Contact", icon: Inbox },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await adminLogout();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full flex-col border-b border-line bg-surface-2/50 md:min-h-screen md:w-60 md:border-b-0 md:border-r">
      <div className="flex items-center gap-3 border-b border-line px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-bg shadow-soft">
          <JaiLogo className="h-6 w-6" />
        </div>
        <div>
          <p className="font-display text-base font-semibold tracking-tight text-ink">Admin Center</p>
          <p className="text-xs text-muted">JaiOS · portfolioOS</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        <p className="eyebrow px-3 pb-1 pt-2">Services</p>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-spring",
                active
                  ? "bg-ink text-bg shadow-soft"
                  : "text-muted hover:bg-surface hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-line p-3">
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-danger/10 hover:text-danger"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Log out
        </button>
      </div>
    </aside>
  );
}
