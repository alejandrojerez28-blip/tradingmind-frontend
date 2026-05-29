"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowLeft, Radar } from "lucide-react";
import { fadeInUp } from "@/lib/motion";
import { NeonCard } from "@/components/ui/NeonCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NeonBadge } from "@/components/ui/NeonBadge";
import { GlowButton } from "@/components/ui/GlowButton";
import { CircularGauge } from "@/components/ui/CircularGauge";
import { Skeleton } from "@/components/ui/Skeleton";
import { TradesTable } from "@/components/modules/portfolio/TradesTable";
import { useNoTradeJournal, usePaperTrades, useTriggerScan } from "@/hooks/useData";
import { useSystemStore } from "@/lib/store";
import { seededSparkline } from "@/lib/utils";
import type { CurvePoint } from "@/lib/derive";

const EquityChart = dynamic(
  () => import("@/components/charts/EquityChart").then((m) => m.EquityChart),
  { ssr: false, loading: () => <Skeleton className="h-[260px] w-full" /> }
);

export default function SignalPage() {
  const params = useParams<{ ticker: string }>();
  const ticker = (params.ticker ?? "").toUpperCase();
  const scan = useTriggerScan();
  const pushEvent = useSystemStore((s) => s.pushEvent);

  const { data: trades, isLoading } = usePaperTrades({ limit: 300 });
  const { data: blocks } = useNoTradeJournal({ ticker, limit: 20 });

  const tickerTrades = (trades ?? []).filter((t) => t.ticker === ticker);
  const open = tickerTrades.filter((t) => t.status === "OPEN");

  const series: CurvePoint[] = useMemo(() => {
    const raw = seededSparkline(ticker, 60);
    const now = Math.floor(Date.now() / 1000);
    return raw.map((v, i) => ({
      time: now - (raw.length - i) * 3600,
      value: Number((100 + v).toFixed(2)),
    }));
  }, [ticker]);

  const avgQuality =
    tickerTrades.length > 0
      ? tickerTrades.reduce((s, t) => s + (t.quality_score ?? 0), 0) /
        tickerTrades.length
      : 0;

  function runScan() {
    scan.mutate(undefined, {
      onSuccess: (res) => {
        const r = res.results.find((x) => x.ticker === ticker);
        pushEvent({
          kind: r?.decision === "ALLOW" ? "ALLOW" : r?.decision === "BLOCK" ? "BLOCK" : "INFO",
          message: r
            ? `${ticker}: ${r.decision}${r.reason_code ? ` (${r.reason_code})` : ""}`
            : `Scan ejecutado (sin resultado directo para ${ticker})`,
        });
      },
    });
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="space-y-5 p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/watchlist"
            className="text-muted transition-colors hover:text-neon-cyan"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-2xl font-bold tracking-wide text-ink text-glow-cyan">
            {ticker}
          </h1>
          {open.length > 0 && <NeonBadge variant="info">{open.length} abiertas</NeonBadge>}
        </div>
        <GlowButton tone="cyan" size="sm" onClick={runScan} disabled={scan.isPending}>
          <Radar className="h-3.5 w-3.5" />
          {scan.isPending ? "Escaneando…" : "Evaluar setup"}
        </GlowButton>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <NeonCard>
          <SectionHeader title="Contexto de precio" accent="cyan" />
          <EquityChart data={series} />
          <p className="mt-2 font-mono text-[11px] text-dim">
            * Serie indicativa para contexto visual. La decisión real proviene del scanner / trade guard.
          </p>
        </NeonCard>

        <NeonCard className="flex flex-col items-center justify-center gap-3">
          <SectionHeader title="Calidad media" accent="violet" className="self-start" />
          <CircularGauge
            value={avgQuality}
            size={130}
            tone="violet"
            label="quality score"
            display={avgQuality > 0 ? avgQuality.toFixed(0) : "—"}
          />
          <p className="font-mono text-[11px] text-muted">
            {tickerTrades.length} trades históricos
          </p>
        </NeonCard>
      </div>

      <NeonCard noPad>
        <div className="p-4 pb-2">
          <SectionHeader title="Operaciones del ticker" accent="green" className="mb-0" />
        </div>
        {isLoading ? (
          <div className="space-y-2 p-4">
            {[0, 1].map((i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : (
          <TradesTable trades={tickerTrades} />
        )}
      </NeonCard>

      <NeonCard noPad>
        <div className="p-4 pb-2">
          <SectionHeader title="Bloqueos registrados" accent="red" className="mb-0" />
        </div>
        {!blocks || blocks.length === 0 ? (
          <p className="px-4 py-6 text-center font-mono text-sm text-muted">
            Sin bloqueos para {ticker}.
          </p>
        ) : (
          <div className="divide-y divide-white/5">
            {blocks.map((b) => (
              <div key={b.id} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <NeonBadge variant={b.decision === "BLOCK" ? "block" : "warn"}>
                    {b.primary_reason_code ?? b.decision}
                  </NeonBadge>
                  <span className="font-mono text-[11px] text-muted">
                    {b.primary_reason ?? "—"}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-dim">
                  {b.setup_type ?? ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </NeonCard>
    </motion.div>
  );
}
