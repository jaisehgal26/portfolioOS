"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Mail } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getContactSubmissions, type ContactAdminItem } from "@/lib/admin-api";

const PAGE_SIZE = 20;

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminContactPage() {
  const [items, setItems] = useState<ContactAdminItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getContactSubmissions(PAGE_SIZE, offset);
      setItems(data.items);
      setTotal(data.total);
    } catch {
      setError("Failed to load contact submissions.");
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    void load();
  }, [load]);

  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canPrev = offset > 0;
  const canNext = offset + PAGE_SIZE < total;

  return (
    <AdminShell
      title="Contact"
      description="View messages submitted through the contact form."
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="font-medium text-ink">{total}</span> submission
          {total === 1 ? "" : "s"} total
        </p>
        {totalPages > 1 ? (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={!canPrev || loading}
              onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted">
              Page {page} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="secondary"
              disabled={!canNext || loading}
              onClick={() => setOffset((o) => o + PAGE_SIZE)}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 text-muted">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          Loading submissions…
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-sm text-muted">
          No contact submissions yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="p-5 sm:p-6">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{item.name}</p>
                  <a
                    href={`mailto:${item.email}`}
                    className="inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-accent/80"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {item.email}
                  </a>
                  <p className="mt-1 text-xs text-faint">{formatDate(item.created_at)}</p>
                </div>
                {item.subject ? <Badge>{item.subject}</Badge> : null}
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
                {item.message}
              </p>
            </Card>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
