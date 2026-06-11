"use client";

import { Radar, Activity } from "lucide-react";
import { NeonCard } from "@/components/ui/NeonCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { GlowButton } from "@/components/ui/GlowButton";
import { useMonitorPositions, useSchedulerStatus, useTriggerScan } from "@/hooks/useData";
import { useSystemStore } from "@/lib/store";
import { relativeTime } from "@/lib/utils";

export function SystemStatus() {
  const { data } = useSchedulerStatus();
  const scan = useTriggerScan();
  const monitor = useMonitorPositions();
  const schedulerRunning = useSystemStore((s) => s.schedulerRunning);
  const pushEvent = useSystemStore((s) => s.pushEvent);

  function runScan() {
    scan.mutate(undefined, {
      onSuccess: (res) => {
        const allow = res.results.filter((r) => r.decision === "ALLOW").length;
        const block = res.results.filter((r) => r.decision === "BLOCK").length;
        pushEvent({
          kind: allow > 0 ? "ALLOW" : "BLOCK",
          message: `Scan manual: ${allow} ALLOW · ${block} BLOCK de ${res.results.length} tickers`,
        });
      },
    });
  }

  function runMonitor() {
    monitor.mutate(undefined, {
      onSuccess: () =>
        pushEvent({ kind: "INFO", message: "Monitor de posiciones ejecutado" }),
    });
  }

  return (
    <NeonCard className="h-full">
      <SectionHeader
        title="Sistema"
        right={
          <StatusPill
            tone={schedulerRunning ? "green" : "amber"}
            label={schedulerRunning ? "SCHEDULER ON" : "SCHEDULER OFF"}
          />
        }
      />
      <div className="space-y-2 font-mono text-[12px]">
        <div className="flex items-center justify-between">
          <span className="text-muted">Próximo scan</span>
          <span className="text-neon-cyan">{relativeTime(data?.next_scan)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Próximo reporte</span>
          <span className="text-neon-cyan">{relativeTime(data?.next_report)}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <GlowButton tone="cyan" size="sm" onClick={runScan} disabled={scan.isPending} className="flex-1">
          <Radar className="h-3.5 w-3.5" />
          {scan.isPending ? "Escaneando…" : "Scan manual"}
        </GlowButton>
        <GlowButton tone="violet" size="sm" onClick={runMonitor} disabled={monitor.isPending} className="flex-1">
          <Activity className="h-3.5 w-3.5" />
          {monitor.isPending ? "…" : "Monitor"}
        </GlowButton>
      </div>
    </NeonCard>
  );
}
