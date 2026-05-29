"use client";

import { NeonCard } from "@/components/ui/NeonCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NeonBadge } from "@/components/ui/NeonBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatPnl, relativeTime } from "@/lib/utils";
import type { PaperTrade } from "@/lib/types";

export function RecentActivity({
  trades,
  loading,
}: {
  trades: PaperTrade[];
  loading?: boolean;
}) {
  const closed = trades
    .filter((t) => t.status === "CLOSED")
    .sort(
      (a, b) =>
        new Date(b.closed_at ?? 0).getTime() - new Date(a.closed_at ?? 0).getTime()
    )
    .slice(0, 8);

  return (
    <NeonCard className="h-full" noPad>
      <div className="p-4 pb-2">
        <SectionHeader title="Actividad reciente" accent="cyan" className="mb-0" />
      </div>
      {loading ? (
        <div className="space-y-2 p-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : closed.length === 0 ? (
        <p className="px-4 py-6 text-center font-mono text-sm text-muted">
          Aún no hay trades cerrados.
        </p>
      ) : (
        <div className="divide-y divide-white/5">
          {closed.map((t) => {
            const pnl = t.simulated_pnl ?? 0;
            return (
              <div
                key={t.id}
                className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-hover/40"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm font-bold text-ink">
                    {t.ticker}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-muted">
                    {t.setup_type ?? "—"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {t.quality_grade && (
                    <NeonBadge variant="ai">{t.quality_grade}</NeonBadge>
                  )}
                  <span
                    className={`font-mono text-sm font-bold ${
                      pnl >= 0 ? "text-neon-green" : "text-neon-red"
                    }`}
                  >
                    {formatPnl(pnl)}
                  </span>
                  <span className="hidden font-mono text-[10px] text-dim sm:inline">
                    {relativeTime(t.closed_at)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </NeonCard>
  );
}
