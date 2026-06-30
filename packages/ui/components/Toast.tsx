"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useOSStore, type Toast as ToastType } from "@jaios/kernel/store";
import { usePrefersReducedMotion } from "@jaios/kernel/hooks/use-reduced-motion";

function ToastItem({ toast }: { toast: ToastType }) {
  const remove = useOSStore((s) => s.removeToast);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const id = setTimeout(() => remove(toast.id), 2400);
    return () => clearTimeout(id);
  }, [toast.id, remove]);

  return (
    <motion.div
      layout
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
      transition={{ duration: reduced ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="glass-strong pointer-events-auto flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-medium text-ink shadow-card"
      role="status"
    >
      <span className="grid h-5 w-5 place-items-center rounded-full bg-mint/15 text-mint">
        <Check className="h-3.5 w-3.5" />
      </span>
      {toast.message}
    </motion.div>
  );
}

/** Bottom-center toast stack, driven by the OS store. */
export function ToastViewport() {
  const toasts = useOSStore((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[120] flex flex-col items-center gap-2 px-4 sm:bottom-28">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}
