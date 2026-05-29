"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Target, Activity, AlertTriangle } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { NeonCard } from "@/components/ui/NeonCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GradeBadge, gradeTone } from "@/components/ui/GradeBadge";
import { CircularGauge } from "@/components/ui/CircularGauge";
import { Tabs } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";
import { useScorecard } from "@/hooks/useData";
import { formatPct } from "@/lib/utils";

function Metric({
  label,
  value,
  tone = "text-ink",
  hint,
}: {
  label: string;
  value: string;
  tone?: string;
  hint?: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className="rounded-lg border border-white/5 bg-void/40 px-3 py-2.5"
    >
      <p className="font-mono text-[9px] uppercase tracking-wider text-dim">{label}</p>
      <p className={`mt-0.5 font-mono text-lg font-bold ${tone}`}>{value}</p>
      {hint && <p className="font-mono text-[10px] text-muted">{hint}</p>}
    </motion.div>
  );
}

const PERIODS = [
  { id: "30", label: "30d" },
  { id: "60", label: "60d" },
  { id: "90", label: "90d" },
];

export default function ScorecardPage() {
  const [period, setPeriod] = useState("60");
  const { data, isLoading } = useScorecard(Number(period));

  const perf = data?.performance;
  const disc = data?.discipline;
  const sig = data?.signal_quality;

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="space-y-5 p-5"
    >
      <div className="flex items-center justify-between">
        <SectionHeader title="Scorecard de evaluación" className="mb-0" />
        <Tabs items={PERIODS} active={period} onChange={setPeriod} />
      </div>

      {isLoading || !data ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <NeonCard key={i}>
              <Skeleton className="mb-3 h-6 w-40" />
              <Skeleton className="h-24 w-full" />
            </NeonCard>
          ))}
        </div>
      ) : (
        <>
          <NeonCard glow={gradeTone(data.overall_grade) === "green" ? "green" : gradeTone(data.overall_grade) === "amber" ? "amber" : "red"}>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex items-center gap-5">
                <CircularGauge
                  value={(perf?.win_rate ?? 0) * 100}
                  size={110}
                  tone={gradeTone(data.overall_grade) === "green" ? "green" : gradeTone(data.overall_grade) === "amber" ? "amber" : "red"}
                  label="Win rate"
                  display={`${Math.round((perf?.win_rate ?? 0) * 100)}%`}
                />
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                    Veredicto del sistema
                  </p>
                  <div className="mt-2">
                    <GradeBadge grade={data.overall_grade} size="lg" />
                  </div>
                  <p className="mt-2 font-mono text-xs text-muted">
                    {perf?.total_trades ?? 0} trades · capital sim.{" "}
                    {data.simulated_capital.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <CircularGauge value={Math.min(100, (perf?.profit_factor ?? 0) * 33)} size={72} tone="cyan" label="PF" display={(perf?.profit_factor ?? 0).toFixed(2)} />
                <CircularGauge value={disc?.stops_respected_pct ?? 0} size={72} tone="green" label="Stops" display={`${Math.round(disc?.stops_respected_pct ?? 0)}%`} />
                <CircularGauge value={sig?.avg_quality_score ?? 0} size={72} tone="violet" label="Calidad" display={`${Math.round(sig?.avg_quality_score ?? 0)}`} />
                <CircularGauge value={disc?.no_trade_journal_coverage_pct ?? 0} size={72} tone="amber" label="Journal" display={`${Math.round(disc?.no_trade_journal_coverage_pct ?? 0)}%`} />
              </div>
            </div>
          </NeonCard>

          <div className="grid gap-5 lg:grid-cols-3">
            <NeonCard>
              <SectionHeader title="Performance" accent="cyan" right={<Target className="h-4 w-4 text-neon-cyan" />} />
              <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 gap-2">
                <Metric label="Win rate" value={formatPct((perf?.win_rate ?? 0) * 100, false).replace("+", "")} tone={(perf?.win_rate ?? 0) >= 0.5 ? "text-neon-green" : "text-neon-amber"} />
                <Metric label="Profit factor" value={(perf?.profit_factor ?? 0).toFixed(2)} tone={(perf?.profit_factor ?? 0) >= 1.5 ? "text-neon-green" : "text-neon-amber"} />
                <Metric label="Expectancy" value={`$${(perf?.expectancy_dollars ?? 0).toFixed(2)}`} tone={(perf?.expectancy_dollars ?? 0) >= 0 ? "text-neon-green" : "text-neon-red"} />
                <Metric label="Avg R:R" value={(perf?.avg_rr_realized ?? 0).toFixed(2)} />
                <Metric label="Avg win" value={`$${(perf?.avg_win_dollars ?? 0).toFixed(2)}`} tone="text-neon-green" />
                <Metric label="Avg loss" value={`$${(perf?.avg_loss_dollars ?? 0).toFixed(2)}`} tone="text-neon-red" />
                <Metric label="Max drawdown" value={formatPct(-(perf?.max_drawdown_pct ?? 0), false)} tone="text-neon-red" />
                <Metric label="Sharpe" value={(perf?.sharpe_ratio ?? 0).toFixed(2)} />
              </motion.div>
            </NeonCard>

            <NeonCard>
              <SectionHeader title="Disciplina" accent="green" right={<ShieldCheck className="h-4 w-4 text-neon-green" />} />
              <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 gap-2">
                <Metric label="Violaciones" value={`${disc?.rule_violations ?? 0}`} tone={(disc?.rule_violations ?? 0) === 0 ? "text-neon-green" : "text-neon-red"} />
                <Metric label="Sin stop" value={`${disc?.trades_without_stop ?? 0}`} tone={(disc?.trades_without_stop ?? 0) === 0 ? "text-neon-green" : "text-neon-amber"} />
                <Metric label="Stops respetados" value={formatPct(disc?.stops_respected_pct ?? 0, false).replace("+", "")} tone="text-neon-green" />
                <Metric label="Fuera de horario" value={`${disc?.trades_outside_hours ?? 0}`} tone={(disc?.trades_outside_hours ?? 0) === 0 ? "text-neon-green" : "text-neon-amber"} />
                <Metric label="Cobertura journal" value={formatPct(disc?.no_trade_journal_coverage_pct ?? 0, false).replace("+", "")} tone="text-neon-cyan" />
              </motion.div>
            </NeonCard>

            <NeonCard>
              <SectionHeader title="Calidad de señal" accent="violet" right={<Activity className="h-4 w-4 text-neon-violet" />} />
              <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 gap-2">
                <Metric label="Quality score" value={`${(sig?.avg_quality_score ?? 0).toFixed(1)}`} tone="text-neon-violet" />
                <Metric label="No-trade rate" value={formatPct((sig?.no_trade_rate ?? 0) * 100, false).replace("+", "")} tone="text-neon-amber" />
                <Metric label="Slippage medio" value={formatPct((sig?.avg_slippage_pct ?? 0), false)} />
              </motion.div>
              <div className="mt-3">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-dim">
                  Top setups
                </p>
                {(sig?.top_setup_types ?? []).length === 0 ? (
                  <p className="font-mono text-xs text-muted">Sin datos suficientes.</p>
                ) : (
                  <div className="space-y-2">
                    {sig?.top_setup_types.slice(0, 4).map((s) => (
                      <div key={s.setup_type}>
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-ink">{s.setup_type}</span>
                          <span className="text-muted">
                            {s.count} · {formatPct(s.win_rate * 100, false).replace("+", "")}
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-neon-violet"
                            style={{ width: `${Math.min(100, s.win_rate * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </NeonCard>
          </div>

          {data.overall_grade !== "READY" && (
            <div className="flex items-center gap-3 rounded-lg border border-neon-amber/30 bg-neon-amber/5 px-4 py-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-neon-amber" />
              <p className="font-mono text-xs text-muted">
                El sistema aún no está calificado como <span className="text-neon-amber">READY</span>.
                Mantén la disciplina y acumula muestra antes de escalar capital.
              </p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
