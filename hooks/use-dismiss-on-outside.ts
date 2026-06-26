"use client";

import { useEffect, useRef } from "react";

/**
 * Returns a ref to attach to a popover/menu element. While `active`, a click
 * outside that element or pressing Escape calls `onDismiss`.
 */
export function useDismissOnOutside<T extends HTMLElement>(
  active: boolean,
  onDismiss: () => void,
) {
  const ref = useRef<T>(null);
  // Keep the latest callback without re-subscribing listeners every render.
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;

  useEffect(() => {
    if (!active) return;
    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) dismiss.current();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss.current();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  return ref;
}
