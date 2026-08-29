import type { BandwidthPoint, ConfigOptions, MeasurementConfig, Results } from "@cloudflare/speedtest";

export type SpeedPhase = "idle" | "latency" | "download" | "upload" | "done";

export interface SpeedTestLiveState {
  phase: SpeedPhase;
  pingMs?: number;
  downloadMbps?: number;
  uploadMbps?: number;
  downLoadedLatencyMs?: number;
  upLoadedLatencyMs?: number;
}

export interface SpeedTestFinalResult {
  pingMs: number;
  downloadMbps: number;
  uploadMbps: number;
  downLoadedLatencyMs?: number;
  upLoadedLatencyMs?: number;
}

export interface ClientNetworkInfo {
  ip: string;
  isp: string | null;
  city: string | null;
  country: string | null;
}

export interface ServerInfo {
  colo: string;
  label: string;
}

/** Strict sequence: ping → all download rounds → all upload rounds. */
const MEASUREMENTS: MeasurementConfig[] = [
  { type: "latency", numPackets: 1 },
  { type: "download", bytes: 1e5, count: 1, bypassMinDuration: true },
  { type: "latency", numPackets: 20 },
  { type: "download", bytes: 1e5, count: 9 },
  { type: "download", bytes: 1e6, count: 8 },
  { type: "download", bytes: 1e7, count: 6 },
  { type: "download", bytes: 2.5e7, count: 4 },
  { type: "download", bytes: 1e8, count: 3 },
  { type: "download", bytes: 2.5e8, count: 2 },
  { type: "upload", bytes: 1e5, count: 8 },
  { type: "upload", bytes: 1e6, count: 6 },
  { type: "upload", bytes: 1e7, count: 4 },
  { type: "upload", bytes: 2.5e7, count: 4 },
  { type: "upload", bytes: 5e7, count: 3 },
];

const ENGINE_CONFIG: ConfigOptions = {
  autoStart: false,
  logAimApiUrl: null,
  measurements: MEASUREMENTS,
  measureDownloadLoadedLatency: true,
  measureUploadLoadedLatency: true,
};

export interface SpeedTestEngineHandle {
  start: () => void;
  restart: () => void;
}

export interface SpeedTestCallbacks {
  onPhaseChange?: (phase: SpeedPhase) => void;
  onUpdate?: (state: SpeedTestLiveState) => void;
  onFinish?: (result: SpeedTestFinalResult) => void;
  onError?: (message: string) => void;
}

function phaseFromMeasurement(type: string): SpeedPhase {
  if (type === "download") return "download";
  if (type === "upload") return "upload";
  return "latency";
}

function liveBandwidthMbps(points: BandwidthPoint[]): number | undefined {
  if (points.length === 0) return undefined;
  const recent = points.slice(-5);
  const avgBps = recent.reduce((sum, p) => sum + p.bps, 0) / recent.length;
  return bpsToMbps(avgBps);
}

function readLiveState(phase: SpeedPhase, results: Results): SpeedTestLiveState {
  const latency = results.getUnloadedLatency();
  const downloadPoints = results.getDownloadBandwidthPoints();
  const uploadPoints = results.getUploadBandwidthPoints();

  let downloadMbps: number | undefined;
  let uploadMbps: number | undefined;

  if (phase === "download") {
    downloadMbps =
      liveBandwidthMbps(downloadPoints) ??
      (results.getDownloadBandwidth() !== undefined ? bpsToMbps(results.getDownloadBandwidth()!) : undefined);
  } else if (phase === "upload") {
    downloadMbps =
      results.getDownloadBandwidth() !== undefined ? bpsToMbps(results.getDownloadBandwidth()!) : undefined;
    uploadMbps =
      liveBandwidthMbps(uploadPoints) ??
      (results.getUploadBandwidth() !== undefined ? bpsToMbps(results.getUploadBandwidth()!) : undefined);
  } else if (phase === "done") {
    downloadMbps =
      results.getDownloadBandwidth() !== undefined ? bpsToMbps(results.getDownloadBandwidth()!) : undefined;
    uploadMbps =
      results.getUploadBandwidth() !== undefined ? bpsToMbps(results.getUploadBandwidth()!) : undefined;
  }

  return {
    phase,
    pingMs: latency,
    downloadMbps,
    uploadMbps,
    downLoadedLatencyMs: results.getDownLoadedLatency(),
    upLoadedLatencyMs: results.getUpLoadedLatency(),
  };
}

