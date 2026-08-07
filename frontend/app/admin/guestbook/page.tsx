"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import {
  getGuestbookAdmin,
  updateGuestbookStatus,
  type GuestbookAdminItem,
} from "@/lib/admin-api";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
] as const;

type TabKey = (typeof TABS)[number]["id"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusBadgeClass(status: string) {
  if (status === "approved") return "border-mint/30 bg-mint/10 text-mint";
  if (status === "pending") return "border-amber/30 bg-amber/10 text-amber";
  return "border-danger/30 bg-danger/10 text-danger";
}

export default function AdminGuestbookPage() {
  const [tab, setTab] = useState<TabKey>("pending");
  const [items, setItems] = useState<GuestbookAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGuestbookAdmin(tab);
      setItems(data.items);
    } catch {
      setError("Failed to load guestbook entries.");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleStatus(entryId: string, status: "approved" | "rejected") {
    setActionId(entryId);
    try {
      await updateGuestbookStatus(entryId, status);
      await load();
    } catch {
      setError("Failed to update entry.");
    } finally {
      setActionId(null);
    }
  }

  return (
    <AdminShell
      title="Guestbook"
      description="Review and approve messages before they appear on the public wall."
    >
      <Tabs
        tabs={[...TABS]}
        active={tab}
        onChange={(id) => setTab(id as TabKey)}
        layoutId="admin-guestbook-tabs"
        ariaLabel="Guestbook status"
        className="mb-6 w-fit"
      />

      {error ? (
        <p className="mb-4 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 text-muted">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          Loading entries…
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-sm text-muted">
          No {tab} entries.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((entry) => (
            <Card key={entry.id} className="p-5 sm:p-6">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">
                    {entry.is_anonymous ? "Anonymous" : (entry.name ?? "Unknown")}
                  </p>
                  {entry.email && !entry.is_anonymous ? (
                    <p className="text-sm text-muted">{entry.email}</p>
                  ) : null}
                  <p className="mt-1 text-xs text-faint">{formatDate(entry.created_at)}</p>
                </div>
                <Badge className={cn("capitalize", statusBadgeClass(entry.status))}>
                  {entry.status}
                </Badge>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
                {entry.message}
              </p>
              {tab === "pending" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={actionId === entry.id}
                    onClick={() => void handleStatus(entry.id, "approved")}
                    className="border-mint/30 text-mint hover:border-mint/50 hover:bg-mint/10"
                  >
                    {actionId === entry.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={actionId === entry.id}
                    onClick={() => void handleStatus(entry.id, "rejected")}
                    className="text-danger hover:bg-danger/10 hover:text-danger"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reject
                  </Button>
                </div>
              ) : null}
            </Card>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
