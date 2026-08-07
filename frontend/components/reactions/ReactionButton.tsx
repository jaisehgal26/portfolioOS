"use client";

import { useCallback, useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { ApiError, getReactions, postReaction } from "@/lib/api";
import { useOSStore } from "@/store/os-store";
import { cn } from "@/lib/utils";

const STORAGE_PREFIX = "jaios:reacted:";

interface ReactionButtonProps {
  targetType: string;
  targetId: string;
  className?: string;
}

export function ReactionButton({ targetType, targetId, className }: ReactionButtonProps) {
  const pushToast = useOSStore((s) => s.pushToast);
  const [count, setCount] = useState(0);
  const [reacted, setReacted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const storageKey = `${STORAGE_PREFIX}${targetType}:${targetId}`;

  const load = useCallback(async () => {
    try {
      const local = typeof window !== "undefined" && localStorage.getItem(storageKey) === "1";
      setReacted(local);
      const data = await getReactions(targetType, targetId);
      const item = data.counts.find((c) => c.target_id === targetId);
      setCount(item?.count ?? 0);
    } catch {
      // keep defaults on fetch failure
    } finally {
      setLoading(false);
    }
  }, [targetType, targetId, storageKey]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleClick() {
    if (reacted || submitting) return;
    setSubmitting(true);
    try {
      const res = await postReaction(targetType, targetId);
      setCount(res.count);
      setReacted(true);
      localStorage.setItem(storageKey, "1");
      if (res.already_reacted) {
        setReacted(true);
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Could not save your reaction.";
      pushToast(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || reacted || submitting}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        reacted
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-line bg-surface text-ink hover:border-line-strong hover:bg-surface-2",
        (loading || submitting) && "opacity-70",
        className,
      )}
      aria-pressed={reacted}
      aria-label={reacted ? `You liked this (${count})` : `Like this (${count})`}
    >
      <ThumbsUp className={cn("h-4 w-4", reacted && "fill-current")} strokeWidth={2} />
      <span className="tabular-nums">{loading ? "—" : count}</span>
    </button>
  );
}
