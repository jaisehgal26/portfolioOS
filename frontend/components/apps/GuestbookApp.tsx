"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { AppScroll } from "@/components/ui/AppShell";
import { ApiError, getGuestbook, submitGuestbook, type GuestbookPublicItem } from "@/lib/api";
import { useOSStore } from "@/store/os-store";
import { cn } from "@/lib/utils";

type FormState = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-faint focus:border-line-strong focus:outline-none focus:ring-1 focus:ring-line-strong";

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function GuestbookApp() {
  const pushToast = useOSStore((s) => s.pushToast);
  const [items, setItems] = useState<GuestbookPublicItem[]>([]);
  const [total, setTotal] = useState(0);
  const [listLoading, setListLoading] = useState(true);
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadEntries() {
      setListLoading(true);
      try {
        const data = await getGuestbook(30, 0);
        if (!cancelled) {
          setItems(data.items);
          setTotal(data.total);
        }
      } catch {
        if (!cancelled) pushToast("Could not load guestbook messages.");
      } finally {
        if (!cancelled) setListLoading(false);
      }
    }

    loadEntries();
    return () => {
      cancelled = true;
    };
  }, [pushToast]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError("Please write a short message.");
      setFormState("error");
      return;
    }

    setFormState("submitting");

    try {
      const res = await submitGuestbook({
        message: message.trim(),
        is_anonymous: isAnonymous,
        name: isAnonymous ? undefined : name.trim() || undefined,
        email: isAnonymous ? undefined : email.trim() || undefined,
      });
      setMessage("");
      setName("");
      setEmail("");
      setIsAnonymous(false);
      setFormState("success");
      pushToast(res.message);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setError(msg);
      setFormState("error");
      pushToast(msg);
    }
  }

  return (
    <AppScroll>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Guestbook</h1>
        <p className="mt-1 text-sm text-muted">Leave a short note on the wall — messages appear after moderation.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-surface p-4 shadow-soft sm:p-5">
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
          >
            {error}
          </div>
        )}

        {formState === "success" && !error && (
          <p className="mb-4 text-sm text-muted">Thanks — your message is awaiting moderation.</p>
        )}

        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-faint">Message</span>
          <textarea
            required
            maxLength={500}
            rows={3}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (formState === "success") setFormState("idle");
            }}
            className={cn(inputClass, "resize-y min-h-[80px]")}
            placeholder="Say something nice…"
            disabled={formState === "submitting"}
          />
        </label>

        <label className="mt-3 flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            disabled={formState === "submitting"}
            className="rounded border-line"
          />
          Post anonymously
        </label>

        {!isAnonymous && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-faint">
                Name <span className="normal-case text-faint">(optional)</span>
              </span>
              <input
                type="text"
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Your name"
                disabled={formState === "submitting"}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-faint">
                Email <span className="normal-case text-faint">(optional)</span>
              </span>
              <input
                type="email"
                maxLength={320}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
                disabled={formState === "submitting"}
              />
            </label>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button type="submit" variant="primary" disabled={formState === "submitting"}>
            {formState === "submitting" ? "Sending…" : "Leave a note"}
          </Button>
        </div>
      </form>

      <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-faint">
        On the wall · {total}
      </h2>

      {listLoading ? (
        <p className="mt-4 text-sm text-muted">Loading messages…</p>
      ) : items.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No messages yet — be the first.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-2xl border border-line bg-surface p-4 shadow-soft">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-ink">{item.name}</span>
                <time className="text-xs text-faint" dateTime={item.created_at}>
                  {formatDate(item.created_at)}
                </time>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.message}</p>
            </li>
          ))}
        </ul>
      )}
    </AppScroll>
  );
}
