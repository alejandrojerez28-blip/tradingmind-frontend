"use client";

import { motion } from "framer-motion";
import { NeonCard } from "@/components/ui/NeonCard";
import { DataNumber } from "@/components/ui/DataNumber";
import { CircularGauge } from "@/components/ui/CircularGauge";
import { Skeleton } from "@/components/ui/Skeleton";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { formatPnl, formatPrice, formatPct, pnlTone } from "@/lib/utils";
import type { Kpis } from "@/lib/derive";

interface KpiBarProps {
  kpis?: Kpis;
  disciplineScore?: number;
  loading?: boolean;
}

const toneToData = {
  green: "green",
  red: "red",
  neutral: "default",
} as const;

export function KpiBar({ kpis, disciplineScore, loading }: KpiBarProps) {
  if (loading || !kpis) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <NeonCard key={i}>
            <Skeleton className="mb-3 h-3 w-24" />
            <Skeleton className="h-7 w-32" />
          </NeonCard>
        ))}
      </div>
    );
  }

  const todayTone = pnlTone(kpis.pnlToday);
  const weekTone = pnlTone(kpis.pnlWeek);
  const discipline = disciplineScore ?? 100;

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      <motion.div variants={fadeInUp}>
        <NeonCard glow="cyan" className="h-full">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Capital Simulado
          </p>
          <DataNumber
            value={formatPrice(kpis.capitalNow)}
            tone="cyan"
            glow
            className="mt-2 block text-2xl font-bold"
            animateKey={kpis.capitalNow}
          />
          <p className="mt-1 font-mono text-[11px] text-muted">
            {formatPct(kpis.capitalPct)} vs base
          </p>
        </NeonCard>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <NeonCard className="h-full">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            P&L Hoy
          </p>
          <DataNumber
            value={formatPnl(kpis.pnlToday)}
            tone={toneToData[todayTone]}
            glow={todayTone !== "neutral"}
            className="mt-2 block text-2xl font-bold"
            animateKey={kpis.pnlToday}
          />
          <p className="mt-1 font-mono text-[11px] text-muted">
            {formatPct(kpis.pnlTodayPct)}
          </p>
        </NeonCard>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <NeonCard className="h-full">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            P&L Semana
          </p>
          <DataNumber
            value={formatPnl(kpis.pnlWeek)}
            tone={toneToData[weekTone]}
            glow={weekTone !== "neutral"}
            className="mt-2 block text-2xl font-bold"
            animateKey={kpis.pnlWeek}
          />
          <p className="mt-1 font-mono text-[11px] text-muted">
            {formatPct(kpis.pnlWeekPct)}
          </p>
        </NeonCard>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <NeonCard className="flex h-full items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Discipline
            </p>
            <DataNumber
              value={`${discipline}`}
              tone={discipline >= 80 ? "green" : discipline >= 50 ? "amber" : "red"}
              className="mt-2 block text-2xl font-bold"
            />
            <p className="mt-1 font-mono text-[11px] text-muted">/ 100</p>
          </div>
          <CircularGauge
            value={discipline}
            size={64}
            thickness={6}
            tone={discipline >= 80 ? "green" : discipline >= 50 ? "amber" : "red"}
          />
        </NeonCard>
      </motion.div>
    </motion.div>
  );
}
