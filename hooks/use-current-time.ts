"use client";

import { useEffect, useState } from "react";

/**
 * Current time, refreshed every `intervalMs`. Starts as null so the server and
 * first client render match (the live clock fills in after hydration).
 */
export function useCurrentTime(intervalMs = 30_000) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
