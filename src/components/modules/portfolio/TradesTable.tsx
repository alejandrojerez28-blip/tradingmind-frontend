"use client";

import { motion } from "framer-motion";
import { NeonBadge } from "@/components/ui/NeonBadge";
import { formatPnl, formatPrice, formatPct, relativeTime } from "@/lib/utils";
import type { PaperTrade } from "@/lib/types";

function statusVariant(s: string) {
  if (s === "OPEN") return "info" as const;
  if (s === "CLOSED") return "closed" as const;
  if (s === "BLOCKED") return "block" as const;
  return "neutral" as const;
}

export function TradesTable({ trades }: { trades: PaperTrade[] }) {
  if (trades.length === 0) {
    return (
      <p className="px-4 py-10 text-center font-mono text-sm text-muted">
        No hay trades en esta vista.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr className="border-b border-neon-cyan/15 text-left font-mono text-[10px] uppercase tracking-wider text-dim">
            <th className="px-4 py-2.5">Ticker</th>
            <th className="px-4 py-2.5">Setup</th>
            <th className="px-4 py-2.5">Estado</th>
            <th className="px-4 py-2.5 text-right">Entrada</th>
            <th className="px-4 py-2.5 text-right">Actual/Salida</th>
            <th className="px-4 py-2.5 text-right">P&L</th>
            <th className="px-4 py-2.5 text-center">Grade</th>
            <th className="px-4 py-2.5 text-right">Tiempo</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => {
            const pnl = t.simulated_pnl ?? 0;
            const last = t.status === "CLOSED" ? t.exit_price : t.current_price;
            return (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                className="border-b border-white/5 font-mono text-[12px] transition-colors hover:bg-hover/40"
              >
                <td className="px-4 py-2.5">
                  <span className="font-display font-bold text-ink">{t.ticker}</span>
                  {t.action && (
                    <span className="ml-2 text-[10px] uppercase text-muted">
                      {t.action}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-muted">{t.setup_type ?? "—"}</td>
                <td className="px-4 py-2.5">
                  <NeonBadge variant={statusVariant(t.status)}>{t.status}</NeonBadge>
                </td>
                <td className="px-4 py-2.5 text-right text-ink">
                  {formatPrice(t.entry_price)}
                </td>
                <td className="px-4 py-2.5 text-right text-neon-cyan">
                  {formatPrice(last)}
                </td>
                <td
                  className={`px-4 py-2.5 text-right font-bold ${
                    pnl > 0 ? "text-neon-green" : pnl < 0 ? "text-neon-red" : "text-muted"
                  }`}
                >
                  {formatPnl(pnl)}
                  <span className="ml-1 text-[10px] opacity-70">
                    {formatPct(t.simulated_pnl_pct, false)}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center">
                  {t.quality_grade ? (
                    <NeonBadge variant="ai">{t.quality_grade}</NeonBadge>
                  ) : (
                    <span className="text-dim">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right text-dim">
                  {relativeTime(t.closed_at ?? t.opened_at)}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
