"use client";

import Link from "next/link";
import { ShieldAlert, ArrowUpRight } from "lucide-react";
import { NeonCard } from "@/components/ui/NeonCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NeonBadge } from "@/components/ui/NeonBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useNoTradeJournal } from "@/hooks/useData";
import { relativeTime } from "@/lib/utils";

export function AlertsFeed() {
  const { data, isLoading } = useNoTradeJournal({ limit: 8 });

  return (
    <NeonCard className="h-full" noPad>
      <div className="p-4 pb-2">
        <SectionHeader
          title="Bloqueos & Alertas"
          accent="red"
          className="mb-0"
          right={
            <Link
              href="/journal"
              className="flex items-center gap-1 font-mono text-[10px] uppercase text-neon-cyan hover:text-glow-cyan"
            >
              Journal <ArrowUpRight className="h-3 w-3" />
            </Link>
          }
        />
      </div>
      {isLoading ? (
        <div className="space-y-2 p-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <p className="px-4 py-6 text-center font-mono text-sm text-muted">
          Sin bloqueos registrados.
        </p>
      ) : (
        <div className="divide-y divide-white/5">
          {data.map((e) => (
            <div key={e.id} className="flex items-start gap-3 px-4 py-2.5">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-neon-red" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-bold text-ink">
                    {e.ticker ?? "—"}
                  </span>
                  <NeonBadge variant={e.decision === "BLOCK" ? "block" : "warn"}>
                    {e.primary_reason_code ?? e.decision}
                  </NeonBadge>
                </div>
                <p className="truncate font-mono text-[11px] text-muted">
                  {e.primary_reason ?? e.setup_type ?? "—"}
                </p>
              </div>
              <span className="shrink-0 font-mono text-[10px] text-dim">
                {relativeTime(e.created_at ?? e.evaluated_at)}
              </span>
            </div>
          ))}
        </div>
      )}
    </NeonCard>
  );
}
