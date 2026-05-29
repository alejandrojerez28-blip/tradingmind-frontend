"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, CircleCheck, Clock, ShieldCheck } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { NeonCard } from "@/components/ui/NeonCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowButton } from "@/components/ui/GlowButton";
import { StatusPill } from "@/components/ui/StatusPill";
import { CyberDivider } from "@/components/ui/CyberDivider";
import { useDailyReport, useSchedulerStatus } from "@/hooks/useData";
import { usePersistStore } from "@/lib/store";
import { etDate, formatPnl, todayET } from "@/lib/utils";

const CHECKLIST = [
  { id: "plan", label: "Revisé mi plan de trading del día" },
  { id: "risk", label: "Defino capital de riesgo máximo (1R)" },
  { id: "bias", label: "Sin sesgo emocional / FOMO" },
  { id: "levels", label: "Niveles clave y catalizadores identificados" },
  { id: "rules", label: "Reglas de stop y salida claras" },
  { id: "size", label: "Tamaño de posición acorde a la cuenta" },
];

export default function BriefingPage() {
  const confirmedDate = usePersistStore((s) => s.briefingConfirmedDate);
  const confirmBriefing = usePersistStore((s) => s.confirmBriefing);
  const { data: scheduler } = useSchedulerStatus();
  const { data: report } = useDailyReport();

  const today = todayET();
  const alreadyConfirmed = confirmedDate === today;

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const allChecked = CHECKLIST.every((c) => checked[c.id]);

  function toggle(id: string) {
    setChecked((p) => ({ ...p, [id]: !p[id] }));
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-3xl space-y-5 p-5"
    >
      <NeonCard glow="cyan" className="holo-gradient text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-neon-cyan">
          Briefing pre-market
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-wide text-ink">
          {etDate()}
        </h1>
        <div className="mt-3 flex items-center justify-center gap-3">
          <StatusPill
            tone={scheduler?.running ? "green" : "amber"}
            label={scheduler?.running ? "SCHEDULER ON" : "SCHEDULER OFF"}
          />
          {alreadyConfirmed && (
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase text-neon-green">
              <CircleCheck className="h-4 w-4" /> Confirmado hoy
            </span>
          )}
        </div>
      </NeonCard>

      <NeonCard>
        <SectionHeader title="Checklist mental" accent="violet" />
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-2">
          {CHECKLIST.map((item) => {
            const on = !!checked[item.id];
            return (
              <motion.button
                key={item.id}
                variants={fadeInUp}
                onClick={() => toggle(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  on
                    ? "border-neon-green/40 bg-neon-green/10"
                    : "border-white/10 bg-void/40 hover:border-neon-cyan/30"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                    on ? "border-neon-green bg-neon-green/20" : "border-white/20"
                  }`}
                >
                  {on && <Check className="h-3.5 w-3.5 text-neon-green" />}
                </span>
                <span className={`font-mono text-sm ${on ? "text-ink" : "text-muted"}`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        <CyberDivider className="my-4" />

        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] text-muted">
            {Object.values(checked).filter(Boolean).length}/{CHECKLIST.length} completados
          </p>
          <GlowButton
            tone="green"
            onClick={() => confirmBriefing(today)}
            disabled={!allChecked || alreadyConfirmed}
          >
            <ShieldCheck className="h-4 w-4" />
            {alreadyConfirmed ? "Confirmado" : "Confirmar briefing"}
          </GlowButton>
        </div>
      </NeonCard>

      <div className="grid gap-3 sm:grid-cols-3">
        <NeonCard className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-neon-cyan" />
          <div>
            <p className="font-mono text-[10px] uppercase text-muted">Día de mercado</p>
            <p className="font-mono text-sm font-bold text-ink">
              {report?.market_day ? "Sí" : "No / cerrado"}
            </p>
          </div>
        </NeonCard>
        <NeonCard>
          <p className="font-mono text-[10px] uppercase text-muted">P&L acumulado hoy</p>
          <p
            className={`mt-1 font-mono text-lg font-bold ${
              (report?.gross_pnl_day ?? 0) >= 0 ? "text-neon-green" : "text-neon-red"
            }`}
          >
            {formatPnl(report?.gross_pnl_day ?? 0)}
          </p>
        </NeonCard>
        <NeonCard>
          <p className="font-mono text-[10px] uppercase text-muted">Disciplina hoy</p>
          <p className="mt-1 font-mono text-lg font-bold text-neon-cyan">
            {report?.discipline_score ?? "—"}
            <span className="text-dim text-xs"> /100</span>
          </p>
        </NeonCard>
      </div>
    </motion.div>
  );
}
