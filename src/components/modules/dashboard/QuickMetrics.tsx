"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NeonCard } from "@/components/ui/NeonCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GradeBadge } from "@/components/ui/GradeBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useScorecardSummary } from "@/hooks/useData";
import { formatPct } from "@/lib/utils";

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-void/40 px-3 py-2">
      <p className="font-mono text-[9px] uppercase tracking-wider text-dim">{label}</p>
      <p className={`font-mono text-base font-bold ${tone ?? "text-ink"}`}>{value}</p>
    </div>
  );
}

export function QuickMetrics() {
  const { data, isLoading } = useScorecardSummary();

  return (
    <NeonCard className="h-full">
      <SectionHeader
        title="Scorecard"
        accent="violet"
        right={
          <Link
            href="/scorecard"
            className="flex items-center gap-1 font-mono text-[10px] uppercase text-neon-cyan hover:text-glow-cyan"
          >
            Ver <ArrowUpRight className="h-3 w-3" />
          </Link>
        }
      />
      {isLoading || !data ? (
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <GradeBadge grade={data.overall_grade} size="md" />
            <span className="font-mono text-[11px] text-muted">
              {data.total_trades} trades
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Stat
              label="Win Rate"
              value={formatPct(data.win_rate * 100, false).replace("+", "")}
              tone={data.win_rate >= 0.5 ? "text-neon-green" : "text-neon-amber"}
            />
            <Stat
              label="Profit Factor"
              value={data.profit_factor.toFixed(2)}
              tone={data.profit_factor >= 1.5 ? "text-neon-green" : "text-neon-amber"}
            />
          </div>
        </>
      )}
    </NeonCard>
  );
}
