import type { HealthServiceStatus } from "@/lib/api";
import { HEALTH_PROBE_TARGETS } from "@/data/health-targets";

const TIMEOUT_MS = 8_000;

async function probeUrl(url: string): Promise<Pick<HealthServiceStatus, "status" | "status_code" | "latency_ms" | "error_message">> {
  const start = performance.now();
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "User-Agent": "JaiOS-HealthProbe/1.0" },
    });

    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { "User-Agent": "JaiOS-HealthProbe/1.0", Range: "bytes=0-0" },
      });
    }

    const latency_ms = Math.round(performance.now() - start);
    const up = res.status >= 200 && res.status < 400;
    return {
      status: up ? "up" : "down",
      status_code: res.status,
      latency_ms,
      error_message: up ? null : `HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      status: "down",
      status_code: null,
      latency_ms: Math.round(performance.now() - start),
      error_message: err instanceof Error ? err.message : "Request failed",
    };
  }
}

export async function probeHealthTargets(): Promise<HealthServiceStatus[]> {
  const checked_at = new Date().toISOString();
  const results = await Promise.all(
    HEALTH_PROBE_TARGETS.map(async ({ target_key, url }) => {
      const probe = await probeUrl(url);
      return {
        target_key,
        url,
        checked_at,
        ...probe,
      };
    }),
  );
  return results;
}
