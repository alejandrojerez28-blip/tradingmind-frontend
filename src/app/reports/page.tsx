"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, TrendingUp, TrendingDown, Ban } from "lucide-react";
import { fadeInUp } from "@/lib/motion";
import { NeonCard } from "@/components/ui/NeonCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NeonBadge } from "@/components/ui/NeonBadge";
import { DataNumber } from "@/components/ui/DataNumber";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDailyReport, useDailyReportHistory, useWeeklyLearningReport } from "@/hooks/useData";
import { formatPnl, formatPrice } from "@/lib/utils";

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const { data: report, isLoading } = useDailyReport(selectedDate);
  const { data: history } = useDailyReportHistory(14);
  const { data: weeklyLearning } = useWeeklyLearningReport(7);

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="grid gap-5 p-5 lg:grid-cols-[260px_1fr]"
    >
      <div className="space-y-3">
        <SectionHeader title="Historial" accent="cyan" />
        <NeonCard noPad>
          <div className="max-h-[70vh] divide-y divide-white/5 overflow-y-auto">
            {!history ? (
              <div className="space-y-2 p-3">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : history.length === 0 ? (
              <p className="p-4 font-mono text-xs text-muted">Sin reportes.</p>
            ) : (
              history.map((r) => {
                const active = (selectedDate ?? history[0]?.report_date) === r.report_date;
                const up = r.gross_pnl_day >= 0;
                return (
                  <button
                    key={r.report_date}
                    onClick={() => setSelectedDate(r.report_date)}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-hover/40 ${
                      active ? "bg-neon-cyan/10" : ""
                    }`}
                  >
                    <span className="font-mono text-[11px] text-ink">{r.report_date}</span>
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        up ? "text-neon-green" : "text-neon-red"
                      }`}
                    >
                      {formatPnl(r.gross_pnl_day)}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </NeonCard>
      </div>

      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHeader
            title={report ? `Reporte · ${report.report_date}` : "Reporte diario"}
            className="mb-0"
            right={report?.market_day ? <NeonBadge variant="info">Día de mercado</NeonBadge> : undefined}
          />
          <label className="flex items-center gap-2 rounded-lg border border-neon-cyan/20 bg-void/40 px-3 py-1.5">
            <CalendarDays className="h-4 w-4 text-neon-cyan" />
            <input
              type="date"
              value={selectedDate ?? ""}
              onChange={(e) => setSelectedDate(e.target.value || undefined)}
              className="bg-transparent font-mono text-xs text-ink outline-none [color-scheme:dark]"
            />
          </label>
        </div>

        {isLoading || !report ? (
          <NeonCard>
            <Skeleton className="mb-3 h-6 w-48" />
            <Skeleton className="h-24 w-full" />
          </NeonCard>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <NeonCard glow={report.gross_pnl_day >= 0 ? "green" : "red"}>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  P&L del día
                </p>
                <DataNumber
                  value={formatPnl(report.gross_pnl_day)}
                  tone={report.gross_pnl_day >= 0 ? "green" : "red"}
                  glow
                  className="mt-2 block text-2xl font-bold"
                />
              </NeonCard>
              <NeonCard>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Disciplina
                </p>
                <DataNumber
                  value={`${report.discipline_score}`}
                  tone={report.discipline_score >= 80 ? "green" : "amber"}
                  className="mt-2 block text-2xl font-bold"
                />
                <p className="mt-1 font-mono text-[11px] text-muted">/ 100</p>
              </NeonCard>
              <NeonCard>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Abiertos / Cerrados
                </p>
                <p className="mt-2 font-mono text-2xl font-bold text-neon-cyan">
                  {report.trades_opened}
                  <span className="text-dim"> / </span>
                  {report.trades_closed}
                </p>
              </NeonCard>
              <NeonCard>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Bloqueados
                </p>
                <p className="mt-2 flex items-center gap-2 font-mono text-2xl font-bold text-neon-red">
                  <Ban className="h-5 w-5" />
                  {report.trades_blocked}
                </p>
              </NeonCard>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <NeonCard className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-neon-green" />
                <div>
                  <p className="font-mono text-[10px] uppercase text-muted">Mejor trade</p>
                  <p className="font-mono text-lg font-bold text-neon-green">
                    {formatPnl(report.best_trade_pnl)}
                  </p>
                </div>
              </NeonCard>
              <NeonCard className="flex items-center gap-3">
                <TrendingDown className="h-5 w-5 text-neon-red" />
                <div>
                  <p className="font-mono text-[10px] uppercase text-muted">Peor trade</p>
                  <p className="font-mono text-lg font-bold text-neon-red">
                    {formatPnl(report.worst_trade_pnl)}
                  </p>
                </div>
              </NeonCard>
            </div>

            {report.notes && (
              <NeonCard className="holo-gradient">
                <p className="font-mono text-[10px] uppercase tracking-widest text-neon-cyan">
                  Notas del sistema
                </p>
                <p className="mt-2 whitespace-pre-line font-mono text-xs leading-relaxed text-ink">
                  {report.notes}
                </p>
              </NeonCard>
            )}

            {weeklyLearning && (
              <NeonCard>
                <p className="font-mono text-[10px] uppercase tracking-widest text-neon-cyan">
                  Learning semanal ({weeklyLearning.window_days}d)
                </p>
                <p className="mt-2 font-mono text-xs text-ink">
                  Win-rate {weeklyLearning.kpis.win_rate_pct.toFixed(2)}% · Net PnL{" "}
                  {formatPnl(weeklyLearning.kpis.net_pnl)} · Reject rate{" "}
                  {weeklyLearning.kpis.broker_reject_rate_pct.toFixed(2)}%
                </p>
                <p className="mt-2 whitespace-pre-line font-mono text-[11px] text-muted">
                  {weeklyLearning.learning_actions.join(" ")}
                </p>
              </NeonCard>
            )}

            <NeonCard noPad>
              <div className="p-4 pb-2">
                <SectionHeader title="Operaciones del día" accent="violet" className="mb-0" />
              </div>
              {report.entries.length === 0 ? (
                <p className="px-4 py-8 text-center font-mono text-sm text-muted">
                  Sin operaciones registradas este día.
                </p>
              ) : (
                <div className="divide-y divide-white/5">
                  {report.entries.map((e) => {
                    const pnl = e.simulated_pnl ?? 0;
                    return (
                      <div
                        key={e.trade_id}
                        className="flex items-center justify-between px-4 py-2.5 font-mono text-[12px]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-display font-bold text-ink">{e.ticker}</span>
                          <span className="text-[10px] uppercase text-muted">
                            {e.setup_type ?? "—"}
                          </span>
                          <NeonBadge variant={e.status === "CLOSED" ? "closed" : "info"}>
                            {e.status}
                          </NeonBadge>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-muted">{formatPrice(e.entry_price)}</span>
                          {e.close_reason && (
                            <span className="hidden text-[10px] uppercase text-dim sm:inline">
                              {e.close_reason}
                            </span>
                          )}
                          <span
                            className={`font-bold ${
                              pnl > 0 ? "text-neon-green" : pnl < 0 ? "text-neon-red" : "text-muted"
                            }`}
                          >
                            {formatPnl(e.simulated_pnl)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </NeonCard>
          </>
        )}
      </div>
    </motion.div>
  );
}
