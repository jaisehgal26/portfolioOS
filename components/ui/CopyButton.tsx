"use client";

import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useOSStore } from "@/store/os-store";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  /** Accessible label, e.g. "Copy email". */
  label: string;
  /** Toast message shown on success (defaults to "Copied"). */
  toast?: string;
  className?: string;
}

/** Compact copy-to-clipboard button: transient confirmation + an OS toast. */
export function CopyButton({ value, label, toast, className }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();
  const pushToast = useOSStore((s) => s.pushToast);

  async function onClick() {
    const ok = await copy(value);
    if (ok !== false) pushToast(toast ?? "Copied to clipboard");
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={copied ? `${label} — copied` : label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-ink",
        copied && "border-mint/40 text-mint",
        className,
      )}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}
