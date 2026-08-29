"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Building2, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { SpeedGauge } from "@/components/apps/SpeedGauge";
import {
  createSpeedTest,
  fetchClientNetwork,
  fetchServerInfo,
  formatLatency,
  formatMbps,
  phaseLabel,
  type ClientNetworkInfo,
  type ServerInfo,
  type SpeedPhase,
  type SpeedTestEngineHandle,
  type SpeedTestFinalResult,
  type SpeedTestLiveState,
} from "@/lib/speed-test";

type AppPhase = SpeedPhase | "error";

export function SpeedTestApp() {
  const engineRef = useRef<SpeedTestEngineHandle | null>(null);
  const [phase, setPhase] = useState<AppPhase>("idle");
  const [live, setLive] = useState<SpeedTestLiveState | null>(null);
  const [final, setFinal] = useState<SpeedTestFinalResult | null>(null);
  const [client, setClient] = useState<ClientNetworkInfo | null>(null);
  const [server, setServer] = useState<ServerInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchClientNetwork(), fetchServerInfo()])
      .then(([network, serverInfo]) => {
        if (cancelled) return;
        setClient(network);
        setServer(serverInfo);
      })
      .catch(() => {
        if (!cancelled) setClient({ ip: "—", isp: null, city: null, country: null });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function ensureEngine() {
    if (engineRef.current) return engineRef.current;

    const engine = await createSpeedTest({
      onPhaseChange: setPhase,
      onUpdate: setLive,
      onFinish: (result) => {
        setFinal(result);
        setPhase("done");
      },
      onError: (message) => {
        setError(message || "Could not complete the test. Check your connection and try again.");
        setPhase("error");
      },
    });

    engineRef.current = engine;
    return engine;
  }

  async function startTest() {
    setError(null);
    setFinal(null);
    setLive(null);

    try {
      const engine = await ensureEngine();
      if (phase === "done" || phase === "error") engine.restart();
      else engine.start();
    } catch {
      setError("Could not start the test. Check your connection and try again.");
      setPhase("error");
    }
  }

  const pingMs = final?.pingMs ?? live?.pingMs;
  const downloadMbps = final?.downloadMbps ?? live?.downloadMbps ?? 0;
  const uploadMbps = final?.uploadMbps ?? live?.uploadMbps ?? 0;
  const downLoadedLatency = final?.downLoadedLatencyMs ?? live?.downLoadedLatencyMs;
  const upLoadedLatency = final?.upLoadedLatencyMs ?? live?.upLoadedLatencyMs;

  const gaugeMbps =
    phase === "upload" ? uploadMbps : phase === "download" ? downloadMbps : 0;

  const currentGaugeMode: "download" | "upload" = phase === "upload" ? "upload" : "download";
  const gaugeActive = phase === "download" || phase === "upload";
  const running = phase === "latency" || phase === "download" || phase === "upload";

  const showDownload =
    phase === "download" || phase === "upload" || phase === "done" || live?.downloadMbps !== undefined;
  const showUpload = phase === "upload" || phase === "done" || live?.uploadMbps !== undefined;

  return (
    <div className="flex h-full flex-col px-4 py-3">
      <div className="grid grid-cols-2 gap-3">
        <TopStat
          icon={<ArrowDown className="h-3.5 w-3.5" />}
          label="Download"
          value={showDownload ? `${formatMbps(downloadMbps)} Mbps` : "—"}
          active={phase === "download"}
          done={phase === "done" || phase === "upload"}
        />
        <TopStat
          icon={<ArrowUp className="h-3.5 w-3.5" />}
          label="Upload"
          value={showUpload ? `${formatMbps(uploadMbps)} Mbps` : "—"}
          active={phase === "upload"}
          done={phase === "done"}
        />
      </div>

      <div className="mt-3 flex items-center justify-center gap-4">
        <LatencyPill
          icon={<Zap className="h-3.5 w-3.5 text-amber-500" />}
          label="Ping"
          value={pingMs !== undefined ? `${formatLatency(pingMs)} ms` : "—"}
          active={phase === "latency"}
          done={phase !== "idle" && phase !== "latency" && phase !== "error"}
        />
        <LatencyPill
          icon={<ArrowDown className="h-3 w-3" />}
          label="Down"
          value={downLoadedLatency !== undefined ? `${formatLatency(downLoadedLatency)} ms` : "—"}
          active={phase === "download"}
          done={phase === "upload" || phase === "done"}
        />
        <LatencyPill
          icon={<ArrowUp className="h-3 w-3" />}
          label="Up"
          value={upLoadedLatency !== undefined ? `${formatLatency(upLoadedLatency)} ms` : "—"}
          active={phase === "upload"}
          done={phase === "done"}
        />
      </div>

      <p className="mt-2 text-center text-xs font-medium text-muted">
        {phase === "error" ? "Test failed" : phaseLabel(phase)}
      </p>

      <div className="flex flex-1 flex-col items-center justify-center">
        <SpeedGauge
          mbps={gaugeMbps}
          mode={currentGaugeMode}
          phase={phase === "error" ? "idle" : phase}
          pingMs={pingMs}
          active={gaugeActive || phase === "latency"}
        />

        <Button
          onClick={startTest}
          disabled={running}
          variant={phase === "done" ? "secondary" : "primary"}
          size="lg"
          className="mt-2 min-w-[120px]"
        >
          {running ? "Testing…" : phase === "done" ? "Test again" : "GO"}
        </Button>
      </div>

      {error && <p className="mb-2 text-center text-xs text-red-500">{error}</p>}

      <div className="mt-auto grid grid-cols-2 gap-3 border-t border-line pt-3 text-xs">
        <div className="flex min-w-0 items-start gap-2">
          <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{client?.isp ?? "Your connection"}</p>
            <p className="truncate tabular-nums text-muted">{client?.ip ?? "…"}</p>
          </div>
        </div>
        <div className="flex min-w-0 items-start justify-self-end gap-2 text-right">
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{server?.label ?? "Cloudflare"}</p>
            <p className="truncate text-muted">{server?.colo ?? "edge"}</p>
          </div>
          <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
        </div>
      </div>

      <p className="mt-2 text-center text-[10px] text-faint">Powered by Cloudflare edge network</p>
    </div>
  );
}

function TopStat({
  icon,
  label,
  value,
  active,
  done,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  active?: boolean;
  done?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2.5 transition-colors duration-300",
        active ? "border-accent/40 bg-accent/5" : "border-line bg-surface",
        done && !active && "border-line bg-surface",
      )}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted">
        {icon}
        {label}
      </div>
      <p
        className={cn(
          "mt-1 font-display text-lg font-semibold tabular-nums transition-colors duration-300",
          active ? "text-accent" : "text-ink",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function LatencyPill({
  icon,
  label,
  value,
  active,
  done,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  active?: boolean;
  done?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-center gap-1 text-[10px] text-muted">
        {icon}
        <span>{label}</span>
      </div>
      <p
        className={cn(
          "text-sm font-semibold tabular-nums transition-colors duration-300",
          active ? "text-accent" : done ? "text-ink" : "text-muted",
        )}
      >
        {value}
      </p>
    </div>
  );
}
