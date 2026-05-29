"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { fadeInUp } from "@/lib/motion";
import { NeonCard } from "@/components/ui/NeonCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DataNumber } from "@/components/ui/DataNumber";
import { Tabs } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";
import { TradesTable } from "@/components/modules/portfolio/TradesTable";
import { usePaperTrades } from "@/hooks/useData";
import { BASE_CAPITAL, capitalCurve, deriveKpis } from "@/lib/derive";
import { formatPnl, formatPrice, formatPct } from "@/lib/utils";

const EquityChart = dynamic(
  () => import("@/components/charts/EquityChart").then((m) => m.EquityChart),
  { ssr: false, loading: () => <Skeleton className="h-[260px] w-full" /> }
);

export default function PortfolioPage() {
  const { data: trades, isLoading } = usePaperTrades({ limit: 300 }, 15_000);
  const [tab, setTab] = useState("open");

  const all = useMemo(() => trades ?? [], [trades]);
  const open = all.filter((t) => t.status === "OPEN");
  const closed = all.filter((t) => t.status === "CLOSED");
  const kpis = trades ? deriveKpis(all) : undefined;
  const curve = useMemo(() => capitalCurve(all), [all]);

  const wins = closed.filter((t) => (t.simulated_pnl ?? 0) > 0).length;
  const winRate = closed.length ? (wins / closed.length) * 100 : 0;
  const exposure = open.reduce(
    (s, t) => s + (t.max_risk_dollars ?? t.simulated_cost ?? 0),
    0
  );

  const visible = tab === "open" ? open : tab === "closed" ? closed : all;

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="space-y-5 p-5"
    >
      <SectionHeader title="Portfolio" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <NeonCard glow="cyan">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Equity actual
          </p>
          <DataNumber
            value={formatPrice(kpis?.capitalNow ?? BASE_CAPITAL)}
            tone="cyan"
            glow
            className="mt-2 block text-2xl font-bold"
          />
        </NeonCard>
        <NeonCard>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            P&L total
          </p>
          <DataNumber
            value={formatPnl((kpis?.capitalNow ?? BASE_CAPITAL) - BASE_CAPITAL)}
            tone={
              (kpis?.capitalNow ?? BASE_CAPITAL) - BASE_CAPITAL >= 0 ? "green" : "red"
            }
            className="mt-2 block text-2xl font-bold"
          />
        </NeonCard>
        <NeonCard>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Win rate
          </p>
          <DataNumber
            value={formatPct(winRate, false).replace("+", "")}
            tone={winRate >= 50 ? "green" : "amber"}
            className="mt-2 block text-2xl font-bold"
          />
          <p className="mt-1 font-mono text-[11px] text-muted">
            {wins}/{closed.length} cerrados
          </p>
        </NeonCard>
        <NeonCard>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Exposición abierta
          </p>
          <DataNumber
            value={formatPrice(exposure)}
            tone="amber"
            className="mt-2 block text-2xl font-bold"
          />
          <p className="mt-1 font-mono text-[11px] text-muted">
            {open.length} posiciones
          </p>
        </NeonCard>
      </div>

      <NeonCard>
        <SectionHeader title="Curva de equity" accent="cyan" />
        {isLoading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : curve.length === 0 ? (
          <p className="py-16 text-center font-mono text-sm text-muted">
            La curva aparecerá cuando haya trades cerrados.
          </p>
        ) : (
          <EquityChart data={curve} />
        )}
      </NeonCard>

      <NeonCard noPad>
        <div className="flex items-center justify-between p-4 pb-3">
          <SectionHeader title="Operaciones" accent="violet" className="mb-0" />
          <Tabs
            items={[
              { id: "open", label: "Abiertas", count: open.length },
              { id: "closed", label: "Cerradas", count: closed.length },
              { id: "all", label: "Todas", count: all.length },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>
        {isLoading ? (
          <div className="space-y-2 p-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : (
          <TradesTable trades={visible} />
        )}
      </NeonCard>
    </motion.div>
  );
}