function summaryToResult(summary: ReturnType<Results["getSummary"]>): SpeedTestFinalResult {
  return {
    pingMs: summary.latency ?? 0,
    downloadMbps: bpsToMbps(summary.download ?? 0),
    uploadMbps: bpsToMbps(summary.upload ?? 0),
    downLoadedLatencyMs: summary.downLoadedLatency,
    upLoadedLatencyMs: summary.upLoadedLatency,
  };
}

export async function createSpeedTest(callbacks: SpeedTestCallbacks): Promise<SpeedTestEngineHandle> {
  const SpeedTest = (await import("@cloudflare/speedtest")).default;
  let phase: SpeedPhase = "idle";

  const engine = new SpeedTest(ENGINE_CONFIG);

  const emitUpdate = () => callbacks.onUpdate?.(readLiveState(phase, engine.results));

  engine.onPhaseChange = ({ measurement }) => {
    phase = phaseFromMeasurement(measurement.type);
    callbacks.onPhaseChange?.(phase);
    emitUpdate();
  };

  engine.onResultsChange = () => {
    if (engine.isFinished) return;
    emitUpdate();
  };

  engine.onFinish = (results) => {
    phase = "done";
    callbacks.onPhaseChange?.("done");
    callbacks.onUpdate?.(readLiveState("done", results));
    callbacks.onFinish?.(summaryToResult(results.getSummary()));
  };

  engine.onError = (message) => callbacks.onError?.(message);

  return {
    start: () => {
      phase = "latency";
      callbacks.onPhaseChange?.("latency");
      engine.play();
    },
    restart: () => {
      phase = "latency";
      engine.restart();
      callbacks.onPhaseChange?.("latency");
      engine.play();
    },
  };
}

export function bpsToMbps(bps: number): number {
  return bps / 1e6;
}

export function formatMbps(mbps: number): string {
  if (!Number.isFinite(mbps) || mbps <= 0) return "0.00";
  if (mbps >= 100) return mbps.toFixed(0);
  if (mbps >= 10) return mbps.toFixed(1);
  return mbps.toFixed(2);
}

export function formatLatency(ms: number | undefined): string {
  if (ms === undefined || !Number.isFinite(ms)) return "—";
  return ms.toFixed(0);
}

export async function fetchClientNetwork(): Promise<ClientNetworkInfo> {
  const res = await fetch("/api/client-network", { cache: "no-store" });
  if (!res.ok) throw new Error("Network info unavailable");
  return res.json();
}

export async function fetchServerInfo(): Promise<ServerInfo> {
  const res = await fetch(`https://speed.cloudflare.com/cdn-cgi/trace?tid=${Date.now()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Server info unavailable");
  const text = await res.text();
  const colo = parseTraceField(text, "colo") ?? "edge";
  return { colo, label: `Cloudflare · ${colo}` };
}

function parseTraceField(text: string, key: string): string | null {
  for (const line of text.split("\n")) {
    const idx = line.indexOf("=");
    if (idx > 0 && line.slice(0, idx) === key) return line.slice(idx + 1).trim();
  }
  return null;
}

export const GAUGE_TICKS = [0, 5, 10, 50, 100, 250, 500, 750, 1000] as const;

export function mbpsToGaugeAngle(mbps: number): number {
  const v = Math.max(0, Math.min(1000, mbps));
  for (let i = 0; i < GAUGE_TICKS.length - 1; i++) {
    const lo = GAUGE_TICKS[i];
    const hi = GAUGE_TICKS[i + 1];
    if (v <= hi) {
      const segT = hi === lo ? 0 : (v - lo) / (hi - lo);
      const normalized = (i + segT) / (GAUGE_TICKS.length - 1);
      return 180 - normalized * 180;
    }
  }
  return 0;
}

export function phaseLabel(phase: SpeedPhase): string {
  switch (phase) {
    case "latency":
      return "Measuring ping…";
    case "download":
      return "Testing download…";
    case "upload":
      return "Testing upload…";
    case "done":
      return "Complete";
    default:
      return "Ready";
  }
}
